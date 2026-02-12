import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getNFTs } from "./stellar/nft.service";
import { Router } from "./routes";
import { addUser, getUserByPhone, hashPin, userExists } from "./store/userStore";
import { platformKeypair, server } from "./stellar/stellar.config";
import { pinata } from "./pinata";

const app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Hydrate user store from Stellar/IPFS on startup
async function hydrateUserStore() {
  try {
    const account = await server.loadAccount(platformKeypair.publicKey());
    let hydrated = 0;

    for (const [key, value] of Object.entries(account.data_attr || {})) {
      if (key.startsWith("employees_")) {
        const cid = Buffer.from(value, "base64").toString("utf-8");
        try {
          const ipfsData = await pinata.gateways.public.get(cid);
          const records = Array.isArray(ipfsData.data)
            ? ipfsData.data
            : ipfsData.data != null
            ? [ipfsData.data]
            : [];

          for (const record of records) {
            if (record.phoneNumber && !userExists(record.phone)) {
              addUser({
                name: record.name || "",
                phone: record.phoneNumber,
                county: record.county || "",
                role: record.role || "worker",
                pinHash: record.pinHash || "",
                publicKey: record.publicKey || "",
                workTypes: record.preferred_roles,
                createdAt: record.createdAt || new Date().toISOString(),
              });
              hydrated++;
            }
          }
        } catch (err) {
          console.error(`Error hydrating from ${key}:`, err);
        }
      }
    }

    console.log(`User store hydrated: ${hydrated} users loaded`);
  } catch (err) {
    console.error("Failed to hydrate user store:", err);
  }
}

app.post("/ussd", async (req, res) => {
  const { phoneNumber, text } = req.body;
  const input = text.split("*");

  let response = "";

  // STEP 1: LANGUAGE SELECTION
  if (text === "") {
    const nfts = await getNFTs(
      "GABUXL4YM52I4LAPZPWAU5NBEYG46E77WWTRGTX3IVHSNIJZDDL2BGIU"
    );
    response = `CON Your NFTs:
${nfts![0]!.asset_code} - ${Number(nfts![0].balance)}
    `;
  }

  // STEP 2: ROLE SELECTION
  else if (input.length === 1) {
    const lang = input[0];

    if (lang === "1" || lang === "2") {
      response = `CON Select Role:
1. Worker
2. Employer`;
    }
  }

  // STEP 3: REGISTER OR LOGIN
  else if (input.length === 2) {
    response = `CON
1. Register
2. Login`;
  }

  // STEP 4: REGISTER - CREATE PIN
  else if (input.length === 3 && input[2] === "1") {
    response = `CON Create 4-digit PIN`;
  } else if (input.length === 4 && input[2] === "1") {
    const role = input[1] === "1" ? "worker" : "employer";
    const pin = input[3];

    if (!userExists(phoneNumber)) {
      addUser({
        name: "",
        phone: phoneNumber,
        county: "",
        role: role as "worker" | "employer",
        pinHash: hashPin(pin),
        publicKey: "",
        createdAt: new Date().toISOString(),
      });
    }

    response = `END Registration successful`;
  }

  // STEP 4: LOGIN - ENTER PIN
  else if (input.length === 3 && input[2] === "2") {
    response = `CON Enter PIN`;
  } else if (input.length === 4 && input[2] === "2") {
    const enteredPin = input[3];
    const user = getUserByPhone(phoneNumber);

    if (!user || user.pinHash !== hashPin(enteredPin)) {
      response = `END Invalid PIN`;
    } else {
      // WORKER MENU
      if (user.role === "worker") {
        response = `CON Worker Menu:
1. My Reputation
2. My Payments
3. Toggle Availability`;
      }

      // EMPLOYER MENU
      else {
        response = `CON Employer Menu:
1. Post Urgent Job
2. Pay Salary`;
      }
    }
  }

  // WORKER OPTIONS
  else if (input[4] === "1") {
    response = `END Your Reputation Score: 1.6`;
  } else if (input[4] === "2") {
    response = `END Last Payment: 18,000 KES`;
  } else if (input[4] === "3") {
    response = `END Availability Updated`;
  }

  // EMPLOYER OPTIONS
  else if (input[4] === "1") {
    response = `CON Select Job Type:
1. Nanny
2. Housekeeper`;
  } else if (input[4] === "2") {
    response = `END Payment request sent`;
  } else {
    response = `END Invalid Option`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

app.use(Router);

hydrateUserStore().then(() => {
  app.listen(8000, () => {
    console.log("USSD server running on port 8000");
  });
});
