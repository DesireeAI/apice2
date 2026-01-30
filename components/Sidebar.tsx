
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { useLife } from '../context/LifeContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useLife();

  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuário';
  };

  const getInitial = () => {
    const name = getDisplayName();
    return (name[0] || '?').toUpperCase();
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen bg-white border-r border-slate-200 flex-col sticky top-0 z-50 shadow-sm">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-blue-600">APICE</span>
            <span className="font-light text-slate-400">4</span>
          </h1>
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Command Center</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto" role="navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
              {getInitial()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate text-slate-800" title={getDisplayName()}>
                {getDisplayName()}
              </span>
              <span className="text-[9px] uppercase font-bold text-blue-600 tracking-wider">Membro VIP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around px-4 z-[60]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2.5 rounded-2xl transition-all ${
              activeTab === item.id ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
