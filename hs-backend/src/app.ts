import express from "express";
import bodyParser from "body-parser";
import { getNFTs } from "./stellar/nft.service";
import { HorizonApi } from "@stellar/stellar-sdk/lib/horizon";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Fake in-memory store (replace with DB)
const users: any = {};
// Structure:
// users[phoneNumber] = { role: "worker" | "employer", pin: "1234", language: "en" }

app.post("/ussd", async (req, res) => {
  const { phoneNumber, text } = req.body;
  const input = text.split("*");

  let response = "";

  // STEP 1: LANGUAGE SELECTION
  if (text === "") {
    //     response = `CON Choose Language:
    // 1. English
    // 2. Kiswahili`;

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
    const role = input[1];

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

    users[phoneNumber] = { role, pin };

    response = `END Registration successful`;
  }

  // STEP 4: LOGIN - ENTER PIN
  else if (input.length === 3 && input[2] === "2") {
    response = `CON Enter PIN`;
  } else if (input.length === 4 && input[2] === "2") {
    const enteredPin = input[3];
    const user = users[phoneNumber];

    if (!user || user.pin !== enteredPin) {
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

app.listen(8000, () => {
  console.log("USSD server running on port 8000");
});
