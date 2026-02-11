import StellarSdk from "@stellar/stellar-sdk";
import { server, networkPassphrase } from "./stellar.config";

export async function paySalary(
  employerSecret: string,
  workerPublicKey: string,
  amount: string
) {
  const employerKeypair = StellarSdk.Keypair.fromSecret(employerSecret);
  const account = await server.loadAccount(employerKeypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: workerPublicKey,
        asset: StellarSdk.Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(employerKeypair);

  const result = await server.submitTransaction(tx);

  return result.hash;
}
