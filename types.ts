
export enum LifePilar {
  SAUDE = 'Saúde',
  PROFISSIONAL = 'Profissional',
  FINANCEIRO = 'Financeiro',
  ESPIRITUAL = 'Espiritual',
  PESSOAL = 'Pessoal'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

export interface DiagnosisResult {
  id?: string;
  weeklyFocus: string;
  pilarScores: Record<LifePilar, number>;
  medActions: string[];
  impactAnalysis: string;
  created_at?: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  pilar: LifePilar;
  startTime: string; 
  duration: number; 
  impact: 'low' | 'medium' | 'high';
  day?: number;
  hour?: number;
}

export interface MatrixItem {
  id: string;
  task: string;
  quadrant: 'do' | 'schedule' | 'delegate' | 'eliminate';
}
