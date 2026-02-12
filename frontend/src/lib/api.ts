const API_BASE = "http://localhost:8000";

interface RegisterData {
  name: string;
  phone: string;
  county: string;
  role: "employee" | "employer";
  pin: string;
  workTypes?: string[];
}

interface LoginData {
  phone: string;
  pin: string;
}

export interface AuthResponse {
  publicKey: string;
  role: "employee" | "employer";
  name: string;
  phone: string;
  county: string;
  workTypes?: string[];
}

export interface Employee {
  publicKey: string;
  name: string;
  phone: string;
  county: string;
  role: "employee";
  workTypes?: string[];
  createdAt: string;
}

export interface JobData {
  employerId: string;
  employerName: string;
  title: string;
  workType: string;
  description: string;
  location: string;
  salary?: string;
  isLiveIn: boolean;
}

export interface AttestationData {
    employee_pk: string,
    workType: string,
    startDate: string
    endDate: string,
    description: string,
  }

export interface AttestationResponse {
  attestation: Record<string, unknown>;
  workHistory: Record<string, unknown>;
  nft: Record<string, unknown> | null;
  message: string;
}

export interface JobResponse {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  workType: string;
  description: string;
  location: string;
  salary?: string;
  isLiveIn: boolean;
  createdAt: string;
  status: string;
  stellarTx: Record<string, unknown>;
  message: string;
}

export interface WorkHistory {
  employee: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  attestationCID: string;
  nftResult: Record<string, unknown> | null;
  timestamp: string;
  status: string;
}

export interface EmployeeNFT {
  asset_type: string;
  balance: string;
  asset_code: string;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }

  return res.json();
}

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/api/employees`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employees");
  }

  return res.json();
}

export async function createJob(data: JobData): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to post job");
  }

  return res.json();
}

export async function getJobs(): Promise<JobData[]> {
  const res = await fetch(`${API_BASE}/api/jobs`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
}

export async function createAttestation(
  employerId: string,
  data: AttestationData
): Promise<AttestationResponse> {
  const res = await fetch(`${API_BASE}/api/employers/${employerId}/create-attestation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create attestation");
  }

  return res.json();
}

export async function getWorkHistory(): Promise<WorkHistory[]> {
  const res = await fetch(`${API_BASE}/api/work-histories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch work history");
  }

  return res.json();
}

export async function getEmployeeWorkHistory(employeeId: string): Promise<WorkHistory[]> {
  const res = await fetch(`${API_BASE}/api/employees/${employeeId}/work-history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employee work history");
  }

  return res.json();
}

export async function getEmployeeNFTs(employeeId: string): Promise<EmployeeNFT[]> {
  const res = await fetch(`${API_BASE}/api/employees/${employeeId}/nfts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employee NFTs");
  }

  return res.json();
}


export async function getEmployeeProfile(employeeId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/employees/${employeeId}/profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employee NFTs");
  }

  return res.json();
}
