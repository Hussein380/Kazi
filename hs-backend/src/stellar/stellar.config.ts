import { Horizon, Networks, Keypair } from "@stellar/stellar-sdk";
import { format } from "date-fns";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const server = new Horizon.Server(process.env.STELLAR_HORIZON_BASE_URL!);

export const networkPassphrase = Networks.TESTNET;

export const platformKeypair = Keypair.fromSecret(process.env.PLATFORM_SECRET!);

const currentDate = new Date();
export const timestamp = format(currentDate, "yyyyMMddHHmmss");
