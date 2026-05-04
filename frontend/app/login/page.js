'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '../../lib/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    const toastId = toast.loading('Logging in...');
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, role: data.user.role || 'Member' }));
      toast.success('Successfully logged in!', { id: toastId });
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

        <div className="relative">
          <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Task Manager</h2>
          <h3 className="text-gray-400 text-center mt-2 font-medium tracking-wide">Welcome back</h3>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-gray-100"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-gray-100"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] font-bold tracking-wide mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 relative">
          Don't have an account? <a href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Register</a>
        </p>
      </div>
    </div>
  );
}
