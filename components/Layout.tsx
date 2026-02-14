
import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, User as UserIcon, Bell, Home, Search, Settings, ShieldCheck, ClipboardList } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  navigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, navigate }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for desktop, Bottom Nav for Mobile */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-700 text-white p-6 shadow-xl">
        <div className="mb-8 cursor-pointer" onClick={() => navigate('home')}>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-8 h-8" />
            ConciergePro
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => navigate('home')} className="w-full text-left p-3 hover:bg-blue-600 rounded-lg flex items-center gap-3 transition-colors">
            <Home className="w-5 h-5" /> Accueil
          </button>

          {user?.role === UserRole.CLIENT && (
            <button onClick={() => navigate('client-dashboard')} className="w-full text-left p-3 hover:bg-blue-600 rounded-lg flex items-center gap-3 transition-colors">
              <ClipboardList className="w-5 h-5" /> Mes Demandes
            </button>
          )}

          {user?.role === UserRole.PRESTATAIRE && (
            <button onClick={() => navigate('provider-dashboard')} className="w-full text-left p-3 hover:bg-blue-600 rounded-lg flex items-center gap-3 transition-colors">
              <ClipboardList className="w-5 h-5" /> Tableau de bord
            </button>
          )}

          {user?.role === UserRole.ADMIN && (
            <button onClick={() => navigate('admin-dashboard')} className="w-full text-left p-3 hover:bg-blue-600 rounded-lg flex items-center gap-3 transition-colors">
              <Settings className="w-5 h-5" /> Administration
            </button>
          )}
        </nav>

        <div className="border-t border-blue-600 pt-6 mt-6">
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[120px]">{user.name}</p>
                  <p className="text-xs text-blue-200 uppercase">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('login')}
              className="bg-white text-blue-700 w-full py-2 rounded-lg font-bold hover:bg-blue-50"
            >
              Connexion
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50">
        <button onClick={() => navigate('home')} className="flex flex-col items-center gap-1 text-gray-600">
          <Home className="w-6 h-6" /> <span className="text-[10px]">Accueil</span>
        </button>
        {user?.role === UserRole.CLIENT && (
          <button onClick={() => navigate('client-dashboard')} className="flex flex-col items-center gap-1 text-gray-600">
            <ClipboardList className="w-6 h-6" /> <span className="text-[10px]">Demandes</span>
          </button>
        )}
        {user?.role === UserRole.PRESTATAIRE && (
          <button onClick={() => navigate('provider-dashboard')} className="flex flex-col items-center gap-1 text-gray-600">
            <ClipboardList className="w-6 h-6" /> <span className="text-[10px]">Tableau</span>
          </button>
        )}
        <button onClick={() => navigate('login')} className="flex flex-col items-center gap-1 text-gray-600">
          <UserIcon className="w-6 h-6" /> <span className="text-[10px]">{user ? 'Moi' : 'Login'}</span>
        </button>
      </nav>

      <main className="flex-1 bg-gray-50 pb-20 md:pb-0 overflow-y-auto max-h-screen">
        <header className="md:hidden flex items-center justify-between p-4 bg-blue-700 text-white shadow-md">
          <h1 className="font-bold">ConciergePro</h1>
          <Bell className="w-6 h-6" />
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
