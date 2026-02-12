import { storeOnStellar } from "../stellar/memo.service";
import { pinata, uploadJsonToPinata } from "../pinata";
import { createWallet } from "../stellar/wallet.service";
import express from "express";
import { platformKeypair, server, timestamp } from "../stellar/stellar.config";
import { getNFTs } from "../stellar/nft.service";
import {
  addUser,
  getUserByPhone,
  hashPin,
  userExists,
  StoredUser,
} from "../store/userStore";

export const Router = express.Router();

Router.post("/api/auth/register", async (req, res) => {
  try {
    const { name, phone, county, role, pin, workTypes } = req.body;

    // Validate required fields
    if (!name || !phone || !county || !role || !pin) {
      res.status(400).json({ error: "Missing required fields: name, phone, county, role, pin" });
      return;
    }

    if (!/^\+254\d{9}$/.test(phone)) {
      res.status(400).json({ error: "Phone must be in format +254XXXXXXXXX" });
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      res.status(400).json({ error: "PIN must be exactly 4 digits" });
      return;
    }

    if (role !== "worker" && role !== "employer") {
      res.status(400).json({ error: "Role must be 'worker' or 'employer'" });
      return;
    }

    if (userExists(phone)) {
      res.status(409).json({ error: "Phone number already registered" });
      return;
    }

    // Create Stellar wallet
    const newAccount = await createWallet();
    const pinHash = hashPin(pin);
    const createdAt = new Date().toISOString();

    // Build payload for IPFS (exclude raw pin, include hash)
    const ipfsPayload = {
      name,
      phone,
      county,
      role,
      pinHash,
      publicKey: newAccount.publicKey,
      ...(workTypes && { workTypes }),
      createdAt,
    };

    const uploadRes = await uploadJsonToPinata([ipfsPayload]);

    await storeOnStellar(
      newAccount.publicKey,
      `employees_${timestamp}`,
      uploadRes?.cid!
    );

    // Add to in-memory store
    addUser({
      name,
      phone,
      county,
      role,
      pinHash,
      publicKey: newAccount.publicKey,
      ...(workTypes && { workTypes }),
      createdAt,
    });

    res.status(201).json({
      publicKey: newAccount.publicKey,
      role,
      name,
      phone,
      county,
      ...(workTypes && { workTypes }),
    });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ error: "Registration failed" });
  }
});

Router.post("/api/auth/login", async (req, res) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      res.status(400).json({ error: "Phone and PIN are required" });
      return;
    }

    const user = getUserByPhone(phone);

    if (!user) {
      res.status(401).json({ error: "Invalid phone or PIN" });
      return;
    }

    if (user.pinHash !== hashPin(pin)) {
      res.status(401).json({ error: "Invalid phone or PIN" });
      return;
    }

    res.status(200).json({
      publicKey: user.publicKey,
      role: user.role,
      name: user.name,
      phone: user.phone,
      county: user.county,
      ...(user.workTypes && { workTypes: user.workTypes }),
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
});

Router.get("/api/employees", async (req, res) => {
  try {
    const account = await server.loadAccount(platformKeypair.publicKey());
    let employees: any[] = [];

    for (const [key, value] of Object.entries(account.data_attr || {})) {
      if (key.startsWith("employees_") && !key.includes("attestations")) {
        const cid = Buffer.from(value, "base64").toString("utf-8");

        try {
          const ipfsData = await pinata.gateways.public.get(cid);

          if (Array.isArray(ipfsData.data)) {
            employees = [...employees, ...ipfsData.data];
          } else if (ipfsData.data != null) {
            employees = [...employees, ipfsData.data];
          }
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
        }
      }
    }

    employees.sort(
      (a, b) =>
        new Date(a.timestamp || a.createdAt).getTime() -
        new Date(b.timestamp || b.createdAt).getTime()
    );

    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

Router.get("/api/employees/:id/work-history", async (req, res) => {
  const { id } = req.params;

  const allWorkHistories = await fetch(
    "http://localhost:8000/api/work-histories"
  );

  if (!allWorkHistories.ok || allWorkHistories.status !== 200) {
    res.status(500).json(allWorkHistories.text);
    return;
  }

  const employeeWorkHistory = await allWorkHistories.json();
  const data = employeeWorkHistory.filter((wh: any) => {
    return wh.employee === id;
  });
  res.status(200).json(data);
});

Router.get("/api/work-histories", async (req, res) => {
  try {
    const account = await server.loadAccount(platformKeypair.publicKey());
    let workHistory: any[] = [];

    for (const [key, value] of Object.entries(account.data_attr || {})) {
      if (key.startsWith("work_history")) {
        const cid = Buffer.from(value, "base64").toString("utf-8");

        try {
          const ipfsData = await pinata.gateways.public.get(cid);

          if (Array.isArray(ipfsData.data)) {
            workHistory = [...workHistory, ...ipfsData.data];
          } else if (ipfsData.data != null) {
            workHistory = [...workHistory, ipfsData.data];
          }
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
        }
      }
    }

    workHistory.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    res.status(200).json(workHistory);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

Router.get("/api/employees/:id/nfts", async (req, res) => {
  const { id } = req.params;

  try {
    const nfts = await getNFTs(id);
    res.status(200).json(nfts);
  } catch (e) {
    console.log(e);
  }
});

Router.post("/api/employers/:id/create-attestation", async (req, res) => {
  const { id } = req.params;
  const { employee_pk } = req.body;

  try {
    const uploadRes = await uploadJsonToPinata([req.body]);

    const storageRes = await storeOnStellar(
      employee_pk,
      `employees_attestations_${timestamp}`,
      uploadRes?.cid!
    );
    res.status(201).json(storageRes);
  } catch (e) {
    console.log(e);
  }
});
