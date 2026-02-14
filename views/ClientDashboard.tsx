
import React, { useState, useEffect } from 'react';
import { User, ServiceRequest, RequestStatus } from '../types';
import { mockDb } from '../services/mockDb';
import { waveService } from '../services/waveService';
import { CreditCard, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClientDashboardProps {
  user: User;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  const [requests, setRequests] = useState<(ServiceRequest & { providerName: string })[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const allRequests = mockDb.getRequests();
    const allUsers = mockDb.getUsers();
    
    const clientRequests = allRequests
      .filter(r => r.clientId === user.id)
      .map(r => {
        const provider = allUsers.find(u => u.id === r.providerId);
        return { ...r, providerName: provider?.name || 'Inconnu' };
      });
    
    setRequests(clientRequests);
  }, [user.id]);

  const handlePay = async (requestId: string) => {
    setIsPaying(true);
    try {
      // Simulation d'un montant fixe pour le test
      const amount = 15000; 
      const ref = await waveService.createCheckoutSession(amount, requestId);
      alert(`Simulation Wave: Redirection vers le paiement (Ref: ${ref})`);
      
      const success = await waveService.confirmPayment(ref);
      if (success) {
        const reqs = mockDb.getRequests();
        const updatedReq = reqs.find(r => r.id === requestId);
        if (updatedReq) {
          updatedReq.status = RequestStatus.PAID;
          updatedReq.price = amount;
          mockDb.updateRequest(updatedReq);
          
          setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: RequestStatus.PAID, price: amount } : r));
        }
        alert("Paiement effectué avec succès via Wave !");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement.");
    } finally {
      setIsPaying(false);
    }
  };

  const getStatusDisplay = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return { text: 'En attente', color: 'text-yellow-600 bg-yellow-50', icon: Clock };
      case RequestStatus.ACCEPTED: return { text: 'Acceptée', color: 'text-blue-600 bg-blue-50', icon: CheckCircle2 };
      case RequestStatus.COMPLETED: return { text: 'Terminée', color: 'text-green-600 bg-green-50', icon: CheckCircle2 };
      case RequestStatus.PAID: return { text: 'Payée', color: 'text-purple-600 bg-purple-50', icon: CheckCircle2 };
      case RequestStatus.REJECTED: return { text: 'Refusée', color: 'text-red-600 bg-red-50', icon: AlertCircle };
      default: return { text: status, color: 'text-gray-600 bg-gray-50', icon: Clock };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Mes Demandes</h2>
        <p className="text-gray-500">Suivez l'avancement de vos demandes de services.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.length > 0 ? requests.map(req => {
          const status = getStatusDisplay(req.status);
          return (
            <div key={req.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{req.providerName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {req.address}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                    <status.icon className="w-3.5 h-3.5" />
                    {status.text}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700 text-sm leading-relaxed">{req.description}</p>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div>Date : <span className="font-semibold text-gray-900">{new Date(req.scheduledAt).toLocaleDateString()}</span></div>
                  {req.price && <div>Montant : <span className="font-semibold text-gray-900">{req.price} FCFA</span></div>}
                </div>
              </div>

              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                {req.status === RequestStatus.COMPLETED && (
                  <button 
                    onClick={() => handlePay(req.id)}
                    disabled={isPaying}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
                  >
                    <CreditCard className="w-5 h-5" /> 
                    {isPaying ? 'Traitement...' : 'Payer avec Wave'}
                  </button>
                )}
                
                {req.status === RequestStatus.PAID && (
                  <div className="text-center py-2 px-6 bg-purple-50 text-purple-700 rounded-xl font-bold">
                    Paiement confirmé
                  </div>
                )}

                {req.status === RequestStatus.PENDING && (
                  <p className="text-sm text-gray-400 italic text-center">En attente de validation par le prestataire.</p>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="bg-white rounded-3xl py-20 text-center border-2 border-dashed border-gray-100">
            <div className="max-w-xs mx-auto space-y-4">
              <Clock className="w-12 h-12 mx-auto text-gray-200" />
              <p className="text-gray-400">Vous n'avez pas encore de demande active.</p>
              <button className="text-blue-600 font-bold hover:underline">Parcourir les prestataires</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
