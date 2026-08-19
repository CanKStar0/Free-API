'use client';

import React from 'react';
import {
  CloudSun,
  Coins,
  Gamepad2,
  Compass,
  MessageSquare,
  Film,
  Headphones,
  Newspaper,
  TrendingUp,
  Code2,
  GraduationCap,
  HeartPulse,
  Utensils,
  Rocket,
  Trophy,
  PawPrint,
  Sparkles,
  Palette,
  BookOpen,
  Calendar,
  Bot,
  Server,
  Mail,
  Leaf,
  Landmark,
  Shield,
  Cpu,
  Network,
  Briefcase,
  CreditCard,
  Camera,
  Layers,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  weather: CloudSun,
  crypto: Coins,
  gaming: Gamepad2,
  maps: Compass,
  social: MessageSquare,
  movies: Film,
  music: Headphones,
  news: Newspaper,
  finance: TrendingUp,
  developer: Code2,
  education: GraduationCap,
  health: HeartPulse,
  food: Utensils,
  space: Rocket,
  sports: Trophy,
  animals: PawPrint,
  anime: Sparkles,
  art: Palette,
  books: BookOpen,
  calendar: Calendar,
  chat: Bot,
  cloud: Server,
  email: Mail,
  environment: Leaf,
  government: Landmark,
  security: Shield,
  iot: Cpu,
  network: Network,
  jobs: Briefcase,
  payment: CreditCard,
  photos: Camera,
};

interface CategoryIconProps {
  categoryId: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ categoryId, className = '', size = 20 }: CategoryIconProps) {
  const IconComponent = ICON_MAP[categoryId.toLowerCase()] || Layers;

  return (
    <div
      className={`w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 flex items-center justify-center text-brand-700 dark:text-brand-400 group-hover:bg-brand-700 dark:group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent group-hover:scale-105 transition-all shadow-sm ${className}`}
    >
      <IconComponent size={size} strokeWidth={1.75} />
    </div>
  );
}
