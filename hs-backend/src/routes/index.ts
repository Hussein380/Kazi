import { storeOnStellar } from "../stellar/memo.service";
import { pinata, uploadJsonToPinata } from "../pinata";
import { createWallet } from "../stellar/wallet.service";
import express from "express";
import { platformKeypair, server, timestamp } from "../stellar/stellar.config";
import { parse } from "date-fns";
import axios from "axios";
import { getNFTs } from "../stellar/nft.service";

export const Router = express.Router();

Router.post("/api/auth/register", async (req, res) => {
  try {
    const newAccount = await createWallet();
    const payload = { ...req.body, publicKey: newAccount.publicKey };

    const uploadRes = await uploadJsonToPinata([payload]);

    const storageRes = await storeOnStellar(
      newAccount.publicKey,
      `employees_${timestamp}`,
      uploadRes?.cid!
    );
    res.status(201).json(storageRes);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

Router.get("/api/employees", async (req, res) => {
  try {
    const account = await server.loadAccount(platformKeypair.publicKey());
    let employees: any[] = [];

    for (const [key, value] of Object.entries(account.data_attr || {})) {
      if (key.startsWith("employees_")) {
        const cid = Buffer.from(value, "base64").toString("utf-8");
        const timestampStr = key.replace("employees_", "");

        try {
          // Fetch data from IPFS
          const ipfsData = await pinata.gateways.public.get(cid);

          // Ensure ipfsData.data is an array before spreading
          if (Array.isArray(ipfsData.data)) {
            employees = [...employees, ...ipfsData.data];
          } else if (ipfsData.data != null) {
            employees = [...employees, ipfsData.data];
          } // else, ipfsData.data is null, undefined, or not useful, so do nothing
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
        }
      }
    }

    // Sort oldest to newest
    employees.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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
        const timestampStr = key.replace("employees_", "");

        try {
          // Fetch data from IPFS
          const ipfsData = await pinata.gateways.public.get(cid);

          // Ensure ipfsData.data is an array before spreading
          if (Array.isArray(ipfsData.data)) {
            workHistory = [...workHistory, ...ipfsData.data];
          } else if (ipfsData.data != null) {
            workHistory = [...workHistory, ipfsData.data];
          } // else, ipfsData.data is null, undefined, or not useful, so do nothing
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
        }
      }
    }

    // Sort oldest to newest
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
