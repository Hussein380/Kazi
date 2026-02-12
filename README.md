# Kazi — Blockchain-Verified Domestic Worker Marketplace

> **Built on Stellar.** Connecting Kenyan households with trusted domestic workers through immutable, blockchain-backed credentials.

---

## The Problem

In Kenya, over 2 million domestic workers — nannies, cleaners, cooks, and caregivers — operate in an informal economy with **no verifiable work history**. Employers have no reliable way to confirm a candidate's experience, and workers have no portable proof of their track record. The consequences are real:

- **For employers:** Hiring is a leap of faith. Fake references are common, and there is no centralized system to verify claims. A bad hire puts families and children at risk.
- **For workers:** Years of excellent service vanish when they move to a new employer. They cannot prove their experience, negotiate fair wages, or build a professional reputation. Their career is invisible.
- **The trust gap:** Both sides lose. Employers overpay for unverified candidates or underpay everyone out of caution. Skilled workers are trapped at the same wage as newcomers because they cannot differentiate themselves.

Traditional solutions (reference calls, agency databases) are fragile, centralized, and easy to forge. The informal domestic work sector needs a trust layer that neither party can tamper with.

---

## Our Solution

**Kazi** solves this by anchoring every employment record on the **Stellar blockchain**. When an employer attests that a worker served in their household, that attestation is stored permanently on-chain — no one can edit it, delete it, or fake it. The worker walks away with a verifiable, portable credential they own forever.

### How It Works (In 60 Seconds)

```
1. REGISTER  →  Both employer and worker create accounts.
                 Each gets a Stellar wallet automatically.

2. HIRE      →  Employer posts jobs. Workers browse and connect.

3. ATTEST    →  After a work period, the employer creates an
                 attestation confirming the worker's service.

4. CERTIFY   →  The attestation is stored on IPFS + Stellar.
                 An NFT certificate is minted and issued to the worker.

5. PROVE     →  The worker now has an immutable, on-chain work
                 history and can generate a verified CV anytime.
```

Every step from registration to attestation touches the Stellar blockchain — making the entire employment lifecycle transparent, tamper-proof, and owned by the worker.

---

## Stellar Blockchain — Where, How, and Why It's Crucial

Stellar is not a bolt-on feature. It is the **core trust infrastructure** of Kazi. Every critical action in the platform results in a Stellar transaction.

### Where Stellar Is Used

| Action | Stellar Operation | Why It Matters |
|---|---|---|
| **User Registration** | `createAccount` — a new Stellar keypair is generated and funded with 10,000 XLM | Every user gets a blockchain identity. Their public key becomes their permanent, portable ID across the platform. |
| **Profile Storage** | `manageData` — the IPFS CID of the user's profile is written to the platform's Stellar account | Profiles are anchored on-chain. Even if our servers go down, the data reference lives on Stellar forever. |
| **Job Posting** | `manageData` + `payment` — job data CID is stored on-chain with a micro-payment to the employer's account | Jobs are publicly verifiable. Anyone can audit what positions were posted and when. |
| **Work Attestation** | `manageData` — the attestation CID is stored under `attests_<timestamp>` | The employer's confirmation of employment is immutable. It cannot be retracted or forged after submission. |
| **Work History** | `manageData` — the work history CID is stored under `work_history_<timestamp>` | The worker's career record is built transaction by transaction, forming a verifiable on-chain resume. |
| **NFT Certificate** | `changeTrust` + `payment` + `setOptions` — a unique "CHM" asset is minted with supply of exactly 1, then the issuer is permanently locked | Each attestation produces a non-fungible token. The locked issuer guarantees no duplicates can ever be minted — true proof of work. |
| **Salary Payments** | `payment` — native XLM transfer from employer to worker | Direct, transparent payments with full transaction history on the public ledger. |
| **Contract Anchoring** | `manageData` — SHA-256 hash of employment contract stored on-chain | Contracts are tamper-evident. Any modification to the original text will produce a different hash. |

### The Stellar Services (Backend Architecture)

All blockchain logic lives in `hs-backend/src/stellar/` across 8 dedicated service modules:

```
stellar/
├── stellar.config.ts      →  Horizon server, network passphrase, platform keypair
├── wallet.service.ts       →  createWallet(), fundWallet(), getAccountBalance()
├── memo.service.ts         →  storeOnStellar() — core data anchoring with tx queue
├── nft.service.ts          →  deployNFT(), getNFTs() — certificate minting
├── payment.service.ts      →  paySalary() — XLM transfers
├── contract.service.ts     →  anchorContract() — contract hash storage
├── fund-platform.ts        →  fundPlatformAccount() — ensures platform has funds
└── keypair.service.ts      →  generateKeyPair() — utility
```

