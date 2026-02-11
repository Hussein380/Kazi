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
  } catch (error) {
    console.log(error);
  }
}

async function uploadJsonToPinata(payload: {}, name?: string) {
  try {
    const upload = await pinata.upload.public.json(payload).name(name ?? "");
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
const timestamp = format(currentDate, "yyyyMMddHHmmss");
const fileName = `work_history_${timestamp}`;

uploadJsonToPinata(workHistory).then(async (res) => {
  console.log(res);
  const employeeAccount = await server.loadAccount(workHistory.employee);

  const transaction = new StellarSdk.TransactionBuilder(employeeAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: workHistory.employee,
        asset: Asset.native(),
        amount: "0.0000001", // Minimal amount
      })
    )
    .addOperation(
      StellarSdk.Operation.manageData({
        name: fileName,
        value: res?.cid,
      })
    )
    .addMemo(StellarSdk.Memo.text(fileName))
    .setTimeout(30)
    .build();

  transaction.sign(platformKeypair);
  const submitRes = await server.submitTransaction(transaction);
  console.log(submitRes);
});

// fetchByCID("bafkreidvbhs33ighmljlvr7zbv2ywwzcmp5adtf4kqvlly67cy56bdtmve");
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
  return cid;
}

retrieveWorkHistoryCID(
  "GDDYUYQUJSCGSOVEOXLM5FO42J2SOOLVBLBXPGZU2I47H5QW65OBNVVT",
  fileName
);
