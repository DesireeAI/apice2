
import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { PILAR_COLORS, PILAR_ICONS } from '../constants';
import { LifePilar } from '../types';
import { CheckCircle2, ChevronRight, Zap, Target, TrendingUp, Sparkles, ArrowRight, X, FileEdit, Save, Loader2 } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const Dashboard: React.FC = () => {
  const { scores, pilarNotes, updatePilarNote, impactAnalysis, medActions, scheduledSessions, isFirstTime, navigateTo } = useLife();
  const [mounted, setMounted] = useState(false);
  const [selectedPilar, setSelectedPilar] = useState<LifePilar | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openPilarDetail = (pilar: LifePilar) => {
    setSelectedPilar(pilar);
    setTempNote(pilarNotes[pilar] || "");
  };

  const closePilarDetail = () => {
    setSelectedPilar(null);
    setIsSaving(false);
  };

  const savePilarDetail = async () => {
    if (selectedPilar) {
      setIsSaving(true);
      try {
        await updatePilarNote(selectedPilar, tempNote);
        closePilarDetail();
      } catch (error) {
        console.error("Erro ao salvar nota:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const radarData = Object.entries(scores).map(([pilar, score]) => ({
    subject: pilar,
    A: score === 0 ? 15 : score,
    fullMark: 100,
  }));

  const pilaresData = [
    { name: LifePilar.SAUDE, metric: 'Vitalidade Física', detail: 'Aguardando diagnóstico', score: scores[LifePilar.SAUDE], color: PILAR_COLORS[LifePilar.SAUDE] },
    { name: LifePilar.PROFISSIONAL, metric: 'Produtividade deep', detail: 'Defina seu foco profissional', score: scores[LifePilar.PROFISSIONAL], color: PILAR_COLORS[LifePilar.PROFISSIONAL] },
    { name: LifePilar.FINANCEIRO, metric: 'Liberdade Financeira', detail: 'Monitore seus fluxos', score: scores[LifePilar.FINANCEIRO], color: PILAR_COLORS[LifePilar.FINANCEIRO] },
    { name: LifePilar.ESPIRITUAL, metric: 'Propósito & Paz', detail: 'Alinhe sua rotina', score: scores[LifePilar.ESPIRITUAL], color: PILAR_COLORS[LifePilar.ESPIRITUAL] },
    { name: LifePilar.PESSOAL, metric: 'Relacionamentos', detail: 'Tempo de qualidade', score: scores[LifePilar.PESSOAL], color: PILAR_COLORS[LifePilar.PESSOAL] },
  ];

  if (isFirstTime) {
    return (
      <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 max-w-5xl mx-auto text-center py-10">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-100 shadow-sm">
            <Sparkles className="w-3 h-3" /> Bem-vindo à sua nova fase
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight text-slate-900">
            Sua vida integrada em <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">um só comando.</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Elimine a fadiga de decisão. Gere sua primeira semana otimizada através do nosso motor de IA.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button 
              onClick={() => navigateTo('diagnosis')}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              Iniciar Diagnóstico <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigateTo('settings')}
              className="px-8 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Configurar Sistema
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
          {pilaresData.slice(0, 3).map((p) => (
            <div key={p.name} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <div className="p-3 rounded-xl bg-slate-50 w-fit mb-4 text-slate-400">{PILAR_ICONS[p.name]}</div>
              <h3 className="text-lg font-bold font-display text-slate-800">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold font-display tracking-tight text-slate-900">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Status atualizado dos seus pilares de vida.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigateTo('diagnosis')}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm"
          >
            <Target className="w-4 h-4 text-blue-600" /> Diagnóstico
          </button>
          <button 
            onClick={() => navigateTo('planner')}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <TrendingUp className="w-4 h-4" /> Planejar
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pilaresData.map((p) => (
            <div 
              key={p.name} 
              onClick={() => openPilarDetail(p.name)}
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-300 transition-all group cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <FileEdit className="w-4 h-4 text-slate-300" />
              </div>
              <div className="flex justify-between items-start mb-6">
                <div 
                  className="p-3.5 rounded-2xl transition-all duration-300 shadow-sm border border-slate-100 group-hover:scale-110"
                  style={{ color: p.color, backgroundColor: `${p.color}10` }}
                >
                  {PILAR_ICONS[p.name]}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold font-display text-slate-900">{p.score}%</span>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Progresso</div>
                </div>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800">{p.name}</h3>
              <div className="mt-1">
                <p className="text-sm font-medium text-slate-500">{p.metric}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                  {pilarNotes[p.name] || p.detail}
                </p>
              </div>
              <div className="mt-6 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000 ease-out shadow-sm" 
                  style={{ width: `${p.score}%`, backgroundColor: p.color }}
                />
              </div>
            </div>
          ))}

          <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-100 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4">
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
              </div>
              <h3 className="text-2xl font-bold font-display leading-tight">Insight</h3>
              <p className="text-sm text-blue-50 mt-2 font-medium leading-relaxed opacity-90">
                "{impactAnalysis}"
              </p>
            </div>
            <button 
              onClick={() => navigateTo('planner')}
              className="mt-8 flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all group border border-white/10"
            >
              <span className="text-sm font-bold uppercase tracking-wider">Ver Impacto</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold font-display mb-6 text-slate-900">Harmonia Geral</h3>
            <div className="h-[240px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Radar name="Vida" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold font-display mb-6 text-slate-900">Sessões VIP</h3>
            <div className="space-y-4">
              {scheduledSessions.length > 0 ? (
                scheduledSessions.map((session, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{session.mentorName}</p>
                      <p className="text-[10px] uppercase text-blue-600 font-bold mt-0.5">Sessão Agendada</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-xs text-slate-400 font-medium">Nenhum mentor VIP ativo.</p>
                  <button onClick={() => navigateTo('individual')} className="text-xs text-blue-600 font-bold mt-2 hover:underline">Ver Mentores</button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold font-display mb-6 text-slate-900">Checklist MED</h3>
            <div className="space-y-4">
              {medActions.length > 0 ? medActions.slice(0, 3).map((action, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-pointer">
                  <div className="flex-shrink-0 w-5 h-5 rounded-lg border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-snug">{action}</p>
                </div>
              )) : (
                <p className="text-xs text-slate-400 italic">Complete o diagnóstico inicial.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Pilar */}
      {selectedPilar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-2xl shadow-sm border"
                  style={{ 
                    color: PILAR_COLORS[selectedPilar], 
                    backgroundColor: `${PILAR_COLORS[selectedPilar]}10`,
                    borderColor: `${PILAR_COLORS[selectedPilar]}20`
                  }}
                >
                  {PILAR_ICONS[selectedPilar]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">{selectedPilar}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Informações & Planejamento</p>
                </div>
              </div>
              <button onClick={closePilarDetail} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Notas e Metas Específicas</label>
                <textarea 
                  rows={6}
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder={`Descreva suas metas para ${selectedPilar}, hábitos que deseja implementar ou observações importantes sobre seu estado atual...`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                 <div className="flex items-center gap-3 text-xs text-slate-500">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Estas informações ajudam a refinar seu próximo diagnóstico.</span>
                 </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={closePilarDetail}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={savePilarDetail}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Salvando...' : 'Salvar Notas'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
