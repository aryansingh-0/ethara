'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '../../lib/api';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, Shield, KeyRound, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    const tid = toast.loading('Sending verification email...');
    try {
      const data = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      setToken(data.token);
      setShowOtp(true);
      toast.success(data.message || 'OTP sent to your email!', { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Verifying...');
    try {
      const data = await fetchWithAuth('/auth/verify-signup', {
        method: 'POST',
        body: JSON.stringify({ token, otp })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.user.id, role: role }));
      toast.success('Account verified! Welcome aboard.', { id: tid });
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 font-sans p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

        <div className="relative text-center">
          <div className="inline-block p-3 bg-blue-500/10 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Task Manager</h2>
          <h3 className="text-gray-400 mt-2 font-medium tracking-wide">
            {showOtp ? 'Check your inbox' : 'Join the elite team'}
          </h3>
        </div>

        {!showOtp ? (
          <form onSubmit={handleRegister} className="space-y-5 relative">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600 text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-1">Account Role</label>
              <div className="relative">
                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer text-gray-100 appearance-none"
                >
                  <option value="Member">Team Member</option>
                  <option value="Admin">Project Admin</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black tracking-widest uppercase text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              Initialize Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 relative">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500 text-center">One-Time Password (OTP)</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-4 w-6 h-6 text-blue-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="000000"
                  className="w-full pl-14 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-800"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black tracking-widest uppercase text-sm transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
            >
              Verify Identity
            </button>
            <p className="text-center text-xs text-gray-500 px-4 leading-relaxed">
              We've sent a 6-digit code to <span className="text-gray-300 font-bold">{email}</span>. It expires in 10 minutes.
            </p>
          </form>
        )}

        <div className="text-center relative pt-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-400">
            Already a member? <a href="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1 underline decoration-blue-500/30 underline-offset-4">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
