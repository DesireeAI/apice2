
import { createContext, useContext, useState, useEffect } from 'react';
import { LifePilar, TimeBlock, UserProfile, DiagnosisResult } from '../types';
import { supabase } from '../lib/supabase';

interface LifeState {
  user: UserProfile | null;
  scores: Record<LifePilar, number>;
  weeklyFocus: string;
  medActions: string[];
  activities: TimeBlock[];
  impactAnalysis: string;
  isSynced: { google: boolean; outlook: boolean };
  subscriptionStatus: 'active' | 'pending' | 'inactive';
  scheduledSessions: any[];
  activeTab: string;
  isFirstTime: boolean;
  loading: boolean;
}

interface LifeContextType extends LifeState {
  setUser: (user: any) => void;
  updateDiagnosis: (data: DiagnosisResult, rawAnswers?: any[]) => Promise<void>;
  addActivity: (activity: Omit<TimeBlock, 'id'>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  toggleSync: (provider: 'google' | 'outlook') => void;
  scheduleSession: (session: any) => void;
  navigateTo: (tab: string) => void;
  logout: () => void;
}

const LifeContext = createContext<LifeContextType | undefined>(undefined);

// Helper para converter dados do Supabase (snake_case) para App (camelCase)
const mapFromDB = (data: any): TimeBlock => ({
  id: String(data.id),
  title: data.title,
  pilar: data.pilar as LifePilar,
  startTime: data.start_time,
  duration: data.duration,
  impact: data.impact,
  day: data.day !== undefined ? data.day : null,
  hour: data.hour !== undefined ? data.hour : null,
  quadrant: data.quadrant || 'do'
});

export const LifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeState>({
    user: null,
    scores: {
      [LifePilar.SAUDE]: 0,
      [LifePilar.PROFISSIONAL]: 0,
      [LifePilar.FINANCEIRO]: 0,
      [LifePilar.ESPIRITUAL]: 0,
      [LifePilar.PESSOAL]: 0,
    },
    weeklyFocus: "Realize seu diagnóstico inicial.",
    medActions: [],
    activities: [],
    impactAnalysis: "Análise pendente.",
    isSynced: { google: false, outlook: false },
    subscriptionStatus: 'pending',
    scheduledSessions: [],
    activeTab: 'login',
    isFirstTime: true,
    loading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userPayload = { 
            id: session.user.id, 
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name 
          };
          
          setState(prev => ({ 
            ...prev, 
            user: userPayload, 
            activeTab: 'dashboard', 
            loading: false 
          }));
          loadUserData(session.user.id);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: diagnosis } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (diagnosis) {
        setState(prev => ({
          ...prev,
          scores: diagnosis.pilar_scores,
          weeklyFocus: diagnosis.weekly_focus,
          medActions: diagnosis.med_actions || [],
          impactAnalysis: diagnosis.impact_analysis,
          isFirstTime: false
        }));
      }

      const { data: acts, error: actsError } = await supabase
        .from('planner_blocks')
        .select('*')
        .eq('user_id', userId);
      
      if (!actsError && acts) {
        const mappedActivities = acts.map(mapFromDB);
        setState(prev => ({ ...prev, activities: mappedActivities }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    }
  };

  const navigateTo = (tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  };

  const setUser = (user: any) => {
    setState(prev => ({ ...prev, user }));
    if (user) loadUserData(user.id);
  };

  const updateDiagnosis = async (data: DiagnosisResult, rawAnswers?: any[]) => {
    if (!state.user) return;
    
    const { data: diagRecord, error: diagError } = await supabase.from('diagnoses').insert({
      user_id: state.user.id,
      pilar_scores: data.pilarScores,
      weekly_focus: data.weeklyFocus,
      med_actions: data.medActions,
      impact_analysis: data.impactAnalysis
    }).select().single();

    if (diagError) throw diagError;

    if (rawAnswers && diagRecord) {
      const answersPayload = rawAnswers.map(ans => ({
        user_id: state.user!.id,
        diagnosis_id: diagRecord.id,
        question_text: ans.pergunta,
        pilar: ans.pilar,
        answer_text: ans.resposta
      }));

      await supabase.from('diagnosis_answers').insert(answersPayload);
    }

    setState(prev => ({
      ...prev,
      scores: data.pilarScores,
      weeklyFocus: data.weeklyFocus,
      medActions: data.medActions,
      impactAnalysis: data.impactAnalysis,
      isFirstTime: false
    }));
  };

  const addActivity = async (activity: Omit<TimeBlock, 'id'>) => {
    if (!state.user) return;
    
    const dbPayload = {
      user_id: state.user.id,
      title: activity.title,
      pilar: activity.pilar,
      start_time: activity.startTime,
      duration: activity.duration,
      impact: activity.impact,
      day: activity.day,
      hour: activity.hour,
      quadrant: activity.quadrant || 'do'
    };

    const { data, error } = await supabase
      .from('planner_blocks')
      .insert(dbPayload)
      .select()
      .single();

    if (!error && data) {
      const newActivity = mapFromDB(data);
      setState(prev => ({ ...prev, activities: [...prev.activities, newActivity] }));
    } else if (error) {
      console.error("Erro detalhado Supabase:", error);
      alert("Falha ao salvar. Certifique-se de que as colunas 'day' e 'hour' permitem valores nulos no banco de dados.");
    }
  };

  const removeActivity = async (id: string) => {
    if (!state.user) return;
    try {
      const { error } = await supabase.from('planner_blocks').delete().eq('id', id);
      if (error) throw error;
      setState(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
    } catch (err) {
      console.error("Erro ao remover atividade:", err);
      alert("Não foi possível excluir a tarefa. Verifique sua conexão.");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState(prev => ({ 
      ...prev, 
      user: null, 
      activeTab: 'login', 
      scores: {
        [LifePilar.SAUDE]: 0,
        [LifePilar.PROFISSIONAL]: 0,
        [LifePilar.FINANCEIRO]: 0,
        [LifePilar.ESPIRITUAL]: 0,
        [LifePilar.PESSOAL]: 0,
      },
      activities: []
    }));
  };

  const toggleSync = (provider: 'google' | 'outlook') => {
    setState(prev => ({
      ...prev,
      isSynced: { ...prev.isSynced, [provider]: !prev.isSynced[provider] }
    }));
  };

  const scheduleSession = (session: any) => {
    setState(prev => ({ ...prev, scheduledSessions: [...prev.scheduledSessions, session] }));
  };

  return (
    <LifeContext.Provider value={{ 
      ...state, 
      setUser,
      updateDiagnosis, 
      addActivity,
      removeActivity,
      toggleSync, 
      scheduleSession, 
      navigateTo,
      logout
    }}>
      {children}
    </LifeContext.Provider>
  );
};

export const useLife = () => {
  const context = useContext(LifeContext);
  if (!context) throw new Error("useLife must be used within a LifeProvider");
  return context;
};
