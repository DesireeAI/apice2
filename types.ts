
export enum LifePilar {
  SAUDE = 'Saúde',
  PROFISSIONAL = 'Profissional',
  FINANCEIRO = 'Financeiro',
  ESPIRITUAL = 'Espiritual',
  PESSOAL = 'Pessoal'
}

export interface PilarMetrics {
  score: number; // 0-100
  label: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface DiagnosisResult {
  weeklyFocus: string;
  pilarScores: Record<LifePilar, number>;
  medActions: string[];
  suggestedSchedule: TimeBlock[];
}

export interface TimeBlock {
  id: string;
  title: string;
  pilar: LifePilar;
  startTime: string; // ISO or simple format
  duration: number; // in minutes
  impact: 'low' | 'medium' | 'high';
}

export interface Mentor {
  id: string;
  name: string;
  specialty: LifePilar[];
  bio: string;
  rating: number;
  avatar: string;
}

export interface MastermindGroup {
  id: string;
  title: string;
  facilitator: string;
  pilar: LifePilar;
  nextSession: string;
  spots: number;
  description: string;
}
