
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  updateDiagnosis: (data: DiagnosisResult) => Promise<void>;
  addActivity: (activity: TimeBlock) => Promise<void>;
  toggleSync: (provider: 'google' | 'outlook') => void;
  scheduleSession: (session: any) => void;
  navigateTo: (tab: string) => void;
  logout: () => void;
}

const LifeContext = createContext<LifeContextType | undefined>(undefined);

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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Correção: Extraindo full_name do metadata na inicialização
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
    };
    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    // Carregar Diagnóstico
    const { data: diagnosis } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (diagnosis) {
      setState(prev => ({
        ...prev,
        scores: diagnosis.pilar_scores,
        weeklyFocus: diagnosis.weekly_focus,
        med_actions: diagnosis.med_actions,
        impact_analysis: diagnosis.impact_analysis,
        isFirstTime: false
      }));
    }

    // Carregar Atividades
    const { data: acts } = await supabase
      .from('planner_blocks')
      .select('*')
      .eq('user_id', userId);
    
    if (acts) {
      setState(prev => ({ ...prev, activities: acts }));
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

  const updateDiagnosis = async (data: DiagnosisResult) => {
    if (!state.user) return;
    
    const { error } = await supabase.from('diagnoses').insert({
      user_id: state.user.id,
      pilar_scores: data.pilarScores,
      weekly_focus: data.weeklyFocus,
      med_actions: data.medActions,
      impact_analysis: data.impactAnalysis
    });

    if (!error) {
      setState(prev => ({
        ...prev,
        scores: data.pilarScores,
        weeklyFocus: data.weeklyFocus,
        medActions: data.medActions,
        impactAnalysis: data.impactAnalysis,
        isFirstTime: false
      }));
    }
  };

  const addActivity = async (activity: TimeBlock) => {
    if (!state.user) return;
    const { data, error } = await supabase.from('planner_blocks').insert({
      user_id: state.user.id,
      title: activity.title,
      pilar: activity.pilar,
      start_time: activity.startTime,
      duration: activity.duration,
      impact: activity.impact,
      day: activity.day,
      hour: activity.hour
    }).select().single();

    if (!error && data) {
      setState(prev => ({ ...prev, activities: [...prev.activities, data] }));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState(prev => ({ ...prev, user: null, activeTab: 'login' }));
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
