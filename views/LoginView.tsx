
import React, { useState } from 'react';
import { UserRole, User, ProviderInfos, JobType } from '../types';
import { mockDb } from '../services/mockDb';
// Fix: Added User as UserIcon to the imports from lucide-react
import { ShieldCheck, Mail, Lock, Phone, MapPin, Briefcase, User as UserIcon } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  navigate: (view: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, navigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    businessName: '',
    job: 'OUVRIER' as JobType,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Simulate login
      const users = mockDb.getUsers();
      const found = users.find(u => u.email === formData.email);
      if (found) {
        mockDb.login(found);
        onLoginSuccess(found);
      } else {
        alert("Utilisateur non trouvé ou identifiants incorrects.");
      }
    } else {
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.name,
        role: role,
        phone: formData.phone,
        address: formData.address
      };

      mockDb.saveUser(newUser);

      if (role === UserRole.PRESTATAIRE) {
        const pInfo: ProviderInfos = {
          userId: newUser.id,
          businessName: formData.businessName,
          job: formData.job,
          description: formData.description,
          interventionRadius: 30,
          isActive: true,
          isVerified: false,
          rating: 4.5
        };
        mockDb.saveProviderInfos(pInfo);
      }

      mockDb.login(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
        {/* Left Side Decor */}
        <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('home')}>
              <ShieldCheck className="w-10 h-10" />
              <h1 className="text-3xl font-bold">ConciergePro</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6">Connectez les talents aux besoins.</h2>
            <p className="text-blue-100 text-lg">Rejoignez la plus grande communauté de services au Sénégal.</p>
          </div>
          <div className="mt-12">
            <p className="text-sm text-blue-200">© 2024 ConciergePro - Tous droits réservés</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">{isLogin ? 'Connexion' : 'Créer un compte'}</h3>
            <p className="text-gray-500">{isLogin ? 'Heureux de vous revoir !' : 'Commencez dès aujourd\'hui.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                {[UserRole.CLIENT, UserRole.PRESTATAIRE].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`col-span-1.5 py-2 text-sm font-bold rounded-lg transition-all ${role === r ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                  >
                    {r === UserRole.CLIENT ? 'Client' : 'Prestataire'}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom complet"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {!isLogin && role === UserRole.PRESTATAIRE && (
                <>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom de l'entreprise"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                    value={formData.job}
                    onChange={(e) => setFormData({ ...formData, job: e.target.value as any })}
                  >
                    <option value="MÉCANICIEN">Mécanicien</option>
                    <option value="ÉLECTRICIEN">Électricien</option>
                    <option value="PLOMBIER">Plombier</option>
                    <option value="AGRICULTEUR">Agriculteur</option>
                    <option value="OUVRIER">Ouvrier</option>
                  </select>
                </>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Adresse"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              {isLogin ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
