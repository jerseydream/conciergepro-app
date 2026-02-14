
import React, { useState } from 'react';
import { User, ProviderInfos, UserRole, RequestStatus, ServiceRequest } from '../types';
import { mockDb } from '../services/mockDb';
import { MapPin, Phone, Star, ShieldCheck, ArrowLeft, Calendar, Send } from 'lucide-react';

interface ProviderDetailViewProps {
  provider: User & { info: ProviderInfos };
  currentUser: User | null;
  onBack: () => void;
  onRequestSuccess: () => void;
}

const ProviderDetailView: React.FC<ProviderDetailViewProps> = ({ provider, currentUser, onBack, onRequestSuccess }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Veuillez vous connecter pour faire une demande.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest: ServiceRequest = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: currentUser.id,
        providerId: provider.id,
        description,
        address: currentUser.address,
        scheduledAt: date,
        status: RequestStatus.PENDING,
        createdAt: new Date().toISOString()
      };

      mockDb.saveRequest(newRequest);
      setIsSubmitting(false);
      onRequestSuccess();
      alert("Demande envoyée avec succès !");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Retour aux prestataires
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl mx-auto mb-4">
              {provider.info.businessName.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{provider.info.businessName}</h2>
            <p className="text-blue-600 font-bold text-sm uppercase mb-4">{provider.info.job}</p>
            
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(provider.info.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
              ))}
              <span className="ml-2 text-gray-900 font-bold">{provider.info.rating}</span>
            </div>

            <div className="space-y-4 text-left border-t pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-blue-600" /> {provider.address}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-blue-600" /> {provider.phone}
              </div>
              {provider.info.isVerified && (
                <div className="flex items-center gap-3 text-sm text-green-600 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Prestataire vérifié
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Info & Form */}
        <div className="md:w-2/3 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-900">À propos</h3>
            <p className="text-gray-600 leading-relaxed">
              {provider.info.description || "Aucune description fournie par le prestataire."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Faire une demande de service</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description du besoin</label>
                <textarea 
                  required
                  placeholder="Décrivez précisément ce dont vous avez besoin (ex: Fuite d'eau sous l'évier...)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none h-32 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date souhaitée</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="date"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Lieu</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl cursor-not-allowed"
                      value={currentUser?.address || "Connectez-vous pour l'adresse"}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !currentUser}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
              </button>
              
              {!currentUser && (
                <p className="text-center text-sm text-red-500 font-medium">Vous devez être connecté en tant que client pour faire une demande.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailView;
