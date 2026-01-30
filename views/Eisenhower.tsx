
import React, { useState } from 'react';
import { Plus, Trash2, Zap, Target, Users, Clock, Mic, Loader2, AlertCircle, Check } from 'lucide-react';
import { useLife } from '../context/LifeContext';
import { LifePilar, TimeBlock } from '../types';

interface QuadrantProps {
  title: string;
  desc: string;
  id: 'do' | 'schedule' | 'delegate' | 'eliminate';
  icon: React.ReactNode;
  color: string;
  tasks: TimeBlock[];
  inputValue: string;
  isListening: boolean;
  confirmDeleteId: string | null;
  onInputChange: (id: string, value: string) => void;
  onAddTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onStartVoice: (id: string) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ 
  title, desc, id, icon, color, tasks, inputValue, isListening, confirmDeleteId,
  onInputChange, onAddTask, onRemoveTask, onStartVoice 
}) => {
  const quadrantTasks = tasks.filter(t => t.quadrant === id);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col shadow-sm hover:shadow-md transition-all h-full min-h-[400px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900">{title}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{desc}</p>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[350px] pr-2 scrollbar-hide">
        {quadrantTasks.length > 0 ? (
          quadrantTasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                confirmDeleteId === task.id 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-slate-50 border-slate-100 hover:border-blue-200'
              }`}
            >
              <div className="flex flex-col flex-1 min-w-0 pr-4">
                <span className={`text-sm font-medium transition-colors truncate ${
                  confirmDeleteId === task.id ? 'text-red-700' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {task.title}
                </span>
                {task.day !== null && task.hour !== null && (
                  <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${
                    confirmDeleteId === task.id ? 'text-red-400' : 'text-blue-500'
                  }`}>
                    Agendado no Planner
                  </span>
                )}
              </div>
              <button 
                onClick={() => onRemoveTask(task.id)} 
                className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  confirmDeleteId === task.id 
                    ? 'bg-red-600 text-white scale-105 shadow-lg px-3' 
                    : 'opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-300 hover:text-red-500'
                }`}
                title={confirmDeleteId === task.id ? "Clique novamente para excluir" : "Excluir"}
              >
                {confirmDeleteId === task.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Excluir</span>
                  </>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-3xl opacity-30">
             <Clock className="w-8 h-8 mb-2" />
             <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Sem Tarefas</p>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => onInputChange(id, e.target.value)}
          placeholder="O que precisa ser feito?" 
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-24 text-sm outline-none focus:border-blue-500/50 transition-all font-medium"
          onKeyDown={(e) => e.key === 'Enter' && onAddTask(id)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button 
            onClick={() => onStartVoice(id)}
            title="Falar tarefa"
            className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-50' : 'bg-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onAddTask(id)} 
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Eisenhower: React.FC = () => {
  const { activities, addActivity, removeActivity } = useLife();
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({
    do: '',
    schedule: '',
    delegate: '',
    eliminate: ''
  });

  const [activeVoice, setActiveVoice] = useState<string | null>(null);

  const handleInputChange = (quadrant: string, value: string) => {
    setInputs(prev => ({ ...prev, [quadrant]: value }));
  };

  const addTask = async (quadrant: string) => {
    const text = inputs[quadrant].trim();
    if (!text || isSaving) return;
    
    setIsSaving(true);
    try {
      await addActivity({
        title: text,
        pilar: LifePilar.PROFISSIONAL,
        startTime: new Date().toISOString(),
        duration: 60,
        impact: 'medium',
        day: null,
        hour: null,
        quadrant: quadrant as any
      });
      setInputs(prev => ({ ...prev, [quadrant]: '' }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTask = async (id: string) => {
    if (confirmDeleteId === id) {
      await removeActivity(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const startVoiceCapture = (quadrant: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setActiveVoice(quadrant);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleInputChange(quadrant, transcript);
      setActiveVoice(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setActiveVoice(null);
    };

    recognition.onend = () => {
      setActiveVoice(null);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setActiveVoice(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold font-display text-slate-900">Matriz de Eisenhower</h2>
          <p className="text-slate-500 mt-1">Classifique suas demandas para uma gestão cirúrgica do tempo.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isSaving && (
            <div className="flex items-center gap-2 text-blue-600 animate-pulse text-xs font-bold uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin" /> Sincronizando...
            </div>
          )}
          {confirmDeleteId && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-bounce">
              <AlertCircle className="w-3.5 h-3.5" /> Clique novamente para confirmar exclusão
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Quadrant 
          id="do" 
          title="Faça Agora" 
          desc="Urgente & Importante" 
          color="bg-emerald-500 text-emerald-600"
          icon={<Zap className="w-5 h-5" />}
          tasks={activities}
          inputValue={inputs.do}
          isListening={activeVoice === 'do'}
          confirmDeleteId={confirmDeleteId}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={handleRemoveTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="schedule" 
          title="Agende" 
          desc="Não Urgente & Importante" 
          color="bg-blue-50 text-blue-600"
          icon={<Clock className="w-5 h-5" />}
          tasks={activities}
          inputValue={inputs.schedule}
          isListening={activeVoice === 'schedule'}
          confirmDeleteId={confirmDeleteId}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={handleRemoveTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="delegate" 
          title="Delegue" 
          desc="Urgente & Não Importante" 
          color="bg-amber-500 text-amber-600"
          icon={<Users className="w-5 h-5" />}
          tasks={activities}
          inputValue={inputs.delegate}
          isListening={activeVoice === 'delegate'}
          confirmDeleteId={confirmDeleteId}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={handleRemoveTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="eliminate" 
          title="Elimine" 
          desc="Não Urgente & Não Importante" 
          color="bg-rose-500 text-rose-600"
          icon={<Target className="w-5 h-5" />}
          tasks={activities}
          inputValue={inputs.eliminate}
          isListening={activeVoice === 'eliminate'}
          confirmDeleteId={confirmDeleteId}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={handleRemoveTask}
          onStartVoice={startVoiceCapture}
        />
      </div>
    </div>
  );
};

export default Eisenhower;
