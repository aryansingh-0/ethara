'use client';
import { Users, Info } from 'lucide-react';
import UserSearch from './UserSearch';

export default function MemberRecruitment({ onAddMember }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-8 md:p-10 rounded-[2rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group">
      <div className="absolute -bottom-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
        <Users className="w-40 h-40 text-emerald-500" />
      </div>
      <div className="relative space-y-8 h-full flex flex-col">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Expand Team</h2>
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black ml-1">Recruit Candidate</label>
            <UserSearch onSelect={onAddMember} placeholder="Search by name or email..." />
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-black/5 dark:border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              Hierarchy & Clearances
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between group/role">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold group-hover/role:text-blue-500 transition-colors">Admin Access</span>
                <span className="text-[9px] bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-500/20 uppercase tracking-widest">Full</span>
              </div>
              <div className="flex items-center justify-between group/role">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold group-hover/role:text-blue-500 transition-colors">Member Access</span>
                <span className="text-[9px] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/10 uppercase tracking-widest">Limited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
