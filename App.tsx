
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Diagnosis from './views/Diagnosis';
import DiagnosisResult from './views/DiagnosisResult';
import Planner from './views/Planner';
import Masterminds from './views/Masterminds';
import IndividualConsultancy from './views/IndividualConsultancy';
import Settings from './views/Settings';
import Guide from './views/Guide';
import Eisenhower from './views/Eisenhower';
import Login from './views/Login';
import SignUp from './views/SignUp';
import ForgotPassword from './views/ForgotPassword';
import UpdatePassword from './views/UpdatePassword';
import { Search, Bell, User, X, LogOut, Loader2 } from 'lucide-react';
import { LifeProvider, useLife } from './context/LifeContext';

const AppContent: React.FC = () => {
  const { activeTab, navigateTo, user, logout, loading } = useLife();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Se estiver no modo de atualização de senha, mostra a view independente do estado de login
  if (activeTab === 'update-password') {
    return <UpdatePassword />;
  }

  // Controle de Auth
  if (!user) {
    if (activeTab === 'signup') return <SignUp />;
    if (activeTab === 'forgot-password') return <ForgotPassword />;
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'diagnosis': return <Diagnosis />;
      case 'results': return <DiagnosisResult />;
      case 'planner': return <Planner />;
      case 'masterminds': return <Masterminds />;
      case 'individual': return <IndividualConsultancy />;
      case 'guide': return <Guide />;
      case 'eisenhower': return <Eisenhower />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-blue-100">
      <Sidebar activeTab={activeTab} setActiveTab={navigateTo} />
      
      <main className="flex-1 h-screen overflow-y-auto relative flex flex-col pb-20 lg:pb-0 bg-[#F8FAFC]">
        <div className="sticky top-0 z-[40] flex items-center justify-between px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="relative w-full max-w-xs md:max-w-md group hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar meta, pilar ou mentor..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-10 text-sm focus:border-blue-500/30 transition-all outline-none"
            />
          </div>

          <div className="lg:hidden block">
             <h1 className="text-xl font-bold font-display tracking-tight text-slate-800">APICE<span className="text-blue-600">4</span></h1>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">
            <button className="p-2.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-blue-600 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            
            <div className="flex items-center gap-3 pl-2 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">{user.full_name || user.email.split('@')[0]}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Master VIP</p>
              </div>
              <button 
                onClick={logout}
                title="Sair"
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>

        <footer className="py-8 text-center border-t border-slate-100 bg-white/50">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-bold">
            APICE4 • INTEGRAL LIFE SYSTEM • 2024
          </p>
        </footer>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <LifeProvider>
    <AppContent />
  </LifeProvider>
);

export default App;
