
import React, { useState, useRef } from 'react';
import { PILAR_COLORS } from '../constants';
import { LifePilar, TimeBlock } from '../types';
import { Plus, ChevronLeft, ChevronRight, Zap, RefreshCw, AlertTriangle, Info, Loader2, ArrowLeft, Mic, X, Save } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const Planner: React.FC = () => {
  const { activities, addActivity, isSynced, toggleSync, navigateTo } = useLife();
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // New Block State
  const [newBlock, setNewBlock] = useState({
    title: '',
    pilar: LifePilar.PROFISSIONAL,
    day: 1,
    hour: 10,
    duration: 1,
    impact: 'medium' as const
  });

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setSyncing(false);
  };

  const openQuickAdd = (day: number, hour: number) => {
    setNewBlock(prev => ({ ...prev, day, hour }));
    setIsModalOpen(true);
  };

  const saveTask = async () => {
    if (!newBlock.title) return;
    const task: TimeBlock = {
      id: Math.random().toString(),
      title: newBlock.title,
      pilar: newBlock.pilar,
      startTime: new Date().toISOString(),
      duration: newBlock.duration * 60,
      impact: newBlock.impact,
      day: newBlock.day,
      hour: newBlock.hour
    };
    await addActivity(task);
    setIsModalOpen(false);
    setNewBlock({ title: '', pilar: LifePilar.PROFISSIONAL, day: 1, hour: 10, duration: 1, impact: 'medium' });
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNewBlock(prev => ({ ...prev, title: transcript }));
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert("Acesso ao microfone negado. Por favor, clique no ícone de cadeado na barra de endereços do seu navegador e permita o uso do microfone para o APICE4.");
      } else if (event.error === 'no-speech') {
        // Silêncio apenas fecha o reconhecimento sem alertas chatos
      } else {
        alert("Ocorreu um erro ao tentar usar o microfone: " + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

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
            <p className="text-slate-500 mt-1 text-sm font-medium">Clique em qualquer horário para bloquear sua agenda.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 text-white transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" /> <span>Novo Bloco</span>
          </button>
        </div>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl relative">
        <div className="flex-1 overflow-x-auto overflow-y-auto relative">
          <div className="min-w-[1000px] h-full flex flex-col">
            <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <div className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-400 border-r border-slate-100 font-bold text-center">Horário</div>
              {days.map((day, i) => (
                <div key={day} className={`p-6 text-center border-r border-slate-100 last:border-r-0`}>
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
                  <div key={dIdx} className="relative group divide-y divide-slate-100/50">
                    {hours.map(h => (
                      <div 
                        key={h} 
                        onClick={() => openQuickAdd(dIdx, h)}
                        className="h-24 hover:bg-blue-50/30 transition-colors cursor-crosshair relative group/cell"
                      >
                         <Plus className="w-4 h-4 text-blue-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                      </div>
                    ))}

                    {activities.filter(t => t.day === dIdx).map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="absolute left-1.5 right-1.5 rounded-2xl p-4 text-[10px] font-bold overflow-hidden shadow-md cursor-pointer hover:scale-[1.02] transition-all border group/block z-10"
                        style={{
                          top: `${(task.hour - 6) * 96 + 6}px`,
                          height: `${(task.duration / 60) * 96 - 12}px`,
                          backgroundColor: `${PILAR_COLORS[task.pilar]}08`,
                          borderColor: `${PILAR_COLORS[task.pilar]}40`,
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="uppercase tracking-widest px-2 py-0.5 rounded-md text-white shadow-sm" style={{ backgroundColor: PILAR_COLORS[task.pilar] }}>
                            {task.pilar}
                          </span>
                        </div>
                        <div className="text-slate-800 text-sm font-display truncate mb-1">{task.title}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold font-display text-slate-900">Novo Bloco de Tempo</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">O que será feito?</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
                    placeholder="Ex: Treino Hiit ou Sprint de Codificação"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-12 focus:border-blue-500/50 outline-none transition-all font-medium"
                  />
                  <button 
                    onClick={startVoiceCapture}
                    title="Capturar por voz"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Pilar de Vida</label>
                  <select 
                    value={newBlock.pilar}
                    onChange={(e) => setNewBlock({...newBlock, pilar: e.target.value as LifePilar})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none appearance-none font-bold text-slate-700"
                  >
                    {Object.values(LifePilar).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Duração (Horas)</label>
                  <input 
                    type="number" step="0.5" min="0.5"
                    value={newBlock.duration}
                    onChange={(e) => setNewBlock({...newBlock, duration: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <button 
                onClick={saveTask}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95"
              >
                <Save className="w-5 h-5" /> Salvar Bloco na Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
