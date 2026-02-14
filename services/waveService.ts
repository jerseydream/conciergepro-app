
import { Transaction } from '../types';
import { mockDb } from './mockDb';

export const waveService = {
  createCheckoutSession: async (amount: number, requestId: string): Promise<string> => {
    // Simuler un appel API vers Wave
    return new Promise((resolve) => {
      setTimeout(() => {
        const reference = `WAVE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          requestId,
          amount,
          status: 'PENDING',
          reference,
          createdAt: new Date().toISOString()
        };
        mockDb.saveTransaction(newTx);
        resolve(reference);
      }, 1000);
    });
  },

  confirmPayment: async (reference: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const txs = mockDb.getTransactions();
        const tx = txs.find(t => t.reference === reference);
        if (tx) {
          tx.status = 'SUCCESS';
          localStorage.setItem('cp_transactions', JSON.stringify(txs));
          resolve(true);
        }
        resolve(false);
      }, 1500);
    });
  }
};
