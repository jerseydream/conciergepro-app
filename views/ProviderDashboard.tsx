
import React, { useState, useEffect } from 'react';
import { User, ProviderInfos, ServiceRequest, RequestStatus } from '../types';
import { mockDb } from '../services/mockDb';
import { CheckCircle, XCircle, Clock, CheckCheck, Info } from 'lucide-react';

interface ProviderDashboardProps {
  user: User;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ user }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [info, setInfo] = useState<ProviderInfos | null>(null);

  useEffect(() => {
    const allRequests = mockDb.getRequests();
    setRequests(allRequests.filter(r => r.providerId === user.id));

    const allInfos = mockDb.getProviderInfos();
    setInfo(allInfos.find(i => i.userId === user.id) || null);
  }, [user.id]);

  const updateStatus = (requestId: string, newStatus: RequestStatus) => {
    const updated = requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
    setRequests(updated);
    
    const requestToUpdate = updated.find(r => r.id === requestId);
    if (requestToUpdate) {
      mockDb.updateRequest(requestToUpdate);
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'text-yellow-600 bg-yellow-50';
      case RequestStatus.ACCEPTED: return 'text-blue-600 bg-blue-50';
      case RequestStatus.COMPLETED: return 'text-green-600 bg-green-50';
      case RequestStatus.PAID: return 'text-purple-600 bg-purple-50';
      case RequestStatus.REJECTED: return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Bienvenue, {user.name}</h2>
          <p className="text-gray-500">Gérez vos prestations et demandes de services.</p>
        </div>
        <div className="flex items-center gap-3">
          {info?.isVerified && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Profil Vérifié
            </span>
          )}
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border flex items-center gap-2">
            <span className="text-sm font-medium">Statut :</span>
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-bold">Actif</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Demandes totales', val: requests.length, icon: Clock, color: 'blue' },
          { label: 'En attente', val: requests.filter(r => r.status === RequestStatus.PENDING).length, icon: Info, color: 'yellow' },
          { label: 'Terminées', val: requests.filter(r => r.status === RequestStatus.COMPLETED).length, icon: CheckCheck, color: 'green' },
          { label: 'Revenus (FCFA)', val: requests.filter(r => r.status === RequestStatus.PAID).reduce((acc, curr) => acc + (curr.price || 0), 0), icon: Info, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600 inline-block mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Historique des demandes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Client / Description</th>
                <th className="px-6 py-4">Date prévue</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length > 0 ? requests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">Demande #{req.id.slice(0, 5)}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{req.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(req.scheduledAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {req.status === RequestStatus.PENDING && (
                        <>
                          <button 
                            onClick={() => updateStatus(req.id, RequestStatus.ACCEPTED)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Accepter"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateStatus(req.id, RequestStatus.REJECTED)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Refuser"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {req.status === RequestStatus.ACCEPTED && (
                        <button 
                          onClick={() => updateStatus(req.id, RequestStatus.COMPLETED)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Marquer Terminée
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    Aucune demande reçue pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
