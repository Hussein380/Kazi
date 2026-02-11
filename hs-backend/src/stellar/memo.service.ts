import StellarSdk, { Asset } from "@stellar/stellar-sdk";
import { networkPassphrase, platformKeypair, server } from "./stellar.config";

export const storeOnStellar = async (
  destination: string,
  fileName: string,
  value: string
) => {
  const platformAccount = await server.loadAccount(platformKeypair.publicKey());

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
    .addMemo(StellarSdk.Memo.text(fileName))
    .setTimeout(30)
    .build();

  transaction.sign(platformKeypair);
  const submitRes = await server.submitTransaction(transaction);
  console.log(submitRes);

  return submitRes;
};
