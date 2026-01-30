
import React from 'react';
import { useLife } from '../context/LifeContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Brain, Sparkles, CheckCircle2, ChevronRight, LayoutDashboard } from 'lucide-react';

const DiagnosisResult: React.FC = () => {
  const { scores, weeklyFocus, medActions, impactAnalysis, navigateTo } = useLife();

  const radarData = Object.entries(scores).map(([pilar, score]) => ({
    subject: pilar,
    A: score || 10,
    fullMark: 100,
  }));

  // Calculate average score safely by ensuring all inputs are treated as numbers to avoid arithmetic errors
  // Fixed: Cast Object.values(scores) to number[] to resolve "Type 'unknown' is not assignable to type 'number'" error
  const totalScore: number = (Object.values(scores) as number[]).reduce((acc: number, val: number) => acc + (val || 0), 0);
  const averageScore = Math.round(totalScore / 5);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 mb-3">
             <Sparkles className="w-3 h-3" /> Resultado do Diagnóstico IA
          </div>
          <h2 className="text-4xl font-bold font-display text-slate-900">Seu Raio-X de Vida</h2>
          <p className="text-slate-500 mt-2">Mapeamento completo dos seus 5 pilares de performance.</p>
        </div>
        <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
           <LayoutDashboard className="w-4 h-4" /> Ir para Painel
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center">
           <h3 className="text-lg font-bold font-display text-slate-900 mb-6 text-center">Balanço Integral</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                  <Radar name="Vida" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Médio</p>
               <p className="text-3xl font-bold text-slate-800">{averageScore}%</p>
            </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <section className="bg-blue-600 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-blue-100">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4" /> Foco da Temporada
             </h4>
             <p className="text-2xl md:text-3xl font-display leading-tight italic">
                "{weeklyFocus}"
             </p>
          </section>

          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
             <h4 className="text-xl font-bold font-display text-slate-900 mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" /> Ações de Dose Mínima (MED)
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medActions.length > 0 ? medActions.map((action, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 font-medium">
                     {action}
                  </div>
                )) : (
                  <p className="text-slate-400 italic">Nenhuma ação gerada ainda.</p>
                )}
             </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
             <h4 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-600" /> Análise de Impacto Cruzado
             </h4>
             <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-100 pl-6 py-2">
                {impactAnalysis}
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
