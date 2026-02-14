
import { User, UserRole, ProviderInfos, ServiceRequest, Transaction, Notification } from '../types';

const STORAGE_KEYS = {
  USERS: 'cp_users',
  PROVIDERS: 'cp_providers',
  REQUESTS: 'cp_requests',
  TRANSACTIONS: 'cp_transactions',
  NOTIFICATIONS: 'cp_notifications',
  LOGGED_IN: 'cp_auth_user'
};

export const mockDb = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const admin = {
        id: 'admin-1',
        email: 'admin@conciergepro.com',
        name: 'Admin ConciergePro',
        role: UserRole.ADMIN,
        phone: '00000000',
        address: 'Dakar, Sénégal'
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([admin]));
    }
  },

  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  
  saveUser: (user: User) => {
    const users = mockDb.getUsers();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
  },

  updateUser: (updatedUser: User) => {
    const users = mockDb.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getProviderInfos: (): ProviderInfos[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVIDERS) || '[]'),
  
  saveProviderInfos: (info: ProviderInfos) => {
    const infos = mockDb.getProviderInfos();
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify([...infos, info]));
  },

  updateProviderInfos: (updated: ProviderInfos) => {
    const infos = mockDb.getProviderInfos().map(i => i.userId === updated.userId ? updated : i);
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(infos));
  },

  getRequests: (): ServiceRequest[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]'),
  
  saveRequest: (req: ServiceRequest) => {
    const reqs = mockDb.getRequests();
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([...reqs, req]));
  },

  updateRequest: (updated: ServiceRequest) => {
    const reqs = mockDb.getRequests().map(r => r.id === updated.id ? updated : r);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(reqs));
  },

  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]'),

  saveTransaction: (tx: Transaction) => {
    const txs = mockDb.getTransactions();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([...txs, tx]));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return data ? JSON.parse(data) : null;
  },

  login: (user: User) => localStorage.setItem(STORAGE_KEYS.LOGGED_IN, JSON.stringify(user)),
  
  logout: () => localStorage.removeItem(STORAGE_KEYS.LOGGED_IN)
};
