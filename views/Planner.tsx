
import React, { useState, useCallback } from 'react';
import { PILAR_COLORS } from '../constants';
import { LifePilar, TimeBlock } from '../types';
import { Plus, Mic, X, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const Planner: React.FC = () => {
  const { activities, addActivity, navigateTo } = useLife();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const getDayOfMonth = (index: number) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + index);
    return d.getDate();
  };

  const [newBlock, setNewBlock] = useState({
    title: '',
    pilar: LifePilar.PROFISSIONAL,
    day: today.getDay(),
    hour: 10,
    duration: 1,
    impact: 'medium' as const
  });

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);

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
    setNewBlock({ title: '', pilar: LifePilar.PROFISSIONAL, day: today.getDay(), hour: 10, duration: 1, impact: 'medium' });
  };

  const startVoiceCapture = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setNewBlock(prev => ({ ...prev, title: transcript }));
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Erro na captura de voz:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert("Permissão de microfone negada. Por favor, habilite o acesso ao microfone nas configurações do seu navegador.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Falha ao iniciar reconhecimento:", e);
      setIsListening(false);
    }
  }, [isListening]);

  return (
    <div className="h-full flex flex-col space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
           <button onClick={() => navigateTo('dashboard')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all shadow-sm">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display tracking-tight text-slate-900">Planner Inteligente</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">Semana de {startOfWeek.toLocaleDateString('pt-BR')} a {new Date(new Date(startOfWeek).setDate(startOfWeek.getDate() + 6)).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-lg active:scale-95">
          <Plus className="w-4 h-4" /> <span>Novo Bloco</span>
        </button>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl">
        <div className="flex-1 overflow-x-auto overflow-y-auto relative">
          <div className="min-w-[1000px] h-full flex flex-col">
            <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
              <div className="p-6 text-[10px] uppercase tracking-[0.2em] text-slate-400 border-r border-slate-100 font-bold text-center">Horário</div>
              {days.map((day, i) => (
                <div key={day} className="p-6 text-center border-r border-slate-100 last:border-r-0">
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] block text-slate-400 mb-1">{day}</span>
                  <span className="text-2xl font-display font-bold text-slate-800">{getDayOfMonth(i)}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 relative min-h-[1536px]">
              <div className="grid grid-cols-8 h-full divide-x divide-slate-100">
                <div className="bg-slate-50/30 sticky left-0 z-10 border-r border-slate-100">
                  {hours.map(h => (
                    <div key={h} className="h-24 p-4 text-right border-b border-slate-100 text-[10px] text-slate-400 font-mono font-bold">{h}:00</div>
                  ))}
                </div>

                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="relative group divide-y divide-slate-100/50">
                    {hours.map(h => (
                      <div key={h} onClick={() => openQuickAdd(dIdx, h)} className="h-24 hover:bg-blue-50/30 transition-colors cursor-crosshair relative group/cell" />
                    ))}

                    {activities.filter(t => t.day === dIdx).map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="absolute left-1.5 right-1.5 rounded-2xl p-4 text-[10px] font-bold overflow-hidden shadow-md border z-10"
                        style={{
                          top: `${((task.hour || 6) - 6) * 96 + 6}px`,
                          height: `${((task.duration || 60) / 60) * 96 - 12}px`,
                          backgroundColor: `${(PILAR_COLORS as any)[task.pilar] || '#CBD5E1'}15`,
                          borderColor: `${(PILAR_COLORS as any)[task.pilar] || '#CBD5E1'}40`,
                          color: (PILAR_COLORS as any)[task.pilar] || '#475569'
                        }}
                      >
                        <div className="text-slate-800 text-sm font-display truncate">{task.title}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] p-8 md:p-10 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold font-display text-slate-900">Novo Bloco</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">O que será feito?</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newBlock.title} 
                    onChange={(e) => setNewBlock({...newBlock, title: e.target.value})} 
                    placeholder={isListening ? "Ouvindo..." : "Ex: Treino de alta intensidade"}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-12 outline-none font-medium transition-all ${isListening ? 'ring-2 ring-blue-100 border-blue-300' : ''}`} 
                  />
                  <button 
                    onClick={startVoiceCapture} 
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    title="Gravar por voz"
                  >
                    {isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pilar</label>
                  <select value={newBlock.pilar} onChange={(e) => setNewBlock({...newBlock, pilar: e.target.value as LifePilar})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700">
                    {Object.values(LifePilar).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duração (h)</label>
                  <input type="number" step="0.5" value={newBlock.duration} onChange={(e) => setNewBlock({...newBlock, duration: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-700" />
                </div>
              </div>
              <button onClick={saveTask} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3">
                <Save className="w-5 h-5" /> Salvar na Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