### Why Stellar (and Not Another Chain)

1. **Speed**: Transactions settle in 3-5 seconds — fast enough for a real-time user experience.
2. **Cost**: Fees are fractions of a cent (~0.00001 XLM), making it viable to record every attestation on-chain.
3. **Built-in asset issuance**: Stellar's native asset framework lets us mint NFT certificates without deploying smart contracts.
4. **`manageData` operations**: Stellar accounts can store up to 64 bytes of arbitrary data per key — perfect for anchoring IPFS content identifiers.
5. **Account locking**: By setting the issuer's master weight to 0, we permanently lock NFT supply at exactly 1 — guaranteeing uniqueness at the protocol level.

### NFT Certificate Deep Dive

When an employer attests a worker's service, the system mints a unique NFT:

```
Step 1:  Generate fresh issuer + distributor keypairs
Step 2:  Fund both accounts via Stellar Friendbot (testnet)
Step 3:  Distributor establishes a trustline for asset "CHM"
Step 4:  Issuer sends exactly 1 CHM to distributor
Step 5:  Issuer's master key weight is set to 0 (account locked permanently)
Step 6:  Transaction is signed by both keypairs and submitted
```

Once the issuer is locked, no additional CHM tokens can ever be created from that issuer — making each certificate a true one-of-one. The transaction memo includes `NFT for PoW - <worker_id>`, linking the certificate to the specific worker on the public ledger.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Blockchain** | Stellar SDK (`@stellar/stellar-sdk` v14.5), Stellar Testnet |
| **Decentralized Storage** | IPFS via Pinata SDK |
| **State Management** | React Context API + TanStack React Query |
| **Form Handling** | React Hook Form + Zod validation |
| **PDF Generation** | jsPDF (for CV export) |

---

## Project Structure

```
Kazi/
├── frontend/                        # React application
│   └── src/
│       ├── pages/                   # 12 page components
│       │   ├── Landing.tsx          # Home — hero, role selection, registration
│       │   ├── WorkerProfile.tsx    # Worker's profile, work history, NFTs
│       │   ├── WorkersList.tsx      # Browse all workers
│       │   ├── EmployeesList.tsx    # Employer view — browse workers for attestation
│       │   ├── JobsList.tsx         # Browse available jobs
│       │   ├── PostJob.tsx          # Create a job posting (employer)
│       │   ├── CreateAttestation.tsx # 3-step attestation form (employer)
│       │   ├── AttestationsList.tsx # View all attestations
│       │   ├── GenerateCV.tsx       # Export blockchain-verified CV as PDF
│       │   ├── EmployerDashboard.tsx # Employer main dashboard
│       │   └── EmployerJobs.tsx     # Employer's posted jobs
│       ├── components/              # Shared UI — Navbar, Layout, Registration modals
│       ├── context/                 # AppContext — auth state, user role, public key
│       ├── lib/                     # API client, constants, utilities
│       ├── types/                   # TypeScript interfaces (Worker, Job, Attestation)
│       └── hooks/                   # Custom React hooks
│
├── hs-backend/                      # Express API server
│   └── src/
│       ├── routes/index.ts          # All REST endpoints
│       ├── stellar/                 # 8 Stellar blockchain service modules
│       ├── pinata/index.ts          # IPFS upload/fetch via Pinata
│       ├── store/userStore.ts       # In-memory user store with PIN hashing
│       └── app.ts                   # Express app entry point (port 8000)
│
└── README.md
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (auto-creates Stellar wallet) |
| `POST` | `/api/auth/login` | Authenticate with phone + 4-digit PIN |

**Register request body:**
```json
{
  "name": "Jane Wanjiku",
  "phone": "+254712345678",
  "county": "Nairobi",
  "role": "employee",
  "pin": "1234",
  "workTypes": ["nanny", "cleaner"]
}
```

### Employees

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employees` | List all registered employees |
| `GET` | `/api/employees/:id` | Get employee by Stellar public key |
| `GET` | `/api/employees/:id/profile` | Full profile: work history + NFTs |
| `GET` | `/api/employees/:id/work-history` | Employee's on-chain work history |
| `GET` | `/api/employees/:id/nfts` | NFT certificates earned by employee |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs` | Post a new job (stored on Stellar + IPFS) |
| `GET` | `/api/jobs` | List all open jobs |

### Attestations & Work History

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/employers/:id/create-attestation` | Create attestation + mint NFT certificate |
| `GET` | `/api/work-histories` | All work history records from the blockchain |

