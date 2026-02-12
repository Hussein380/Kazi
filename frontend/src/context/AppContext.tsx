import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User, Employee, Employer, UserRole } from "@/types";
import { sampleWorkers, sampleEmployer } from "@/lib/sampleData";
import { getEmployeeProfile, type AuthResponse } from "@/lib/api";

const AUTH_STORAGE_KEY = "trusty_work_auth";

interface StoredAuth {
  publicKey: string;
  role: UserRole;
  name: string;
  phone: string;
  county: string;
  workTypes?: string[];
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  publicKey: string | null;
  workers: Employee[];
  employer: Employer | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildUserFromAuth(auth: any): User {
  const base: User = {
    id: auth.publicKey,
    role: auth.role,
    name: auth.name,
    phone: auth.phone,
    location: auth.county,
    publicKey: auth.publicKey,
    createdAt: new Date(),
  };

  if (auth.role === "employee") {
    return {
      ...base,
      workTypes: auth.workTypes ?? [],
      bio: "",
      yearsExperience: 0,
      badges: [],
      attestations: [],
      isAvailable: true,
      profile: auth.profile ?? {},
    };
  }

  return base;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const storedAuth = getStoredAuth();

  const [currentUser, setCurrentUser] = useState<User | null>(
    storedAuth ? buildUserFromAuth(storedAuth) : null,
  );
  const [userRole, setUserRole] = useState<UserRole | null>(
    storedAuth?.role ?? null,
  );
  const [publicKey, setPublicKey] = useState<string | null>(
    storedAuth?.publicKey ?? null,
  );

  useEffect(() => {
    if (currentUser && currentUser.role === "employee") {
      refreshUserProfile();
    }
  }, [currentUser, currentUser]);

  const refreshUserProfile = async () => {
    if (!currentUser) return;

    const profileData = await getEmployeeProfile(currentUser.publicKey);

    const updatedUser = {
      ...currentUser,
      profile: profileData,
    };

    setCurrentUser(updatedUser);

    // Also update the stored auth data to keep it in sync
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      const updatedAuth = {
        ...storedAuth,
        profile: profileData,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));
    }
  };
  const login = (data: any) => {
    const auth = {
      publicKey: data.publicKey,
      role: data.role,
      name: data.name,
      phone: data.phone,
      county: data.county,
      ...(data.workTypes && { workTypes: data.workTypes }),
      profile: data.profile ?? {},
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    setPublicKey(data.publicKey);
    setUserRole(data.role);
    setCurrentUser(buildUserFromAuth(auth));
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setPublicKey(null);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        publicKey,
        workers: sampleWorkers,
        employer: sampleEmployer,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
