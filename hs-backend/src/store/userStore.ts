import crypto from "crypto";

export interface StoredUser {
  name: string;
  phone: string;
  county: string;
  role: "worker" | "employer";
  pinHash: string;
  publicKey: string;
  workTypes?: string[];
  createdAt: string;
}

const users = new Map<string, StoredUser>();

export function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

export function addUser(user: StoredUser): void {
  users.set(user.phone, user);
}

export function getUserByPhone(phone: string): StoredUser | undefined {
  return users.get(phone);
}

export function userExists(phone: string): boolean {
  return users.has(phone);
}

export function getAllUsers(): StoredUser[] {
  return Array.from(users.values());
}
