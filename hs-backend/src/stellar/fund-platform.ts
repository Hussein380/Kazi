// fund-platform.ts
import { platformKeypair } from "./stellar.config";
import axios from "axios";

export async function fundPlatformAccount() {
  const publicKey = platformKeypair.publicKey();
  console.log("Platform Public Key:", publicKey);

  try {
    const res = await axios.get(
      `https://friendbot.stellar.org/?addr=${publicKey}`
    );
    console.log("Account funded successfully!");
    console.log(res.data);
  } catch (error) {
    console.error("Error funding account:", error);
  }
}

// fundPlatformAccount();
