
import React, { useState } from 'react';
import { LifePilar } from '../types';
import { PILAR_COLORS } from '../constants';
import { Star, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const IndividualConsultancy: React.FC = () => {
  const { scheduleSession, scheduledSessions } = useLife();
  const [scheduledId, setScheduledId] = useState<string | null>(null);

  const mentors = [
    {
      id: 'm1',
      name: 'Dr. André Fonseca',
      role: 'Estrategista de Biohacking',
      pilars: [LifePilar.SAUDE],
      rating: 4.9,
      reviews: 124,
      availability: 'Amanhã, 09:00',
      avatar: 'https://picsum.photos/seed/doctor/200',
      bio: 'Especialista em medicina da longevidade e otimização de performance metabólica para CEOs.'
    },
    {
      id: 'm2',
      name: 'Sofia Alencar',
      role: 'CFO as a Service & Wealth',
      pilars: [LifePilar.FINANCEIRO, LifePilar.PROFISSIONAL],
      rating: 5.0,
      reviews: 89,
      availability: 'Quarta, 14:00',
      avatar: 'https://picsum.photos/seed/finance/200',
      bio: 'Ex-diretora de investimentos focada em estruturação de wealth e eficiência tributária pessoal.'
    },
    {
      id: 'm3',
      name: 'Gustavo Martins',
      role: 'Mentor de High Performance',
      pilars: [LifePilar.PROFISSIONAL, LifePilar.ESPIRITUAL],
      rating: 4.8,
      reviews: 210,
      availability: 'Disponível hoje',
      avatar: 'https://picsum.photos/seed/mentor/200',
      bio: 'Apoio executivos em transição de carreira e busca por propósito alinhado ao lucro.'
    }
  ];

  const handleSchedule = (mentor: any) => {
    scheduleSession({ mentorId: mentor.id, mentorName: mentor.name, date: new Date().toISOString() });
    setScheduledId(mentor.id);
    setTimeout(() => setScheduledId(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900">Consultoria VIP 1:1</h2>
          <p className="text-slate-500 mt-1">Mentorias personalizadas para acelerar resultados nos 5 pilares.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm">
           {scheduledSessions.length} sessões agendadas
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/40 transition-all flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
            <div className="relative h-56 overflow-hidden">
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">{mentor.name}</h3>
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mt-1">{mentor.role}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-white">{mentor.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.pilars.map(p => (
                  <span key={p} className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border border-slate-100" style={{ backgroundColor: `${PILAR_COLORS[p]}10`, color: PILAR_COLORS[p] }}>
                    {p}
                  </span>
                ))}
              </div>

              <p className="text-sm text-slate-600 mb-8 line-clamp-3 leading-relaxed italic">
                "{mentor.bio}"
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500/60" />
                    <span>Disponibilidade: <span className="text-slate-700">{mentor.availability}</span></span>
                  </div>
                  <span className="font-medium text-slate-400">{mentor.reviews} avaliações</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleSchedule(mentor)}
                    disabled={scheduledId === mentor.id}
                    className={`flex-1 py-4 ${scheduledId === mentor.id ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-[1.5rem] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-90`}
                  >
                    {scheduledId === mentor.id ? <CheckCircle2 className="w-4 h-4 animate-in zoom-in" /> : null}
                    {scheduledId === mentor.id ? 'Sessão Agendada' : 'Agendar VIP 1:1'}
                  </button>
                  <button 
                    aria-label="Enviar Mensagem"
                    className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-[1.5rem] transition-all border border-slate-200 shadow-sm active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-12 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900">Inteligência de Progresso</h3>
            <p className="text-sm text-slate-500 mt-1">Análise integrada das suas consultorias VIP.</p>
          </div>
          <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">
            Ver Notas Completas de Mentorias
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Sessões Acumuladas', value: scheduledSessions.length + 12, sub: '+2 este mês', color: 'blue' },
            { label: 'Platôs Superados', value: '04', sub: 'Último: Finanças', color: 'green' },
            { label: 'Eficiência de Mentor', value: '85%', sub: 'Score de evolução', color: 'purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner group hover:border-blue-500/20 transition-all">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-2 group-hover:text-blue-600 transition-colors">{stat.label}</p>
              <p className="text-4xl font-bold font-display text-slate-800">{stat.value}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IndividualConsultancy;
