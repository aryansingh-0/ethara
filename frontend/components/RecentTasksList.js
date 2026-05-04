'use client';

export default function RecentTasksList({ tasks, getStatusColor }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-200 border-b border-gray-700 pb-3">Recent Tasks</h2>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-md overflow-hidden">
        <ul className="divide-y divide-gray-700 max-h-[500px] overflow-y-auto custom-scrollbar">
          {tasks.slice(0, 10).map((task) => (
            <li key={task._id} className="p-4 hover:bg-gray-750 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-gray-200">{task.title}</h4>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-900 rounded border border-gray-700">{task.project?.name || 'Unknown'}</span>
                    {task.dueDate && <span className="text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${getStatusColor(task.status)} border border-white/10`}>
                  {task.status}
                </span>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="p-8 text-center text-gray-500 border-dashed">No tasks currently assigned or available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
