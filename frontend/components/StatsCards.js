'use client';
import { ListTodo, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'blue' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'indigo' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'emerald' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'rose' },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', glow: 'group-hover:bg-blue-500/20' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', glow: 'group-hover:bg-indigo-500/20' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', glow: 'group-hover:bg-emerald-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', glow: 'group-hover:bg-rose-500/20' },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const colorKey = card.label === 'Overdue' ? 'rose' : (card.label === 'Completed' ? 'emerald' : (card.label === 'In Progress' ? 'indigo' : 'blue'));
        const colors = colorMap[colorKey];
        const Icon = card.icon;
        return (
          <div key={i} className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-lg flex flex-col justify-center relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className={`absolute -right-4 -top-4 w-28 h-28 rounded-full blur-3xl transition-all ${colors.glow} opacity-40`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">{card.label}</span>
                <div className={`text-4xl font-black mt-3 ${colors.text} tracking-tight`}>{card.value}</div>
              </div>
              <div className={`p-4 ${colors.bg} rounded-2xl`}>
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
