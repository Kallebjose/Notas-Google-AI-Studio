import { NoteColor } from '@/types/note';

export interface ColorScheme {
  label: string;
  dot: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  badge: string;
}

export const COLOR_SCHEMES: Record<NoteColor, ColorScheme> = {
  default: {
    label: 'Padrão',
    dot: 'bg-slate-400',
    bgLight: 'bg-white',
    bgDark: 'dark:bg-[#1a1c23]',
    borderLight: 'border-slate-200',
    borderDark: 'dark:border-slate-800',
    badge: 'text-slate-600 dark:text-slate-400',
  },
  amber: {
    label: 'Âmbar',
    dot: 'bg-amber-500',
    bgLight: 'bg-amber-50/60',
    bgDark: 'dark:bg-[#251f14]',
    borderLight: 'border-amber-200/80',
    borderDark: 'dark:border-amber-900/60',
    badge: 'text-amber-700 dark:text-amber-400',
  },
  emerald: {
    label: 'Esmeralda',
    dot: 'bg-emerald-500',
    bgLight: 'bg-emerald-50/60',
    bgDark: 'dark:bg-[#14231b]',
    borderLight: 'border-emerald-200/80',
    borderDark: 'dark:border-emerald-900/60',
    badge: 'text-emerald-700 dark:text-emerald-400',
  },
  sky: {
    label: 'Azul Céu',
    dot: 'bg-sky-500',
    bgLight: 'bg-sky-50/60',
    bgDark: 'dark:bg-[#141f28]',
    borderLight: 'border-sky-200/80',
    borderDark: 'dark:border-sky-900/60',
    badge: 'text-sky-700 dark:text-sky-400',
  },
  rose: {
    label: 'Rosa',
    dot: 'bg-rose-500',
    bgLight: 'bg-rose-50/60',
    bgDark: 'dark:bg-[#26151b]',
    borderLight: 'border-rose-200/80',
    borderDark: 'dark:border-rose-900/60',
    badge: 'text-rose-700 dark:text-rose-400',
  },
  purple: {
    label: 'Roxo',
    dot: 'bg-purple-500',
    bgLight: 'bg-purple-50/60',
    bgDark: 'dark:bg-[#221629]',
    borderLight: 'border-purple-200/80',
    borderDark: 'dark:border-purple-900/60',
    badge: 'text-purple-700 dark:text-purple-400',
  },
  slate: {
    label: 'Ardósia',
    dot: 'bg-slate-500',
    bgLight: 'bg-slate-100/70',
    bgDark: 'dark:bg-[#1e2129]',
    borderLight: 'border-slate-300/80',
    borderDark: 'dark:border-slate-700/60',
    badge: 'text-slate-700 dark:text-slate-300',
  },
};
