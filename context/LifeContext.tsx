
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LifePilar, TimeBlock, UserProfile, DiagnosisResult } from '../types';
import { supabase } from '../lib/supabase';

interface LifeState {
  user: UserProfile | null;
  scores: Record<LifePilar, number>;
  pilarNotes: Record<LifePilar, string>;
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
  isRecovering: boolean; // Estado que bloqueia o dashboard
}

interface LifeContextType extends LifeState {
  setUser: (user: any) => void;
  updateDiagnosis: (data: DiagnosisResult, rawAnswers?: any[]) => Promise<void>;
  updatePilarNote: (pilar: LifePilar, note: string) => Promise<void>;
  addActivity: (activity: Omit<TimeBlock, 'id'>) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  toggleSync: (provider: 'google' | 'outlook') => void;
  scheduleSession: (session: any) => void;
  navigateTo: (tab: string) => void;
  logout: () => void;
  setIsRecovering: (val: boolean) => void;
}

const LifeContext = createContext<LifeContextType | undefined>(undefined);

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
    pilarNotes: {
      [LifePilar.SAUDE]: "",
      [LifePilar.PROFISSIONAL]: "",
      [LifePilar.FINANCEIRO]: "",
      [LifePilar.ESPIRITUAL]: "",
      [LifePilar.PESSOAL]: "",
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
    loading: true,
    isRecovering: false
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Verifica se o hash da URL contém sinais de recuperação (fallback para links diretos)
        const hash = window.location.hash;
        const isRecHash = hash.includes('type=recovery') || hash.includes('access_token=');

        if (session?.user) {
          const userPayload = { 
            id: session.user.id, 
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name 
          };
          
          setState(prev => ({ 
            ...prev, 
            user: userPayload, 
            isRecovering: prev.isRecovering || isRecHash,
            activeTab: (prev.isRecovering || isRecHash) ? 'update-password' : 'dashboard', 
            loading: false 
          }));
          loadUserData(session.user.id);
        } else {
          setState(prev => ({ 
            ...prev, 
            isRecovering: isRecHash,
            activeTab: isRecHash ? 'update-password' : 'login', 
            loading: false 
          }));
        }
      } catch (err) {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Bloqueio imediato ao detectar evento de recuperação
        setState(prev => ({ 
          ...prev, 
          isRecovering: true, 
          activeTab: 'update-password', 
          loading: false 
        }));
      } else if (event === 'SIGNED_IN' && session?.user) {
        const userPayload = { 
          id: session.user.id, 
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name 
        };

        setState(prev => ({ 
          ...prev, 
          user: userPayload, 
          // Se já estávamos em modo de recuperação, ignoramos o redirecionamento para o dashboard
          activeTab: prev.isRecovering ? 'update-password' : 'dashboard',
          loading: false 
        }));
        loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, user: null, activeTab: 'login', isRecovering: false, loading: false }));
      }
    });

    initAuth();
    return () => subscription.unsubscribe();
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
          weekly_focus: diagnosis.weekly_focus,
          med_actions: diagnosis.med_actions || [],
          impact_analysis: diagnosis.impact_analysis,
          isFirstTime: false
        }));
      }

      const { data: acts } = await supabase
        .from('planner_blocks')
        .select('*')
        .eq('user_id', userId);
      
      if (acts) {
        const mappedActivities = acts.map(mapFromDB);
        setState(prev => ({ ...prev, activities: mappedActivities }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  const updatePilarNote = async (pilar: LifePilar, note: string) => {
    setState(prev => ({
      ...prev,
      pilarNotes: { ...prev.pilarNotes, [pilar]: note }
    }));

    if (state.user) {
      await supabase.from('pilar_notes').upsert({
        user_id: state.user.id,
        pilar: pilar,
        note: note,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,pilar' });
    }
  };

  const navigateTo = (tab: string) => {
    // Impede navegação se estiver em recuperação obrigatória
    if (state.isRecovering && tab !== 'update-password') return;
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const setUser = (user: any) => {
    setState(prev => ({ ...prev, user }));
    if (user) loadUserData(user.id);
  };

  const setIsRecovering = (val: boolean) => {
    setState(prev => ({ ...prev, isRecovering: val }));
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
    const { data, error } = await supabase.from('planner_blocks').insert({
      user_id: state.user.id,
      title: activity.title,
      pilar: activity.pilar,
      start_time: activity.startTime,
      duration: activity.duration,
      impact: activity.impact,
      day: activity.day,
      hour: activity.hour,
      quadrant: activity.quadrant || 'do'
    }).select().single();

    if (!error && data) {
      const newActivity = mapFromDB(data);
      setState(prev => ({ ...prev, activities: [...prev.activities, newActivity] }));
    }
  };

  const removeActivity = async (id: string) => {
    if (!state.user) return;
    const { error } = await supabase.from('planner_blocks').delete().eq('id', id);
    if (!error) {
      setState(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState(prev => ({ 
      ...prev, 
      user: null, 
      activeTab: 'login', 
      isRecovering: false,
      loading: false
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
      updatePilarNote,
      addActivity,
      removeActivity,
      toggleSync, 
      scheduleSession, 
      navigateTo,
      logout,
      setIsRecovering
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
