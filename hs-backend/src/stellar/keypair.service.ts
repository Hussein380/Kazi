// generate-keypair.ts
import { Keypair } from "@stellar/stellar-sdk";

export const generateKeyPair = () => {
  const pair = Keypair.random();
  console.log("Public Key:", pair.publicKey());
  console.log("Secret Key:", pair.secret());

  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
  };
};
