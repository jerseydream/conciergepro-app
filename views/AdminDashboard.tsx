
import React, { useState, useEffect } from 'react';
import { User, ProviderInfos, UserRole } from '../types';
import { mockDb } from '../services/mockDb';
import { Users, Briefcase, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<ProviderInfos[]>([]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'PROVIDERS'>('PROVIDERS');

  useEffect(() => {
    setUsers(mockDb.getUsers());
    setProviders(mockDb.getProviderInfos());
  }, []);

  const verifyProvider = (userId: string) => {
    const updated = providers.map(p => p.userId === userId ? { ...p, isVerified: true } : p);
    setProviders(updated);
    
    const infoToUpdate = updated.find(p => p.userId === userId);
    if (infoToUpdate) {
      mockDb.updateProviderInfos(infoToUpdate);
    }
  };

  const stats = [
    { label: 'Total Utilisateurs', val: users.length, icon: Users, color: 'blue' },
    { label: 'Prestataires', val: users.filter(u => u.role === UserRole.PRESTATAIRE).length, icon: Briefcase, color: 'indigo' },
    { label: 'Vérifiés', val: providers.filter(p => p.isVerified).length, icon: CheckCircle, color: 'green' },
    { label: 'En attente', val: providers.filter(p => !p.isVerified).length, icon: ShieldAlert, color: 'orange' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h2>
        <p className="text-gray-500">Contrôlez et gérez la plateforme ConciergePro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 inline-block mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('PROVIDERS')}
            className={`px-6 py-4 font-bold text-sm ${activeTab === 'PROVIDERS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Vérification Prestataires
          </button>
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`px-6 py-4 font-bold text-sm ${activeTab === 'USERS' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Liste Utilisateurs
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'PROVIDERS' ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Entreprise</th>
                  <th className="px-6 py-4">Métier</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {providers.map(p => {
                  const user = users.find(u => u.id === p.userId);
                  return (
                    <tr key={p.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-900">{p.businessName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.job}</td>
                      <td className="px-6 py-4">
                        {p.isVerified ? (
                          <span className="text-green-600 font-bold text-xs uppercase bg-green-50 px-2 py-1 rounded">Vérifié</span>
                        ) : (
                          <span className="text-orange-600 font-bold text-xs uppercase bg-orange-50 px-2 py-1 rounded">En attente</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!p.isVerified && (
                          <button 
                            onClick={() => verifyProvider(p.userId)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                          >
                            Vérifier
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Date Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${u.role === UserRole.ADMIN ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">01/01/2024</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
