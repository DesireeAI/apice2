
import React, { useState } from 'react';
import { LifePilar } from '../types';
import { PILAR_COLORS } from '../constants';
import { Users, Calendar, ArrowRight, Star, Filter, MessageCircle, FileText, Video } from 'lucide-react';

const Masterminds: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grupos');
  const [filter, setFilter] = useState<LifePilar | 'Todos'>('Todos');

  const groups = [
    {
      title: 'Estrategistas Digitais 2025',
      facilitator: 'Victor Camargo',
      pilar: LifePilar.PROFISSIONAL,
      nextSession: 'Quinta-feira, 19:00',
      spots: 3,
      description: 'Grupo focado em escalar negócios de serviços high-ticket usando automação IA.'
    },
    {
      title: 'Saúde & Biohacking VIP',
      facilitator: 'Dra. Luiza Mendes',
      pilar: LifePilar.SAUDE,
      nextSession: 'Segunda-feira, 08:00',
      spots: 1,
      description: 'Protocolos avançados de longevidade e performance cognitiva para executivos.'
    },
    {
      title: 'Financial Freedom Flow',
      facilitator: 'Marcos Stein',
      pilar: LifePilar.FINANCEIRO,
      nextSession: 'Sexta-feira, 17:00',
      spots: 5,
      description: 'Estruturação de portfólio internacional e blindagem patrimonial.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold font-display tracking-tight">Masterminds & Grupos</h2>
          <p className="text-slate-500 mt-1">Inteligência coletiva para acelerar sua evolução holística.</p>
        </div>
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button onClick={() => setActiveTab('grupos')} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'grupos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Descobrir</button>
          <button onClick={() => setActiveTab('minhas')} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'minhas' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Meus Grupos</button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 pb-2 border-b border-slate-800/50">
        <button onClick={() => setFilter('Todos')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === 'Todos' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'}`}>
          <Filter className="w-3.5 h-3.5" /> Todos
        </button>
        {Object.values(LifePilar).map(p => (
          <button 
            key={p} 
            onClick={() => setFilter(p)} 
            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${filter === p ? 'bg-slate-700 text-white border-blue-500' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'}`}
            style={{ borderBottom: filter === p ? `2px solid ${PILAR_COLORS[p]}` : 'none' }}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.filter(g => filter === 'Todos' || g.pilar === filter).map((group, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col hover:border-blue-500/40 transition-all group backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <span 
                className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ backgroundColor: `${PILAR_COLORS[group.pilar]}20`, color: PILAR_COLORS[group.pilar] }}
              >
                {group.pilar}
              </span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
              </div>
            </div>

            <h3 className="text-2xl font-bold font-display leading-tight mb-3 group-hover:text-blue-400 transition-colors">{group.title}</h3>
            <p className="text-slate-400 text-sm mb-8 flex-1 leading-relaxed line-clamp-3 italic">"{group.description}"</p>

            <div className="space-y-4 mb-8 pt-6 border-t border-slate-800/50">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
                <span>Facilitador: <span className="font-bold text-slate-100">{group.facilitator}</span></span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>
                <span>Próxima: <span className="font-bold text-slate-100">{group.nextSession}</span></span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                {group.spots} vagas abertas
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
                Inscrever-se
              </button>
              <button className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all">
                <Video className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-10 mt-12 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold font-display">Hub de Participação</h3>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-500 hover:underline">
               <MessageCircle className="w-4 h-4" /> Discussões
             </button>
             <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
               <FileText className="w-4 h-4" /> Materiais
             </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold font-display text-lg">Sessão: Biohacking Avançado</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Historico • Ontem às 18:00</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              Ver Gravação
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Masterminds;
