'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import toast from 'react-hot-toast';
import ProjectDetailHeader from '@/components/ProjectDetailHeader';
import CreateTaskForm from '@/components/CreateTaskForm';
import MemberRecruitment from '@/components/MemberRecruitment';
import TaskBoard from '@/components/TaskBoard';

export default function ProjectDetail({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [userRole, setUserRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(true);

  const filteredTasks = filterStatus === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectData, tasksData] = await Promise.all([
          fetchWithAuth(`/projects/${projectId}`),
          fetchWithAuth(`/tasks/${projectId}`)
        ]);
        setProject(projectData);
        setTasks(tasksData);
      } catch (err) {
        toast.error(err.message);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
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
  }, [projectId, router]);

  const handleCreateTask = async (taskData) => {
    const tid = toast.loading('Creating task...');
    try {
      const data = await fetchWithAuth('/tasks', {
        method: 'POST',
        body: JSON.stringify({ ...taskData, projectId })
      });
      
      const memberInfo = project.members.find(m => m._id === taskData.assignedTo);
      setTasks([{ ...data, assignedTo: memberInfo }, ...tasks]);
      toast.success('Task created successfully!', { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
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

  const handleAddMember = async (user) => {
    const tid = toast.loading(`Adding ${user.name}...`);
    try {
      await fetchWithAuth('/projects/member', {
        method: 'POST',
        body: JSON.stringify({ projectId, email: user.email })
      });
      toast.success(`${user.name} added to team!`, { id: tid });
      const updatedProject = await fetchWithAuth(`/projects/${projectId}`);
      setProject(updatedProject);
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const data = await fetchWithAuth(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: data.status } : t));
      toast.success(`Task marked as ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
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

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 text-slate-900 dark:text-white font-sans">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-gray-100 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        <ProjectDetailHeader project={project} />

        {userRole === 'Admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CreateTaskForm 
              project={project} 
              onCreateTask={handleCreateTask} 
              onAiGenerate={handleAiGenerate} 
            />
            <MemberRecruitment onAddMember={handleAddMember} />
          </div>
        )}

        <TaskBoard 
          tasks={filteredTasks}
          totalCount={tasks.length}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onStatusChange={handleStatusChange} 
          getStatusColor={getStatusColor} 
        />
      </div>
    </div>
  );
}
