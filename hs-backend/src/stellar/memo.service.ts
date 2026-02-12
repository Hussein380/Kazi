import StellarSdk, { Asset } from "@stellar/stellar-sdk";
import { networkPassphrase, platformKeypair, server } from "./stellar.config";

// Simple mutex to prevent concurrent transactions from using the same sequence number
let txQueue: Promise<void> = Promise.resolve();

export const storeOnStellar = async (
  destination: string,
  fileName: string,
  value: string
) => {
  // Validate manageData value length (Stellar limit: 64 bytes)
  if (Buffer.byteLength(value, "utf-8") > 64) {
    throw new Error(
      `manageData value exceeds 64-byte limit (${Buffer.byteLength(value, "utf-8")} bytes): ${value}`
    );
  }

  // Serialize transactions to avoid sequence number conflicts
  return new Promise<any>((resolve, reject) => {
    txQueue = txQueue.then(async () => {
      try {
        const platformAccount = await server.loadAccount(
          platformKeypair.publicKey()
        );

        // Truncate memo text to 28 bytes (Stellar limit for text memos)
        const memoText = fileName.length > 28 ? fileName.slice(0, 28) : fileName;

        const transaction = new StellarSdk.TransactionBuilder(platformAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destination,
              asset: Asset.native(),
              amount: "0.0000001",
            })
          )
          .addOperation(
            StellarSdk.Operation.manageData({
              name: fileName,
              value: value,
            })
          )
          .addMemo(StellarSdk.Memo.text(memoText))
          .setTimeout(30)
          .build();

        transaction.sign(platformKeypair);
        const submitRes = await server.submitTransaction(transaction);
        console.log(submitRes);
        resolve(submitRes);
      } catch (e) {
        reject(e);
      }
    });
  });
};
