'use client';
import { Clock, Filter, Layout, CheckCircle2, ListTodo, PlayCircle, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import { useState } from 'react';

export default function TaskBoard({ 
  tasks, 
  totalCount,
  filterStatus, 
  onFilterChange, 
  onStatusChange, 
  getStatusColor 
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterOptions = [
    { name: 'All', icon: ListTodo },
    { name: 'To Do', icon: Clock },
    { name: 'In Progress', icon: PlayCircle },
    { name: 'Completed', icon: CheckCircle2 },
    { name: 'Overdue', icon: AlertCircle },
  ];

  return (
    <div className="space-y-10 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-black/5 dark:border-white/5 pb-10">
        <div className="flex items-center gap-5">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl">
            <Layout className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Active Board</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Operation progress and task distribution</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border cursor-pointer ${
                filterStatus !== 'All' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterStatus === 'All' ? 'Filter' : filterStatus}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden p-2">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => {
                      onFilterChange(opt.name);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterStatus === opt.name 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-10 w-[1px] bg-black/5 dark:bg-white/5 mx-2"></div>
          <div className="text-right">
             <div className="text-xl font-black text-slate-900 dark:text-white leading-none">
               {tasks.length}
             </div>
             <div className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mt-1">
               {filterStatus === 'All' ? 'Total' : 'Found'}
             </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onStatusChange={onStatusChange} 
            getStatusColor={getStatusColor} 
          />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-40 bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center group">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 group-hover:border-blue-500/50 transition-colors shadow-2xl">
              <Filter className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-600 mb-3">
               {filterStatus === 'All' ? 'No tasks found' : `No tasks with status "${filterStatus}"`}
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-sm font-medium">Try changing your filters or initialize a new task.</p>
          </div>
        )}
      </div>
    </div>
  );
}
