
export enum UserRole {
  ADMIN = 'ADMIN',
  PRESTATAIRE = 'PRESTATAIRE',
  CLIENT = 'CLIENT'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID'
}

export type JobType = 'MÉCANICIEN' | 'ÉLECTRICIEN' | 'PLOMBIER' | 'AGRICULTEUR' | 'OUVRIER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  avatar?: string;
}

export interface ProviderInfos {
  userId: string;
  businessName: string;
  job: JobType;
  description: string;
  interventionRadius: number; // in km
  isVerified: boolean;
  isActive: boolean;
  rating: number;
}

export interface ClientInfos {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  providerId: string;
  description: string;
  address: string;
  scheduledAt: string;
  status: RequestStatus;
  price?: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  requestId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  reference: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
