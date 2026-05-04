'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users } from 'lucide-react';

export default function ProjectList({ projects }) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-6">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Projects</h2>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg">
          {projects.length} Total
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div 
            key={project._id} 
            className="group bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-md hover:shadow-2xl hover:border-blue-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 cursor-pointer relative overflow-hidden" 
            onClick={() => router.push(`/projects/${project._id}`)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors leading-tight">
                  {project.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed max-w-lg">
                  {project.description}
                </p>
                
                <div className="pt-4 flex items-center gap-6 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-black/5 dark:border-white/5">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-black/5 dark:border-white/10 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
            
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="p-12 text-center text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-black/5 dark:border-white/5">
            No projects found in your registry.
          </div>
        )}
      </div>
    </div>
  );
}
