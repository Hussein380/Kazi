import StellarSdk from "@stellar/stellar-sdk";
import { server, networkPassphrase, platformKeypair } from "./stellar.config";
import axios from "axios";
import crypto from "crypto";

export async function createWallet() {
  const newAccount = StellarSdk.Keypair.random();

  const account = await server.loadAccount(platformKeypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: newAccount.publicKey(),
        startingBalance: "10000",
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(platformKeypair);
  await server.submitTransaction(tx);

  return {
    publicKey: newAccount.publicKey(),
    secret: newAccount.secret(),
  };

  //   console.log("New key pair created!");
  //   console.log("Account ID: " + newAccount.publicKey());
  //   console.log("Secret: " + newAccount.secret());

  //   const hashedPin = crypto.hash("sha256", newAccount.publicKey(), {});
  //   const res = await axios.get(
  //     `https://friendbot.stellar.org/?addr=${newAccount.publicKey()}`
  //   );

  //   console.log(res.data);
}

export async function fundWallet(publicKey: string) {
  console.log(`Funding public account -> ${publicKey}`);
  const res = await axios.get(
    `https://friendbot.stellar.org/?addr=${publicKey}`
  );

  return res.data;
}

export async function getAccountBalance(publicKey: string) {
  // Load the account using its public key
  const account = await server.loadAccount(publicKey);

  let balances: any = [];
  // Access the balances
  console.log("Balances for account: " + publicKey);
  account.balances.forEach(function (balance: any) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    balances.push({
      type: balance.asset_type,
      balance,
    });
  });

  return balances;
}
