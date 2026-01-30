
import React, { useState } from 'react';
import { generateLifeDiagnosis } from '../services/geminiService';
import { Brain, Sparkles, ArrowRight, Loader2, CheckCircle, Edit3, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLife } from '../context/LifeContext';
import { LifePilar } from '../types';
import { PILAR_COLORS } from '../constants';

const Diagnosis: React.FC = () => {
  const { updateDiagnosis, navigateTo } = useLife();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [localResult, setLocalResult] = useState<any>(null);

  const questionBank = [
    // SAÚDE
    { pilar: LifePilar.SAUDE, text: "Qual a qualidade média do seu sono?", options: ["Péssima (Insonia/Acorda cansado)", "Irregular (Acorda bem às vezes)", "Básica (Dorme 6h mas sem rotina)", "Boa (Dorme 7-8h consistente)", "Excelente (Sono profundo e restaurador)"] },
    { pilar: LifePilar.SAUDE, text: "Frequência de atividade física semanal?", options: ["Nenhuma", "1-2 vezes (Esporádico)", "3 vezes (Básico)", "4-5 vezes (Consistente)", "Diária ou Atleta (Alta performance)"] },
    { pilar: LifePilar.SAUDE, text: "Nível de energia durante o dia?", options: ["Sempre exausto", "Cansaço após o almoço", "Estável mas depende de café", "Energia boa o dia todo", "Vitalidade extrema e foco alto"] },
    { pilar: LifePilar.SAUDE, text: "Qualidade da sua alimentação?", options: ["Ultraprocessados e fast-food", "Tenta comer bem mas falha", "Equilibrada (Arroz, feijão, proteína)", "Planejada e nutritiva", "Otimizada (Biohacking/Suplementação)"] },
    { pilar: LifePilar.SAUDE, text: "Nível de estresse percebido?", options: ["Burnout ou Crônico", "Frequentemente estressado", "Moderado (Controlável)", "Baixo (Lida bem com pressão)", "Serenidade absoluta"] },

    // PROFISSIONAL
    { pilar: LifePilar.PROFISSIONAL, text: "Clareza de metas profissionais?", options: ["Nenhuma meta", "Metas vagas na cabeça", "Metas anuais definidas", "Metas trimestrais e plano de ação", "Propósito claro e OKRs semanais"] },
    { pilar: LifePilar.PROFISSIONAL, text: "Qualidade do seu Deep Work (Trabalho focado)?", options: ["Sempre distraído", "Muitas interrupções", "Consegue 1h de foco", "Blocos de 2h-4h de foco total", "Foco cirúrgico e alta saída"] },
    { pilar: LifePilar.PROFISSIONAL, text: "Consistência de aprendizado/estudo?", options: ["Não estuda nada novo", "Lê algo esporadicamente", "1 livro/curso por semestre", "Estudo semanal estruturado", "Aprendizado contínuo diário"] },
    { pilar: LifePilar.PROFISSIONAL, text: "Nível de delegação e processos?", options: ["Faz tudo sozinho(a)", "Centralizador(a) com sobrecarga", "Delega tarefas básicas", "Sistema de equipe funcional", "Empresa/Carreira autogerenciável"] },
    { pilar: LifePilar.PROFISSIONAL, text: "Satisfação com resultados atuais?", options: ["Muito insatisfeito", "Poderia estar melhor", "Dentro da média esperada", "Resultados acima do mercado", "Topo da carreira/Nicho"] },

    // FINANCEIRO
    { pilar: LifePilar.FINANCEIRO, text: "Controle de gastos mensais?", options: ["Não faz ideia de quanto gasta", "Olha o extrato no fim do mês", "Usa planilha/app básico", "Controle rigoroso e orçamentado", "Gestão profissional de fluxos"] },
    { pilar: LifePilar.FINANCEIRO, text: "Capacidade de poupança/investimento?", options: ["Gasta mais do que ganha", "Zero sobra no fim do mês", "Poupa menos de 10% da renda", "Investe 20-30% da renda", "Investe +50% da renda ou vive de rendas"] },
    { pilar: LifePilar.FINANCEIRO, text: "Nível de endividamento?", options: ["Dívidas com juros altos", "Dívidas parceladas pesadas", "Dívidas controladas (financiamentos)", "Apenas dívidas operacionais", "Totalmente livre de dívidas"] },
    { pilar: LifePilar.FINANCEIRO, text: "Diversificação de investimentos?", options: ["Só poupança/dinheiro parado", "Renda fixa básica", "Renda fixa e algumas ações", "Portfólio diversificado (Brasil)", "Wealth Management Global"] },
    { pilar: LifePilar.FINANCEIRO, text: "Segurança financeira (Reserva)?", options: ["Sem reserva", "Reserva para 1 mês", "Reserva para 3-6 meses", "Reserva para 1 ano", "Independência Financeira"] },

    // ESPIRITUAL
    { pilar: LifePilar.ESPIRITUAL, text: "Prática de meditação ou silêncio?", options: ["Nunca faz", "Tenta às vezes", "1-2 vezes por semana", "Prática diária de 10-20min", "Mestre da atenção plena"] },
    { pilar: LifePilar.ESPIRITUAL, text: "Conexão com propósito maior?", options: ["Sente-se perdido(a)", "Busca significado", "Conectado(a) esporadicamente", "Age alinhado(a) aos valores", "Total comunhão com missão de vida"] },
    { pilar: LifePilar.ESPIRITUAL, text: "Nível de gratidão diária?", options: ["Foca apenas em problemas", "Raramente agradece", "Agradece por grandes conquistas", "Diário/Prática de gratidão diária", "Estado de gratidão constante"] },
    { pilar: LifePilar.ESPIRITUAL, text: "Tempo de reflexão/autoconhecimento?", options: ["Zero tempo", "Rápida reflexão semanal", "Terapia ou Mentorias regulares", "Retiros/Imersões frequentes", "Autotransformação contínua"] },
    { pilar: LifePilar.ESPIRITUAL, text: "Paz mental em situações de crise?", options: ["Desespero total", "Muito ansioso(a)", "Moderadamente estável", "Equilibrado(a) e calmo(a)", "Inabalável (Antifrágil)"] },

    // PESSOAL
    { pilar: LifePilar.PESSOAL, text: "Tempo de qualidade com família/parceiro?", options: ["Quase nenhum", "Apenas fins de semana", "Jantares/Encontros regulares", "Tempo de qualidade diário", "Prioridade absoluta e conexão profunda"] },
    { pilar: LifePilar.PESSOAL, text: "Dedicacão a hobbies e lazer?", options: ["Esqueceu o que gosta de fazer", "Hobbies esporádicos", "Lazer semanal garantido", "Vários hobbies ativos", "Equilíbrio vida-prazer ideal"] },
    { pilar: LifePilar.PESSOAL, text: "Nível das amizades e networking social?", options: ["Isolado(a)", "Amigos superficiais", "Grupo fixo de amigos", "Círculo de influência positivo", "Comunidade de alto valor"] },
    { pilar: LifePilar.PESSOAL, text: "Qualidade do tempo de descanso real?", options: ["Não desliga do trabalho", "Assiste TV mas se sente culpado", "Consegue relaxar nos fins de semana", "Férias e pausas planejadas", "Reset total e revitalização"] },
    { pilar: LifePilar.PESSOAL, text: "Satisfação com a vida social/lazer?", options: ["Muito frustrado(a)", "Poderia ser mais ativa", "Satisfatória", "Muito boa e variada", "Vida social plena e gratificante"] }
  ];

  const handleOptionSelect = (option: string) => {
    const updatedAnswers = { ...answers, [currentStep]: option };
    setAnswers(updatedAnswers);
    
    if (currentStep < questionBank.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const submitDiagnosis = async () => {
    setLoading(true);
    try {
      // Transform answers to a format the IA can easily interpret
      const formattedData = questionBank.map((q, idx) => ({
        pergunta: q.text,
        pilar: q.pilar,
        resposta: answers[idx]
      }));
      
      const data = await generateLifeDiagnosis(formattedData);
      setLocalResult(data);
      updateDiagnosis(data);
    } catch (error) {
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center shadow-inner relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display text-slate-900">Análise de Redes Neurais...</h2>
          <p className="text-slate-500 mt-2">Correlacionando suas 25 variáveis para o plano ideal.</p>
        </div>
      </div>
    );
  }

  if (localResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100 shadow-sm">
            <Sparkles className="w-3 h-3" /> Mapeamento Concluído
          </div>
          <h2 className="text-4xl font-bold font-display text-slate-900">Seu Mapa de Evolução</h2>
          <p className="text-slate-500">Baseado nas suas respostas, aqui está sua rota para o próximo nível.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-10 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start border-b border-slate-100 pb-8">
            <div className="max-w-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Foco da Temporada</h3>
              <p className="text-2xl font-display leading-relaxed italic text-slate-800">"{localResult.weeklyFocus}"</p>
            </div>
            <button onClick={() => { setLocalResult(null); setCurrentStep(0); setAnswers({}); }} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
              <Edit3 className="w-4 h-4" /> Refazer Teste
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="font-bold font-display text-xl flex items-center gap-3 text-slate-900">
                <Brain className="w-6 h-6 text-blue-600" /> Ações Dose Mínima (MED)
              </h4>
              <ul className="space-y-4">
                {localResult.medActions.map((action: string, idx: number) => (
                  <li key={idx} className="flex gap-4 text-sm text-slate-600 items-start p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner">
              <h4 className="font-bold font-display text-xl mb-8 text-slate-900">Performance por Pilar</h4>
              <div className="space-y-6">
                {Object.entries(localResult.pilarScores).map(([pilar, score]) => (
                  <div key={pilar}>
                    <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-2">
                      <span>{pilar}</span>
                      <span className="text-slate-900">{score as number}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Análise Integrada
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {localResult.impactAnalysis}
            </p>
          </div>

          <button 
            onClick={() => navigateTo('planner')}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all text-lg flex items-center justify-center gap-3 active:scale-95"
          >
            Visualizar no Planner <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questionBank[currentStep];
  const pilarColor = PILAR_COLORS[currentQuestion.pilar];

  return (
    <div className="max-w-2xl mx-auto py-10 pb-32">
      <div className="mb-14">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
          <span className="flex items-center gap-2">
            Pilar <span style={{ color: pilarColor }}>{currentQuestion.pilar}</span>
          </span>
          <span className="text-blue-600">{currentStep + 1} de {questionBank.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
          {questionBank.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-full transition-all duration-300 ${idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`}
              style={{ width: `${100 / questionBank.length}%`, opacity: idx === currentStep ? 1 : idx < currentStep ? 0.6 : 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-10 animate-in slide-in-from-right-4 duration-400">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-slate-900">{currentQuestion.text}</h2>
          <p className="text-slate-400 text-sm">Selecione a opção que melhor descreve sua realidade atual.</p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-6 text-left border-2 rounded-2xl transition-all flex items-center justify-between group ${
                answers[currentStep] === option 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-slate-100 hover:border-blue-200 bg-white text-slate-600'
              }`}
            >
              <span className="font-semibold text-lg">{option}</span>
              <ChevronRight className={`w-5 h-5 transition-transform ${answers[currentStep] === option ? 'translate-x-0' : 'opacity-0 group-hover:opacity-100 translate-x-1'}`} />
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 py-3 px-6 bg-white hover:bg-slate-50 disabled:opacity-0 rounded-xl text-slate-500 font-bold tracking-widest uppercase text-[10px] transition-all border border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          
          {currentStep === questionBank.length - 1 && answers[currentStep] && (
            <button
              onClick={submitDiagnosis}
              className="py-4 px-10 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 text-white uppercase text-xs tracking-widest active:scale-95 animate-in zoom-in"
            >
              Finalizar e Analisar <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
