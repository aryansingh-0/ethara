'use client';
import { useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import AiInput from './AiInput';

export default function CreateTaskForm({ project, onCreateTask, onAiGenerate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTask({ title, description, assignedTo, dueDate });
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setDueDate('');
  };

  return (
    <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-8 md:p-10 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
        <Plus className="w-40 h-40 text-blue-500" />
      </div>
      <div className="relative space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Plus className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Initialize Operation</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black ml-1">Mission Title</label>
            <AiInput 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              onAiGenerate={() => onAiGenerate(title, setTitle, 'task', 'title')}
              placeholder="e.g. Core System Integration"
              mode="title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black ml-1">Responsible Entity</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer text-slate-900 dark:text-white appearance-none"
            >
              <option value="">Select individual...</option>
              {project.members.map(member => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black ml-1">Strategy Brief</label>
            <AiInput 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              onAiGenerate={() => onAiGenerate(description, setDescription, 'task', 'description', title)}
              placeholder="Operational objectives..."
              mode="description"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black ml-1">Deadline</label>
            <div className="relative">
              <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-14 pr-5 py-4 bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <button type="submit" className="md:col-span-2 w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black tracking-widest uppercase text-xs transition-all shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] cursor-pointer">
            Deploy Task
          </button>
        </form>
      </div>
    </div>
  );
}
