'use client';
import { ChevronLeft, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function ProjectDetailHeader({ project }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="sticky top-4 z-50 group">
      <div className="relative bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl overflow-hidden">
        
        {/* Compact Navigation Row */}
        <div className="flex items-center justify-between gap-4 ">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-lg transition-all text-[11px] font-black uppercase tracking-widest group cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </button>
            <div className="h-6 w-[1px] bg-black/5 dark:bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg">
                <Layout className="w-4 h-4 text-blue-500" />
              </div>
              <h1 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px] md:max-w-xs">
                {project.name}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={logout}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Members Quick Access */}
        {/* <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/5 dark:border-white/5">
           <div className="flex -space-x-2">
              {project.members.slice(0, 5).map((member) => (
                <div 
                  key={member._id} 
                  className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] font-black text-white shadow-lg relative group/avatar"
                >
                  {member.name.charAt(0)}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-[8px] rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap z-50 text-white">
                    {member.name}
                  </div>
                </div>
              ))}
              {project.members.length > 5 && (
                <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-500">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">Operation Members</span>
               <div className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-md text-[10px] font-black">{project.members.length}</div>
            </div>
        </div> */}

      </div>
    </div>
  );
}
