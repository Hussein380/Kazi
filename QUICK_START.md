# Quick Start Guide - New Features

## For Testing the Implementation

### 1. **Job Posting Feature**

**As an Employer:**

1. Register or login as an employer
2. Go to **Dashboard** → Click "Post New Job" OR Navigate to `/jobs/new`
3. Fill in job details:
   - Job Title (e.g., "Live-in Nanny")
   - Work Type (select one of the available types)
   - Description
   - Location
   - Salary (optional)
   - Live-in toggle (if applicable)
4. Click "Post Job"
5. Confirm success message indicating job is on Stellar blockchain

**Verification:**

- Job is stored on Stellar blockchain via Pinata IPFS
- Workers can see the job in the jobs list

---

### 2. **Employee Browsing & Attestation Creation**

**As an Employer:**

1. After login, go to **Dashboard** → Click "Browse Employees" OR Navigate to `/employees`
2. View the list of all registered workers
3. Click on any employee card to see their details
4. Click "Create Attestation for [Name]" in the modal
5. Follow the three-step attestation form:
   - **Step 1:** Verify worker info and optionally add their public key
   - **Step 2:** Select work type and date range
   - **Step 3:** Add description and review
6. Click "Send Attestation"
7. Confirm success - NFT certificate has been deployed!

**What Happens Behind the Scenes:**

- ✅ Attestation data uploaded to IPFS
- ✅ NFT certificate deployed to employee's Stellar wallet
- ✅ Work history record created
- ✅ All data stored on Stellar blockchain
- ✅ Employee receives certification

---

### 3. **Auto-Funding on Registration**

**Testing:**

1. Register a **new account** (either as worker or employer)
2. Account is automatically created on Stellar
3. **Platform automatically funds the wallet** with testnet tokens
4. User can immediately participate in on-chain activities
5. No manual funding step needed!

---

### 4. **Data Verification**

**To Verify Jobs Are On-Chain:**

```bash
# Backend endpoint to view all jobs
GET http://localhost:8000/api/jobs
```

**To Verify Employees Are Registered:**

```bash
# Backend endpoint to view all employees
GET http://localhost:8000/api/employees
```

**To Check Work History:**

```bash
# View all work histories
GET http://localhost:8000/api/work-histories

# View specific employee's work history
GET http://localhost:8000/api/employees/{employeeId}/work-history
```

**To Check NFTs:**

```bash
# View NFTs earned by an employee
GET http://localhost:8000/api/employees/{employeeId}/nfts
```

---

## Common Scenarios

### Scenario 1: Fresh Registration & Job Posting

```
1. Create new employer account
   └─ Platform auto-funds wallet ✓
2. Navigate to Dashboard
3. Click "Post New Job"
4. Fill form & submit
   └─ Job stored on blockchain ✓
5. Verify job appears in /api/jobs endpoint
```

### Scenario 2: Create Attestation with NFT

```
1. Login as employer
2. Navigate to Browse Employees
3. Select an employee
4. Create Attestation
   └─ NFT deployed ✓
   └─ Work history created ✓
5. Check employee's NFTs via /api/employees/{id}/nfts
6. Verify work history created
```

### Scenario 3: Worker Journey

```
1. Register as worker
   └─ Platform auto-funds wallet ✓
2. View profile
3. Receive attestations from employers
4. See earned NFT certificates
5. Check work history in profile
```

---

## Troubleshooting

### "Failed to create attestation"

- Check employee public key is valid
- Ensure employer is logged in
- Verify network connectivity

### "Failed to post job"

- All required fields must be filled
- Employer account must be logged in
- Network connection should be active

### "Failed to fetch employees"

- Backend server must be running
- API base URL in frontend/src/lib/api.ts should match backend
- Check CORS settings if getting cross-origin errors

### Employee list is empty

- No employees have registered yet
- Try registering a test worker account first
- Refresh the page to reload data

---

## API Endpoints Reference

### Authentication

- `POST /api/auth/register` - Register new user (auto-funds wallet)
- `POST /api/auth/login` - Login user

### Jobs

- `POST /api/jobs` - Create new job (employer only)
- `GET /api/jobs` - Get all jobs

### Employees

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id/nfts` - Get employee's NFTs
- `GET /api/employees/:id/work-history` - Get employee's work history

### Attestations

- `POST /api/employers/:id/create-attestation` - Create attestation with NFT
- `GET /api/work-histories` - Get all work histories

---

## Frontend Routes

### Employer Routes

- `/employer` - Dashboard
- `/employer/jobs` - My Jobs list
- `/employees` - Browse Employees (NEW)
- `/jobs/new` - Post New Job (NEW)
- `/attestations/create` - Create Attestation (NEW)
- `/attestations` - View Attestations

### Worker Routes

- `/profile` - My Profile
- `/jobs` - Find Jobs
- `/workers` - Browse Workers
- `/cv/generate` - Generate CV

---

## Success Indicators

✅ **You'll know it's working when:**

1. **Registration** → User wallet is auto-funded (no error about insufficient balance)
2. **Job Posting** → Success message shows job is on Stellar blockchain
3. **Employee Browse** → All registered users appear in the list
4. **Attestation** → Success message confirms NFT was deployed
5. **Work History** → Shows up in /api/work-histories endpoint
6. **NFTs** → Appear in employee's NFT endpoint

---

## Key Features Recap

| Feature             | How to Access                        | Status     |
| ------------------- | ------------------------------------ | ---------- |
| Auto-fund wallet    | Register new account                 | ✅ Working |
| Post jobs on-chain  | Dashboard → Post New Job             | ✅ Working |
| Browse employees    | Dashboard → Browse Employees         | ✅ Working |
| Create attestations | Select employee → Create Attestation | ✅ Working |
| Deploy NFTs         | During attestation creation          | ✅ Working |
| Create work history | Automatic with attestation           | ✅ Working |
| View on-chain data  | API endpoints or blockchain explorer | ✅ Working |

---

## Next: Production Checklist

Before going live:

- [ ] Test all user scenarios
- [ ] Verify all blockchain transactions
- [ ] Set up production Stellar network
- [ ] Configure production Pinata credentials
- [ ] Update API base URLs for production
- [ ] Add comprehensive error logging
- [ ] Test with multiple concurrent users
- [ ] Verify data persistence
- [ ] Setup monitoring and alerts

---

**Happy Testing! 🚀**

For any questions or issues, refer to IMPLEMENTATION_SUMMARY.md for detailed technical information.