---

## Data Flow Architecture

```
┌──────────────┐          ┌──────────────┐          ┌──────────────────┐
│   Frontend   │  ─REST─▶ │   Backend    │  ─SDK──▶ │  Stellar Testnet │
│  React App   │          │  Express API │          │    Horizon API   │
└──────────────┘          └──────┬───────┘          └──────────────────┘
                                 │
                                 │  Pinata SDK
                                 ▼
                          ┌──────────────┐
                          │  IPFS / Web3 │
                          │   Storage    │
                          └──────────────┘
```

**Why IPFS + Stellar together?**

Stellar's `manageData` operation supports up to 64 bytes per entry — not enough for full profiles or attestation records. So we store the full JSON payload on IPFS (via Pinata) and anchor the resulting **Content Identifier (CID)** on Stellar. The CID is a cryptographic hash of the content — if anyone modifies the data on IPFS, the CID changes and no longer matches what's recorded on Stellar. This gives us:

- **Scalability**: Unlimited data size on IPFS
- **Integrity**: CID anchored on Stellar acts as a tamper-proof seal
- **Availability**: Pinata's gateway ensures reliable IPFS retrieval

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- A Stellar Testnet-funded account (or use the included platform keypair)
- Pinata account for IPFS storage (API keys in `.env`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/kazi.git
cd kazi
```

### 2. Start the Backend

```bash
cd hs-backend
npm install
```

Create a `.env` file in `hs-backend/`:

```env
PLATFORM_SECRET=<your_stellar_secret_key>
STELLAR_HORIZON_BASE_URL=https://horizon-testnet.stellar.org

PINATA_JWT=<your_pinata_jwt>
PINATA_API_KEY=<your_pinata_api_key>
PINATA_API_SECRET=<your_pinata_api_secret>
PINATA_GATEWAY_URL=<your_pinata_gateway>.mypinata.cloud
```

```bash
npm run dev    # Starts on http://localhost:8000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev    # Starts on http://localhost:5173
```

### 4. Try It Out

1. **Register as an employer** — click "Find a Worker" on the landing page
2. **Register as a worker** (use a different phone number) — click "Looking for Job?"
3. **Post a job** as the employer from the Employer Dashboard
4. **Create an attestation** — go to Employees, select the worker, fill in the attestation form
5. **Check the worker's profile** — the attestation and NFT certificate will appear in their work history

---

## Key User Flows

### Employer Flow

```
Register → Post Jobs → Browse Workers → Create Attestation → NFT Minted
```

### Worker Flow

```
Register → Browse Jobs → Get Hired → Receive Attestation → View NFTs → Generate CV
```

### Attestation Flow (The Core Loop)

```
Employer selects worker
       │
       ▼
Fills attestation form
(work type, dates, description)
       │
       ▼
Backend uploads to IPFS ──────────▶ Returns CID
       │
       ▼
Mints NFT certificate ────────────▶ Unique "CHM" asset on Stellar
       │
       ▼
Stores attestation CID on Stellar ─▶ attests_<timestamp>
       │
       ▼
Stores work history CID on Stellar ─▶ work_history_<timestamp>
       │
       ▼
Worker now has:
  ✓ Immutable attestation record
  ✓ NFT proof-of-work certificate
  ✓ Updated on-chain work history
```

---

## Security Model

| Concern | Approach |
|---|---|
| **PIN storage** | SHA-256 hashed — raw PINs are never stored |
| **Wallet custody** | Platform creates and manages keypairs; workers interact via phone + PIN |
| **Data integrity** | IPFS CIDs anchored on Stellar — any tampering breaks the hash link |
| **NFT uniqueness** | Issuer account is permanently locked after minting (master weight = 0) |
| **Transaction ordering** | Mutex-based transaction queue prevents sequence number conflicts |

---

## Built For

This project was built for the Stellar ecosystem to demonstrate how blockchain technology can create **real-world impact** in informal labor markets. By making work history immutable and portable, Kazi gives domestic workers the ability to own their professional reputation — something no centralized platform can guarantee.

---

## License

ISC
