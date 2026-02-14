
import React, { useState, useEffect } from 'react';
import { User, UserRole, ProviderInfos } from './types';
import { mockDb } from './services/mockDb';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import AdminDashboard from './views/AdminDashboard';
import ProviderDashboard from './views/ProviderDashboard';
import ClientDashboard from './views/ClientDashboard';
import ProviderDetailView from './views/ProviderDetailView';

type View = 'home' | 'login' | 'admin-dashboard' | 'provider-dashboard' | 'client-dashboard' | 'provider-detail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProvider, setSelectedProvider] = useState<(User & { info: ProviderInfos }) | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    mockDb.initialize();
    const user = mockDb.getCurrentUser();
    if (user) setCurrentUser(user);
    setIsInitialized(true);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.ADMIN) setCurrentView('admin-dashboard');
    else if (user.role === UserRole.PRESTATAIRE) setCurrentView('provider-dashboard');
    else setCurrentView('home');
  };

  const handleLogout = () => {
    mockDb.logout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const navigateToProvider = (p: User & { info: ProviderInfos }) => {
    setSelectedProvider(p);
    setCurrentView('provider-detail');
  };

  if (!isInitialized) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-blue-600">Chargement ConciergePro...</div>;

  const renderView = () => {
    switch (currentView) {
      case 'home': 
        return <HomeView onSelectProvider={navigateToProvider} />;
      case 'login': 
        return <LoginView onLoginSuccess={handleLoginSuccess} navigate={setCurrentView} />;
      case 'admin-dashboard': 
        return <AdminDashboard />;
      case 'provider-dashboard': 
        return currentUser ? <ProviderDashboard user={currentUser} /> : <HomeView onSelectProvider={navigateToProvider} />;
      case 'client-dashboard': 
        return currentUser ? <ClientDashboard user={currentUser} /> : <HomeView onSelectProvider={navigateToProvider} />;
      case 'provider-detail':
        return selectedProvider ? (
          <ProviderDetailView 
            provider={selectedProvider} 
            currentUser={currentUser}
            onBack={() => setCurrentView('home')}
            onRequestSuccess={() => setCurrentView('client-dashboard')}
          />
        ) : <HomeView onSelectProvider={navigateToProvider} />;
      default: 
        return <HomeView onSelectProvider={navigateToProvider} />;
    }
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      navigate={setCurrentView}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
