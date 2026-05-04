'use client';
import { Sparkles, Wand2 } from 'lucide-react';

export default function AiInput({ 
  value, 
  onChange, 
  placeholder, 
  onAiGenerate, 
  type = 'project', 
  mode = 'description',
  required = false,
  className = ""
}) {
  const Icon = mode === 'title' ? Wand2 : Sparkles;
  const buttonTitle = mode === 'title' ? 'Polish title' : 'Auto-generate description';
  const buttonColor = mode === 'title' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400';

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 shadow-sm"
      />
      <button
        type="button"
        onClick={onAiGenerate}
        className={`absolute right-3 p-1.5 rounded-lg transition-colors cursor-pointer ${buttonColor}`}
        title={buttonTitle}
      >
        <Icon className="w-4 h-4" />
      </button>
    </div>
  );
}
