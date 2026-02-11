import crypto from "crypto";
import StellarSdk from "@stellar/stellar-sdk";
import { server, networkPassphrase } from "./stellar.config";

export async function anchorContract(
  employerSecret: string,
  contractText: string
) {
  const hash = crypto.createHash("sha256").update(contractText).digest("hex");

  const keypair = StellarSdk.Keypair.fromSecret(employerSecret);
  const account = await server.loadAccount(keypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.manageData({
        name: "contract_hash",
        value: hash,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);

  return { hash, txHash: result.hash };
}
