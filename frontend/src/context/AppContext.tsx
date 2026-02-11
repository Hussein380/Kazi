import { useState, createContext, useContext, ReactNode } from 'react';
import { User, Worker, Employer, UserRole } from '@/types';
import { sampleWorkers, sampleEmployer } from '@/lib/sampleData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  workers: Worker[];
  employer: Employer | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  return (
    <AppContext.Provider 
      value={{
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        workers: sampleWorkers,
        employer: sampleEmployer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
