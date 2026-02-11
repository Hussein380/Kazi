import { PinataSDK } from "pinata";
import dotenv from "dotenv";
import StellarSdk, { Asset, Networks } from "@stellar/stellar-sdk";
import {
  networkPassphrase,
  platformKeypair,
  server,
} from "../stellar/stellar.config";
import { format } from "date-fns";
dotenv.config();

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY_URL!,
});

// main();

async function fetchByCID(cid: string) {
  try {
    const data = await pinata.gateways.public.get(cid);
    console.log(data);
    return data.data;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadJsonToPinata(payload: any, name?: string) {
  try {
    const upload = await pinata.upload.public
      .json(payload, {})
      .name(`${name ?? "data"}.json`);
    return upload;
  } catch (error) {
    console.log(error);
  }
}

const workHistory = {
  employee: "GDDYUYQUJSCGSOVEOXLM5FO42J2SOOLVBLBXPGZU2I47H5QW65OBNVVT",
  employer: "Acme Corp",
  position: "Senior Developer",
  startDate: "2023-01-01",
  endDate: "2025-12-31",
};

const currentDate = new Date();
export const timestamp = format(currentDate, "yyyyMMddHHmmss");
const fileName = `work_history_${timestamp}`;

// uploadJsonToPinata([workHistory])
//   .then(async (res) => {
//     console.log(res);
//     const platformAccount = await server.loadAccount(
//       platformKeypair.publicKey()
//     );

//     const transaction = new StellarSdk.TransactionBuilder(platformAccount, {
//       fee: StellarSdk.BASE_FEE,
//       networkPassphrase,
//     })
//       .addOperation(
//         StellarSdk.Operation.payment({
//           destination: workHistory.employee,
//           asset: Asset.native(),
//           amount: "0.0000001",
//         })
//       )
//       .addOperation(
//         StellarSdk.Operation.manageData({
//           name: fileName,
//           value: res?.cid,
//         })
//       )
//       .addMemo(StellarSdk.Memo.text(fileName))
//       .setTimeout(30)
//       .build();

//     transaction.sign(platformKeypair);
//     const submitRes = await server.submitTransaction(transaction);
//     console.log(submitRes);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// fetchByCID("bafkreiglrhf5l5nv4e63bbomcvduvael6546oqwu6j37t4vtwhwv3ugimi");
async function retrieveWorkHistoryCID(
  accountPublicKey: string,
  dataKey: string
) {
  const account = await server.loadAccount(accountPublicKey);

  console.log(account.data_attr);

  // Get the data entry
  const dataValue = account.data_attr?.[dataKey];

  if (!dataValue) {
    console.log("No data found for key:", dataKey);
    return null;
  }

  // Decode from base64
  const cid = Buffer.from(dataValue, "base64").toString("utf-8");
  console.log(cid);
  return cid;
}

// retrieveWorkHistoryCID(
//   "GAWXHLNVGZYDQHULH3HL7BD7X7U34VOIB2TVTOP3UQXI5N74T34PFZAD",
//   "work_history_20260211232537"
// );
