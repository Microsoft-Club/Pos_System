import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const ROLES = ['OWNER', 'MASTER_ADMIN', 'CASHIER'];

export default function Signup() {
  const { user, setUser } = useOutletContext() || {};
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'OWNER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Signup failed');
      }

      setUser?.(data.data);
      navigate('/user');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) navigate("/user");
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
      <header className="h-16 bg-[#0f1626]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-5 md:px-8 flex items-center">
        <Navbar showBrand user={user} setUser={setUser}/>
      </header>

      <main className="flex items-center justify-center px-4 py-12 md:py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#0f1626] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-indigo-400" />
              Signup
            </h1>
            <p className="text-xs text-slate-400 mt-1">Create an account to start using the POS.</p>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
