
import React from 'react';
import { Heart, Briefcase, DollarSign, Cloud, Users, LayoutDashboard, Calendar, Users2, UserCheck, Settings as SettingsIcon } from 'lucide-react';
import { LifePilar } from './types';

export const PILAR_COLORS = {
  [LifePilar.SAUDE]: '#10B981', // Emerald
  [LifePilar.PROFISSIONAL]: '#3B82F6', // Blue
  [LifePilar.FINANCEIRO]: '#F59E0B', // Amber
  [LifePilar.ESPIRITUAL]: '#8B5CF6', // Violet
  [LifePilar.PESSOAL]: '#EC4899', // Pink
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
  { id: 'diagnosis', label: 'Rotina Inteligente', icon: <Heart className="w-5 h-5" /> },
  { id: 'planner', label: 'Planner Semanal', icon: <Calendar className="w-5 h-5" /> },
  { id: 'masterminds', label: 'Masterminds', icon: <Users2 className="w-5 h-5" /> },
  { id: 'individual', label: 'Consultoria VIP 1:1', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'settings', label: 'Configurações', icon: <SettingsIcon className="w-5 h-5" /> },
];
