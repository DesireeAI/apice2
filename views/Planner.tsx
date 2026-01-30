
import React, { useState } from 'react';
import { PILAR_COLORS } from '../constants';
import { LifePilar, TimeBlock } from '../types';
import { Plus, ChevronLeft, ChevronRight, Zap, RefreshCw, AlertTriangle, Info, Loader2, ArrowLeft } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const Planner: React.FC = () => {
  const { activities, addActivity, isSynced, toggleSync, navigateTo } = useLife();
  const [syncing, setSyncing] = useState(false);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setSyncing(false);
  };

  const handleCreateBlock = () => {
    const newBlock: TimeBlock = {
      id: Math.random().toString(),
      title: 'Sessão Deep Work',
      pilar: LifePilar.PROFISSIONAL,
      startTime: '2024-03-25T10:00:00',
      duration: 120,
      impact: 'high'
    };
    addActivity(newBlock);
  };

  const initialTasks = [
    { day: 1, hour: 8, duration: 1.5, title: 'Treino Hiit', pilar: LifePilar.SAUDE, impact: 'high', med: true },
    { day: 1, hour: 10, duration: 2, title: 'Sprint Criativo', pilar: LifePilar.PROFISSIONAL, impact: 'medium', med: false },
    { day: 2, hour: 9, duration: 3, title: 'Deep Work: Estratégia', pilar: LifePilar.PROFISSIONAL, impact: 'high', med: false },
    { day: 3, hour: 18, duration: 1, title: 'Meditação Guiada', pilar: LifePilar.ESPIRITUAL, impact: 'medium', med: true },
    { day: 4, hour: 12, duration: 1, title: 'Gestão de Patrimônio', pilar: LifePilar.FINANCEIRO, impact: 'medium', med: false },
    { day: 5, hour: 19, duration: 2, title: 'Jantar Networking', pilar: LifePilar.PESSOAL, impact: 'low', med: false },
  ];

  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigateTo('dashboard')}
             className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display tracking-tight text-slate-900">Planner Inteligente</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Bloqueio de tempo otimizado para Março 2024.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-4 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isSynced.google ? 'bg-green-500' : 'bg-slate-200'}`} />
               <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Google</span>
             </div>
             <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isSynced.outlook ? 'bg-green-500' : 'bg-slate-200'}`} />
               <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Outlook</span>
             </div>
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-600 transition-all border border-slate-200 shadow-sm disabled:opacity-50"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <RefreshCw className="w-4 h-4" />} 
            <span>Sincronizar</span>
          </button>
          <button 
            onClick={handleCreateBlock}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 text-white transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> <span>Novo Bloco</span>
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl relative">
        <div className="bg-amber-50 px-8 py-3 border-b border-amber-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" /> Alerta de Trade-off: Sobrecarga na Quinta
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:underline">
            <Info className="w-4 h-4" /> Sugestões MED Disponíveis
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto relative">
          <div className="min-w-[1000px] h-full flex flex-col">
            <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <div className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-400 border-r border-slate-100 font-bold text-center">Horário</div>
              {days.map((day, i) => (
                <div key={day} className={`p-6 text-center border-r border-slate-100 last:border-r-0 ${i === 2 ? 'bg-blue-50/50' : ''}`}>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] block text-slate-400 mb-1">{day}</span>
                  <span className="text-2xl font-display font-bold text-slate-800">{24 + i}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 relative">
              <div className="grid grid-cols-8 min-h-full divide-x divide-slate-100">
                <div className="bg-slate-50/30 sticky left-0 z-10 border-r border-slate-100">
                  {hours.map(h => (
                    <div key={h} className="h-24 p-4 text-right border-b border-slate-100 text-[10px] text-slate-400 font-mono font-bold">
                      {h}:00
                    </div>
                  ))}
                </div>

                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="relative group hover:bg-slate-50 transition-colors">
                    {hours.map(h => (
                      <div key={h} className="h-24 border-b border-slate-100/50" />
                    ))}

                    {initialTasks.filter(t => t.day === dIdx).map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="absolute left-1.5 right-1.5 rounded-2xl p-4 text-[10px] font-bold overflow-hidden shadow-md cursor-pointer hover:scale-[1.02] transition-all border group/block z-10"
                        style={{
                          top: `${(task.hour - 6) * 96 + 6}px`,
                          height: `${task.duration * 96 - 12}px`,
                          backgroundColor: `${PILAR_COLORS[task.pilar]}08`,
                          borderColor: `${PILAR_COLORS[task.pilar]}40`,
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="uppercase tracking-widest px-2 py-0.5 rounded-md text-white shadow-sm" style={{ backgroundColor: PILAR_COLORS[task.pilar] }}>
                            {task.pilar}
                          </span>
                          {task.med && (
                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="text-slate-800 text-sm font-display truncate mb-1">{task.title}</div>
                        <div className="flex items-center gap-2 text-slate-400 group-hover/block:text-slate-600 transition-colors">
                          <span className="text-[9px] uppercase tracking-tighter">Impacto: {task.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
