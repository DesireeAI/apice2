
import React, { useEffect, useState } from 'react';
import { useLife } from '../context/LifeContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Brain, Sparkles, CheckCircle2, LayoutDashboard, AlertCircle, Zap } from 'lucide-react';
import { LifePilar } from '../types';

const DiagnosisResult: React.FC = () => {
  const { scores, weeklyFocus, medActions, impactAnalysis, navigateTo } = useLife();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Função para obter o score de forma segura, tratando inconsistências de chaves da IA
  const getSafeScore = (pilar: string): number => {
    if (!scores) return 0;
    const val = (scores as any)[pilar] ?? (scores as any)[pilar.normalize("NFD").replace(/[\u0300-\u036f]/g, "")] ?? 0;
    return Number(val) || 0;
  };

  const hasData = scores && Object.values(scores).some(v => Number(v) > 0);

  if (!hasData) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2 px-6">
          <h2 className="text-2xl font-bold font-display text-slate-900">Diagnóstico Incompleto</h2>
          <p className="text-slate-500 max-w-sm">Ainda não temos dados suficientes para gerar seu Raio-X. Por favor, complete o questionário.</p>
        </div>
        <button 
          onClick={() => navigateTo('diagnosis')}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          Iniciar Questionário
        </button>
      </div>
    );
  }

  const radarData = [
    { subject: 'Saúde', A: getSafeScore(LifePilar.SAUDE) },
    { subject: 'Profissional', A: getSafeScore(LifePilar.PROFISSIONAL) },
    { subject: 'Financeiro', A: getSafeScore(LifePilar.FINANCEIRO) },
    { subject: 'Espiritual', A: getSafeScore(LifePilar.ESPIRITUAL) },
    { subject: 'Pessoal', A: getSafeScore(LifePilar.PESSOAL) },
  ].map(item => ({ ...item, A: Math.max(item.A, 5) }));

  const totalScore = radarData.reduce((acc, curr) => acc + curr.A, 0);
  const averageScore = Math.round(totalScore / 5);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 mb-4">
             <Sparkles className="w-3 h-3" /> Inteligência Analítica Ativa
          </div>
          <h2 className="text-4xl font-bold font-display text-slate-900 tracking-tight">Seu Raio-X de Vida</h2>
          <p className="text-slate-500 mt-2 font-medium">Mapeamento de performance nos 5 pilares fundamentais.</p>
        </div>
        <button onClick={() => navigateTo('dashboard')} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-[0.2em] shadow-sm">
           <LayoutDashboard className="w-4 h-4" /> Voltar ao Dashboard
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center min-h-[450px]">
           <h3 className="text-xl font-bold font-display text-slate-900 mb-8">Equilíbrio de Forças</h3>
           <div className="h-[320px] w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                    <Radar 
                      name="Nível" 
                      dataKey="A" 
                      stroke="#2563eb" 
                      fill="#3b82f6" 
                      fillOpacity={0.15} 
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-8 flex gap-4 w-full">
               <div className="flex-1 p-5 bg-blue-50/50 rounded-3xl border border-blue-100 text-center">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Score Médio</p>
                  <p className="text-4xl font-bold text-blue-900 font-display">{averageScore}%</p>
               </div>
            </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-32 h-32 text-white" />
             </div>
             <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                <Zap className="w-4 h-4 fill-blue-400" /> Foco de Alavancagem
             </h4>
             <p className="text-2xl md:text-3xl font-display leading-tight relative z-10">
                "{weeklyFocus || 'Sua prioridade agora é estabilizar os fundamentos para permitir o crescimento exponencial.'}"
             </p>
          </section>

          <section className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-10 shadow-sm">
             <h4 className="text-lg font-bold font-display text-slate-900 mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" /> Dose Mínima Eficaz (MED)
             </h4>
             <div className="space-y-4">
                {medActions && medActions.length > 0 ? medActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                     <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-colors">
                        {i + 1}
                     </div>
                     <p className="text-sm text-slate-700 font-medium leading-relaxed">{action}</p>
                  </div>
                )) : (
                  <p className="text-slate-400 italic p-4 text-center">Calculando ações prioritárias...</p>
                )}
             </div>
          </section>

          <section className="bg-blue-50/30 border border-blue-100 rounded-[3rem] p-8 md:p-10">
             <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4">Análise de Impacto Cruzado</h4>
             <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                {impactAnalysis || 'Aguardando processamento da IA para identificar como seus pilares estão se influenciando mutuamente.'}
             </p>
          </section>

          <div className="pt-4">
             <button 
               onClick={() => navigateTo('planner')}
               className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-4 active:scale-95"
             >
               Ir para o Planner Semanal <Sparkles className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
