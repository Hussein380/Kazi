const API_BASE = "http://localhost:8000";

interface RegisterData {
  name: string;
  phone: string;
  county: string;
  role: "worker" | "employer";
  pin: string;
  workTypes?: string[];
}

interface LoginData {
  phone: string;
  pin: string;
}

export interface AuthResponse {
  publicKey: string;
  role: "worker" | "employer";
  name: string;
  phone: string;
  county: string;
  workTypes?: string[];
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
