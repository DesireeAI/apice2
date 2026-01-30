
import React from 'react';
import { 
  Heart, Briefcase, DollarSign, Cloud, Users, 
  LayoutDashboard, Calendar, Users2, UserCheck, 
  Settings as SettingsIcon, BookOpen, Layers, Activity
} from 'lucide-react';
import { LifePilar } from './types';

export const PILAR_COLORS = {
  [LifePilar.SAUDE]: '#10B981', 
  [LifePilar.PROFISSIONAL]: '#3B82F6', 
  [LifePilar.FINANCEIRO]: '#F59E0B', 
  [LifePilar.ESPIRITUAL]: '#8B5CF6', 
  [LifePilar.PESSOAL]: '#EC4899', 
};

export const PILAR_ICONS = {
  [LifePilar.SAUDE]: <Heart className="w-5 h-5" />,
  [LifePilar.PROFISSIONAL]: <Briefcase className="w-5 h-5" />,
  [LifePilar.FINANCEIRO]: <DollarSign className="w-5 h-5" />,
  [LifePilar.ESPIRITUAL]: <Cloud className="w-5 h-5" />,
  [LifePilar.PESSOAL]: <Users className="w-5 h-5" />,
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'diagnosis', label: 'Novo Diagnóstico', icon: <Activity className="w-5 h-5" /> },
  { id: 'results', label: 'Raio-X de Vida', icon: <Layers className="w-5 h-5" /> },
  { id: 'planner', label: 'Planner Semanal', icon: <Calendar className="w-5 h-5" /> },
  { id: 'eisenhower', label: 'Matriz Prioridade', icon: <Layers className="w-5 h-5" /> },
  { id: 'guide', label: 'Guia & PDFs', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'masterminds', label: 'Masterminds', icon: <Users2 className="w-5 h-5" /> },
  { id: 'individual', label: 'Mentoria VIP', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'settings', label: 'Configurações', icon: <SettingsIcon className="w-5 h-5" /> },
];
