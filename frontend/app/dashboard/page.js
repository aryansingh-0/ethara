'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';
import { LogOut, FolderPlus, ListTodo } from 'lucide-react';
import StatsCards from '@/components/StatsCards';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import ProjectList from '@/components/ProjectList';
import RecentTasksList from '@/components/RecentTasksList';
import AiInput from '@/components/AiInput';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [userRole, setUserRole] = useState('Member');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, tasksData] = await Promise.all([
          fetchWithAuth('/projects'),
          fetchWithAuth('/tasks/user')
        ]);
        setProjects(projectsData);
        setTasks(tasksData);
      } catch (err) {
        if (err.message.includes('token') || err.message.includes('Authorized')) {
          router.push('/login');
        } else {
          toast.error(err.message);
        }
      }
    };
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role || 'Member');
    } else {
      router.push('/login');
    }

    fetchData();
  }, [router]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithAuth('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
      });
      setProjects([...projects, data]);
      setNewProjectName('');
      setNewProjectDesc('');
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAiGenerate = async (text, setter, type, mode = 'description', titleContext = '') => {
    if (!text && mode === 'description' && !titleContext) {
      toast.error(`Please enter a ${type} title first`);
      return;
    }
    const tid = toast.loading(mode === 'title' ? 'Polishing title...' : (text ? 'Enhancing description...' : 'AI is crafting a description...'));
    try {
      let url = `/ai/generate-description?type=${type}&mode=${mode}`;
      if (mode === 'title') {
        url += `&text=${encodeURIComponent(text)}`;
      } else {
        if (text) url += `&text=${encodeURIComponent(text)}`;
        if (titleContext) url += `&title=${encodeURIComponent(titleContext)}`;
      }

      const data = await fetchWithAuth(url);
      setter(data.description);
      toast.success(mode === 'title' ? 'Title improved!' : (text ? 'Description enhanced!' : 'Description generated!'), { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'To Do': return 'bg-slate-500 text-white';
      case 'In Progress': return 'bg-blue-600 text-white';
      case 'Completed': return 'bg-emerald-600 text-white';
      case 'Overdue': return 'bg-rose-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed')).length
  };

  const pieData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress, color: '#2563EB' },
    { name: 'Completed', value: stats.completed, color: '#10B981' },
    { name: 'Overdue', value: stats.overdue, color: '#EF4444' },
  ].filter(d => d.value > 0);

  const barData = projects.map(p => {
    const pTasks = tasks.filter(t => t.project?._id === p._id || t.project === p._id);
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      Completed: pTasks.filter(t => t.status === 'Completed').length,
      Active: pTasks.filter(t => t.status !== 'Completed').length,
    };
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-gray-100 p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Sticky Header */}
        <div className="sticky top-4 z-50 flex flex-wrap justify-between items-center bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl mb-12">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <ListTodo className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent leading-tight">Operation Center</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{userRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <ThemeToggle />
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl transition-all text-xs font-bold cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <StatsCards stats={stats} />

        {tasks.length > 0 && <AnalyticsCharts pieData={pieData} barData={barData} />}

        {userRole === 'Admin' && (
          <div className="bg-slate-50 dark:bg-slate-900/40 p-10 rounded-[2.5rem] border border-blue-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <FolderPlus className="w-48 h-48 text-blue-500" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <FolderPlus className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Initialize Project</h2>
              </div>
              <form onSubmit={handleCreateProject} className="flex flex-col lg:flex-row gap-6">
                <AiInput 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onAiGenerate={() => handleAiGenerate(newProjectName, setNewProjectName, 'project', 'title')}
                  placeholder="Operational Name"
                  mode="title"
                  required
                  className="flex-[2]"
                />
                <AiInput 
                  value={newProjectDesc} 
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  onAiGenerate={() => handleAiGenerate(newProjectDesc, setNewProjectDesc, 'project', 'description', newProjectName)}
                  placeholder="Detailed Strategy / Description"
                  mode="description"
                  className="flex-[3]"
                />
                <button type="submit" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black tracking-widest uppercase text-sm transition-all shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] cursor-pointer">
                  Deploy
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
          <ProjectList projects={projects} />
          <RecentTasksList tasks={tasks} getStatusColor={getStatusColor} />
        </div>

      </div>
    </div>
  );
}
