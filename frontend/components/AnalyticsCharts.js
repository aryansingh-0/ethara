'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function AnalyticsCharts({ pieData, barData }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    setIsDark(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  const chartColors = {
    grid: isDark ? '#1e293b' : '#e2e8f0',
    text: isDark ? '#9ca3af' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#1e293b' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#0f172a'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Pie Chart */}
      <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl flex flex-col items-center group transition-all duration-500">
        <h2 className="text-xl font-black text-slate-900 dark:text-white w-full border-b border-black/5 dark:border-white/10 pb-4 mb-6 tracking-tight">Status Distribution</h2>
        <div className="w-full h-[280px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    border: `1px solid ${chartColors.tooltipBorder}`, 
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                  itemStyle={{ color: chartColors.tooltipText }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 italic text-sm">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current mb-4 opacity-20"></div>
              No data distribution
            </div>
          )}
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-xl group transition-all duration-500">
        <h2 className="text-xl font-black text-slate-900 dark:text-white border-b border-black/5 dark:border-white/10 pb-4 mb-6 tracking-tight">Operational Progress</h2>
        <div className="w-full h-[280px]">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke={chartColors.text} 
                  tick={{fill: chartColors.text, fontSize: 10, fontWeight: 'bold'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke={chartColors.text} 
                  tick={{fill: chartColors.text, fontSize: 10, fontWeight: 'bold'}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}} 
                  contentStyle={{ 
                    backgroundColor: chartColors.tooltipBg, 
                    border: `1px solid ${chartColors.tooltipBorder}`, 
                    borderRadius: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Legend formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{value}</span>} />
                <Bar dataKey="Completed" stackId="a" fill="#10B981" radius={[0, 0, 8, 8]} barSize={32} />
                <Bar dataKey="Active" stackId="a" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 italic text-sm">
               <div className="w-12 h-12 rounded-full border-2 border-dashed border-current mb-4 opacity-20"></div>
               Insufficient project metrics
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
