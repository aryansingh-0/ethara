'use client';
import { Clock, CheckCircle2, User, Calendar as CalendarIcon } from 'lucide-react';

export default function TaskCard({ task, onStatusChange, getStatusColor }) {
  const statusOptions = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative Gradient Line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${getStatusColor(task.status).split(' ')[0]}`}></div>

      <div className="space-y-6 flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">
            {task.title}
          </h3>
          <span className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)} border border-white/10 shadow-lg`}>
            {task.status}
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium line-clamp-3">
          {task.description || "No description provided."}
        </p>

        <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
        <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 font-black mb-3 block ml-1">Update Status</label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(task._id, status)}
              className={`py-2 px-1 text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all border cursor-pointer ${
                task.status === status
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-black/5 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
