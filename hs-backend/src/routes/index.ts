import { storeOnStellar } from "../stellar/memo.service";
import { pinata, uploadJsonToPinata } from "../pinata";
import { createWallet, fundWallet } from "../stellar/wallet.service";
import express from "express";
import { platformKeypair, server, generateTimestamp } from "../stellar/stellar.config";
import { getNFTs, deployNFT } from "../stellar/nft.service";
import {
  addUser,
  getUserByPhone,
  hashPin,
  userExists,
  StoredUser,
} from "../store/userStore";
import axios from "axios";
import { fundPlatformAccount } from "../stellar/fund-platform";

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

    if (role !== "employee" && role !== "employer") {
      res.status(400).json({ error: "Role must be 'worker' or 'employer'" });
      return;
    }

    if (userExists(phone)) {
      res.status(409).json({ error: "Phone number already registered" });
      return;
    }

    // Create Stellar wallet
    const newAccount = await createWallet();
    
    await fundPlatformAccount()
    
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

    const ts = generateTimestamp();

    if(role === 'employer'){
      await storeOnStellar(
        newAccount.publicKey,
        `employers_${ts}`,
        uploadRes.cid
      );
    }

    await storeOnStellar(
        newAccount.publicKey,
        `employees_${ts}`,
        uploadRes.cid
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

    res.status(200).json(employees.filter(emp => emp.role === "employee"));
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
  const { 
    employee_pk, 
    workType, 
    startDate, 
    endDate, 
    description,
  } = req.body;

  try {
    // 1. Upload attestation data to IPFS
    const attestationData = {
      employee_pk,
      employer_pk: id,
      startDate,
      endDate,
      description,
      createdAt: new Date().toISOString(),
      // status: "pending"
    };
    
    const uploadRes = await uploadJsonToPinata([attestationData]);

    await fundPlatformAccount();

    // 2. Deploy NFT certificate for the attestation
    let nftResult = null;
    try {
      nftResult = await deployNFT(employee_pk);
      console.log("NFT deployed successfully:", nftResult);
    } catch (nftError) {
      console.error("Warning: NFT deployment failed, continuing with attestation:", nftError);
    }

    // 3. Create work history entry
    const workHistoryData = {
      employee: employee_pk,
      employer: id,
      position: workType,
      startDate,
      endDate,
      description,
      attestationCID: uploadRes.cid,
      nftResult: nftResult || null,
      timestamp: new Date().toISOString(),
      status: "completed"
    };

    const workHistoryUploadRes = await uploadJsonToPinata([workHistoryData]);

    const ts = generateTimestamp();

    // 4. Store attestation on Stellar
    const storageRes = await storeOnStellar(
      employee_pk,
      `attests_${ts}`,
      uploadRes.cid
    );

    // 5. Store work history on Stellar
    const workHistoryStorageRes = await storeOnStellar(
      employee_pk,
      `work_history_${ts}`,
      workHistoryUploadRes.cid
    );

    res.status(201).json({
      attestation: storageRes,
      workHistory: workHistoryStorageRes,
      nft: nftResult,
      message: "Attestation created successfully with NFT certificate"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to create attestation", details: e });
  }
});

Router.get("/api/employees/:id/profile", async (req, res) => {
  const { id } = req.params;

  try {
    const workHistory = await axios.get(
      `http://localhost:8000/api/employees/${id}/work-history`
    );
    // console.log(workHistory);
    const personalProfile = await axios.get(
      `http://localhost:8000/api/employees/${id}`
    );
    // console.log(personalProfile);
    const certifications = await getNFTs(id);
    res.status(200).json({
      workHistory: workHistory.data,
      personalProfile: personalProfile.data,
      certifications,
    });
  } catch (e) {console.log(e);
  }
});

Router.get("/api/employees/:id", async (req, res) => {
  const { id } = req.params;

  const employees = await fetch("http://localhost:8000/api/employees");

  if (!employees.ok || employees.status !== 200) {
    res.status(500).json(employees.text);
  }

  const employeeWorkHistory = await employees.json();
  const data =
    employeeWorkHistory.filter((wh: any) => {
      return wh.publicKey === id;
    })[0] ?? {};
  res.status(200).json(data);
});

Router.post("/api/jobs", async (req, res) => {
  try {
    const {
      employerId,
      employerName,
      title,
      workType,
      description,
      location,
      salary,
      isLiveIn,
    } = req.body;

    // Validate required fields
    if (!employerId || !title || !workType || !description || !location) {
      res.status(400).json({
        error: "Missing required fields: employerId, title, workType, description, location",
      });
      return;
    }

    // Create job object
    const jobData = {
      employerId,
      employerName,
      title,
      workType,
      description,
      location,
      salary: salary || null,
      isLiveIn: isLiveIn || false,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    // Upload job data to IPFS
    const uploadRes = await uploadJsonToPinata([jobData]);

    const ts = generateTimestamp();

    // Store job on Stellar
    const storageRes = await storeOnStellar(
      employerId,
      `jobs_${ts}`,
      uploadRes.cid
    );

    res.status(201).json({
      id: uploadRes.cid,
      ...jobData,
      stellarTx: storageRes,
      message: "Job posted successfully on-chain",
    });
  } catch (error) {
    console.error("Job posting error:", error);
    res.status(500).json({ error: "Failed to post job", details: error });
  }
});

Router.get("/api/jobs", async (req, res) => {
  try {
    const account = await server.loadAccount(platformKeypair.publicKey());
    let jobs: any[] = [];

    for (const [key, value] of Object.entries(account.data_attr || {})) {
      if (key.startsWith("jobs_")) {
        const cid = Buffer.from(value, "base64").toString("utf-8");

        try {
          const ipfsData = await pinata.gateways.public.get(cid);

          if (Array.isArray(ipfsData.data)) {
            jobs = [...jobs, ...ipfsData.data];
          } else if (ipfsData.data != null) {
            jobs = [...jobs, ipfsData.data];
          }
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
        }
      }
    }

    jobs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default Router;
