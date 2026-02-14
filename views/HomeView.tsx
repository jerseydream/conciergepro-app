
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Shield, ArrowRight } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { User, ProviderInfos, JobType } from '../types';

interface HomeViewProps {
  onSelectProvider: (provider: User & { info: ProviderInfos }) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectProvider }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobType | 'ALL'>('ALL');
  const [providers, setProviders] = useState<(User & { info: ProviderInfos })[]>([]);

  useEffect(() => {
    const allUsers = mockDb.getUsers();
    const allInfos = mockDb.getProviderInfos();
    
    const combined = allInfos
      .filter(info => info.isActive)
      .map(info => {
        const user = allUsers.find(u => u.id === info.userId);
        return user ? { ...user, info } : null;
      })
      .filter((p): p is User & { info: ProviderInfos } => p !== null);

    setProviders(combined);
  }, []);

  const jobs: JobType[] = ['MÉCANICIEN', 'ÉLECTRICIEN', 'PLOMBIER', 'AGRICULTEUR', 'OUVRIER'];

  const filteredProviders = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.info.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'ALL' || p.info.job === selectedJob;
    return matchesSearch && matchesJob;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Des experts de confiance à votre service.
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Connectez-vous avec les meilleurs prestataires locaux au Sénégal. Rapide, sûr et efficace.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher un service..." 
                className="w-full py-3 pl-10 pr-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-white outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-blue-700 border-none rounded-xl px-6 py-3 text-white focus:ring-2 focus:ring-white outline-none cursor-pointer"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value as any)}
            >
              <option value="ALL">Tous les métiers</option>
              {jobs.map(job => (
                <option key={job} value={job}>{job}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 hidden lg:block">
          <Shield className="w-96 h-96 -mr-16 -mb-16" />
        </div>
      </section>

      {/* Providers Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {selectedJob === 'ALL' ? 'Prestataires populaires' : `Prestataires en ${selectedJob}`}
          </h3>
          <span className="text-sm text-gray-500">{filteredProviders.length} trouvé(s)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map(p => (
              <div 
                key={p.id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => onSelectProvider(p)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {p.info.businessName.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-medium">
                    <Star className="w-4 h-4 fill-yellow-400 border-none" /> {p.info.rating.toFixed(1)}
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {p.info.businessName}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase font-bold text-gray-600">{p.info.job}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.address}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {p.info.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                    {p.info.isVerified ? '✓ Vérifié' : 'En attente'}
                  </span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    Voir Profil <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 italic">Aucun prestataire ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
