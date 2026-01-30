
import React, { useState } from 'react';
import { Plus, Trash2, Zap, Target, Users, Clock, Mic, X } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  quadrant: string;
}

interface QuadrantProps {
  title: string;
  desc: string;
  id: string;
  icon: React.ReactNode;
  color: string;
  tasks: Task[];
  inputValue: string;
  isListening: boolean;
  onInputChange: (id: string, value: string) => void;
  onAddTask: (id: string) => void;
  onRemoveTask: (id: string) => void;
  onStartVoice: (id: string) => void;
}

// Componente Quadrante movido para fora para evitar perda de foco durante re-renders
const Quadrant: React.FC<QuadrantProps> = ({ 
  title, desc, id, icon, color, tasks, inputValue, isListening,
  onInputChange, onAddTask, onRemoveTask, onStartVoice 
}) => (
  <div className={`bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col shadow-sm hover:shadow-md transition-all h-full`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-bold font-display text-slate-900">{title}</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{desc}</p>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
      </div>
    </div>

    <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide min-h-[100px]">
      {tasks.filter(t => t.quadrant === id).map(task => (
        <div key={task.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{task.text}</span>
          <button onClick={() => onRemoveTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all">
             <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      {tasks.filter(t => t.quadrant === id).length === 0 && (
        <div className="h-full flex items-center justify-center py-10 opacity-20">
           <p className="text-xs font-bold uppercase tracking-widest">Vazio</p>
        </div>
      )}
    </div>

    <div className="relative mt-auto">
      <input 
        type="text" 
        value={inputValue}
        onChange={(e) => onInputChange(id, e.target.value)}
        placeholder="Adicionar tarefa..." 
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-4 pr-24 text-sm outline-none focus:border-blue-500/50 transition-all font-medium"
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

const Eisenhower: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Preparar pitch para investidores', quadrant: 'do' },
    { id: '2', text: 'Agendar check-up médico anual', quadrant: 'schedule' },
    { id: '3', text: 'Responder e-mails operacionais', quadrant: 'delegate' },
    { id: '4', text: 'Rolar feed infinito do Instagram', quadrant: 'eliminate' },
  ]);

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

  const addTask = (quadrant: string) => {
    const text = inputs[quadrant].trim();
    if (!text) return;
    
    setTasks(prev => [...prev, { id: Math.random().toString(), text, quadrant }]);
    setInputs(prev => ({ ...prev, [quadrant]: '' }));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
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
      
      if (event.error === 'not-allowed') {
        alert("Acesso ao microfone negado. Clique no ícone de cadeado na barra de endereços para permitir o microfone.");
      }
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-4xl font-bold font-display text-slate-900">Matriz de Eisenhower</h2>
        <p className="text-slate-500 mt-1">Classifique suas demandas para uma gestão cirúrgica do tempo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[700px]">
        <Quadrant 
          id="do" 
          title="Faça Agora" 
          desc="Urgente & Importante" 
          color="bg-emerald-500 text-emerald-600"
          icon={<Zap className="w-5 h-5" />}
          tasks={tasks}
          inputValue={inputs.do}
          isListening={activeVoice === 'do'}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="schedule" 
          title="Agende" 
          desc="Não Urgente & Importante" 
          color="bg-blue-500 text-blue-600"
          icon={<Clock className="w-5 h-5" />}
          tasks={tasks}
          inputValue={inputs.schedule}
          isListening={activeVoice === 'schedule'}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="delegate" 
          title="Delegue" 
          desc="Urgente & Não Importante" 
          color="bg-amber-500 text-amber-600"
          icon={<Users className="w-5 h-5" />}
          tasks={tasks}
          inputValue={inputs.delegate}
          isListening={activeVoice === 'delegate'}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onStartVoice={startVoiceCapture}
        />
        <Quadrant 
          id="eliminate" 
          title="Elimine" 
          desc="Não Urgente & Não Importante" 
          color="bg-rose-500 text-rose-600"
          icon={<Target className="w-5 h-5" />}
          tasks={tasks}
          inputValue={inputs.eliminate}
          isListening={activeVoice === 'eliminate'}
          onInputChange={handleInputChange}
          onAddTask={addTask}
          onRemoveTask={removeTask}
          onStartVoice={startVoiceCapture}
        />
      </div>
    </div>
  );
};

export default Eisenhower;
