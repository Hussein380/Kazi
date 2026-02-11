export type UserRole = 'worker' | 'employer';

export type WorkType = 
  | 'nanny'
  | 'cleaner'
  | 'caregiver'
  | 'cook'
  | 'gardener'
  | 'houseManager'
  | 'driver'
  | 'security';

export type AttestationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export type BadgeType = 
  | 'firstJob'
  | 'reliable'
  | 'experienced'
  | 'superstar'
  | 'trusted';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  location: string;
  avatar?: string;
  createdAt: Date;
}

export interface Worker extends User {
  role: 'worker';
  workTypes: WorkType[];
  bio: string;
  yearsExperience: number;
  badges: Badge[];
  attestations: Attestation[];
  isAvailable: boolean;
}

export interface Employer extends User {
  role: 'employer';
  householdName?: string;
}

export interface Attestation {
  id: string;
  workerId: string;
  employerId: string;
  employerName: string;
  workType: WorkType;
  startDate: Date;
  endDate: Date;
  description: string;
  status: AttestationStatus;
  stellarTxHash?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedAt: Date;
  stellarTxHash?: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  workType: WorkType;
  description: string;
  location: string;
  salary?: string;
  isLiveIn: boolean;
  createdAt: Date;
  status: 'open' | 'closed';
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  message?: string;
  appliedAt: Date;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface GeneratedCV {
  summary: string;
  experience: {
    role: string;
    employer: string;
    period: string;
    description: string;
  }[];
  skills: string[];
  badges: {
    name: string;
    description: string;
  }[];
  generatedAt: Date;
}
