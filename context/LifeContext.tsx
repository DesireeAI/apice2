
import React, { createContext, useContext, useState } from 'react';
import { LifePilar, TimeBlock } from '../types';

interface LifeState {
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
}

interface LifeContextType extends LifeState {
  updateDiagnosis: (data: any) => void;
  addActivity: (activity: TimeBlock) => void;
  toggleSync: (provider: 'google' | 'outlook') => void;
  scheduleSession: (session: any) => void;
  navigateTo: (tab: string) => void;
  completeOnboarding: () => void;
}

const LifeContext = createContext<LifeContextType | undefined>(undefined);

export const LifeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeState>({
    scores: {
      [LifePilar.SAUDE]: 0,
      [LifePilar.PROFISSIONAL]: 0,
      [LifePilar.FINANCEIRO]: 0,
      [LifePilar.ESPIRITUAL]: 0,
      [LifePilar.PESSOAL]: 0,
    },
    weeklyFocus: "Aguardando diagnóstico inicial...",
    medActions: [],
    activities: [],
    impactAnalysis: "Realize o diagnóstico para ver sua análise de impacto.",
    isSynced: { google: false, outlook: false },
    subscriptionStatus: 'pending',
    scheduledSessions: [],
    activeTab: 'dashboard',
    isFirstTime: true
  });

  const navigateTo = (tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    // Scroll to top on navigation
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  };

  const updateDiagnosis = (data: any) => {
    setState(prev => ({
      ...prev,
      scores: data.pilarScores,
      weeklyFocus: data.weeklyFocus,
      medActions: data.medActions,
      impactAnalysis: data.impactAnalysis,
      isFirstTime: false,
      subscriptionStatus: 'active'
    }));
  };

  const addActivity = (activity: TimeBlock) => {
    setState(prev => ({ ...prev, activities: [...prev.activities, activity] }));
  };

  const toggleSync = (provider: 'google' | 'outlook') => {
    setState(prev => ({
      ...prev,
      isSynced: { ...prev.isSynced, [provider]: !prev.isSynced[provider] }
    }));
  };

  const scheduleSession = (session: any) => {
    setState(prev => ({
      ...prev,
      scheduledSessions: [...prev.scheduledSessions, session]
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ ...prev, isFirstTime: false }));
  };

  return (
    <LifeContext.Provider value={{ 
      ...state, 
      updateDiagnosis, 
      addActivity, 
      toggleSync, 
      scheduleSession, 
      navigateTo,
      completeOnboarding
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
