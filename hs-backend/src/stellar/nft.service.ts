import StellarSdk from "@stellar/stellar-sdk";
import { server } from "./stellar.config";
import { fundWallet } from "./wallet.service";

export async function deployNFT() {
  // Create keypairs for issuer and distributor
  const issuerKeypair = StellarSdk.Keypair.random();
  const distributorKeypair = StellarSdk.Keypair.random();

  // fund the wallets
  await fundWallet(issuerKeypair.publicKey());
  await fundWallet(distributorKeypair.publicKey());

  // Define your NFT asset (use a unique code)
  const nftAsset = new StellarSdk.Asset("CHM", issuerKeypair.publicKey());

  // Load the distributor account
  const distributorAccount = await server.loadAccount(
    distributorKeypair.publicKey()
  );

  // Build transaction to establish trustline and mint NFT
  const transaction = new StellarSdk.TransactionBuilder(distributorAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset: nftAsset,
        limit: "100000",
      })
    )
    .addOperation(
      StellarSdk.Operation.payment({
        destination: distributorKeypair.publicKey(),
        asset: nftAsset,
        amount: "1",
        source: issuerKeypair.publicKey(),
      })
    )
    .addOperation(
      StellarSdk.Operation.setOptions({
        masterWeight: 0, // Lock the issuer account to prevent more minting
        source: issuerKeypair.publicKey(),
      })
    )
    .setTimeout(30)
    .build();

  // Sign with both keypairs
  transaction.sign(distributorKeypair);
  transaction.sign(issuerKeypair);

  // Submit to network
  const result = await server.submitTransaction(transaction);
  console.log("NFT deployed:", result);
}

export async function getNFTs(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey);

    // Filter balances for potential NFTs
    const nfts = account.balances
      .filter((balance) => {
        // NFTs are typically assets with specific characteristics
        return (
          balance.asset_type !== "native" && balance.balance === "1.0000000"
        ); // Often NFTs have a supply of 1
      })
      .map((e: any) => {
        return {
          asset_type: e.asset_type,
          balance: e.balance,
          asset_code: e.asset_code,
        };
      });

    console.log("Potential NFTs:", nfts);

    return nfts;
  } catch (error) {
    console.error("Error fetching account:", error);
  }
}

// getNFTs("GABUXL4YM52I4LAPZPWAU5NBEYG46E77WWTRGTX3IVHSNIJZDDL2BGIU");
