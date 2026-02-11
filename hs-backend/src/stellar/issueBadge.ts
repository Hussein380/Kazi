import StellarSdk from "@stellar/stellar-sdk";
import { networkPassphrase, server } from "./stellar.config";

export async function issueBadge(
  platformSecret: string,
  workerPublicKey: string,
  badgeType: string
) {
  const platformKeypair = StellarSdk.Keypair.fromSecret(platformSecret);
  const account = await server.loadAccount(platformKeypair.publicKey());

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.manageData({
        name: badgeType,
        value: "true",
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(platformKeypair);
  const result = await server.submitTransaction(tx);

  return result.hash;
}
