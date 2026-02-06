
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
import { Search, Bell, LogOut, Loader2 } from 'lucide-react';
import { LifeProvider, useLife } from './context/LifeContext';

const AppContent: React.FC = () => {
  const { activeTab, navigateTo, user, logout, loading, isRecovering } = useLife();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 1. PRIORIDADE MÁXIMA: Se estiver em fluxo de recuperação, trava nesta tela
  // Não importa se o 'user' existe ou qual o 'activeTab', isRecovering manda.
  if (isRecovering || activeTab === 'update-password') {
    return <UpdatePassword />;
  }

  // 2. Auth para usuários não logados
  if (!user) {
    if (activeTab === 'signup') return <SignUp />;
    if (activeTab === 'forgot-password') return <ForgotPassword />;
    return <Login />;
  }

  // 3. Roteamento do Dashboard logado
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

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LifeProvider>
      <AppContent />
    </LifeProvider>
  );
};

export default App;
