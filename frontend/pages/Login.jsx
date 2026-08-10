import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { getHomePathForUser } from '../utils/roles.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Login() {
  const { user, setUser } = useOutletContext() || {};
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      setUser?.(data.data);
      navigate(getHomePathForUser(data.data));
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate(getHomePathForUser(user));
  }, []);

  return (
    <div className="min-h-screen bg-page text-fg font-sans">
      <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-edge/80 sticky top-0 z-30 px-5 md:px-8 flex items-center">
        <Navbar showBrand user={user} setUser={setUser}/>
      </header>

      <main className="flex items-center justify-center px-4 py-12 md:py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-surface border border-edge rounded-2xl p-6 md:p-8 shadow-xl space-y-5"
        >
          <div>
            <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
              <LogIn className="w-6 h-6 text-accent" />
              Login
            </h1>
            <p className="text-xs text-fg-muted mt-1">Sign in to access your POS dashboard.</p>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-danger-fg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2.5 pr-10 text-sm text-fg focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-center text-xs text-fg-muted">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-accent hover:text-accent-soft font-semibold">
              Signup
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
