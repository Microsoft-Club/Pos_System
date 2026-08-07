import { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Flame, 
  ArrowRight, 
  RefreshCw,
  Building2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function UserLandingPage() {
  const { user, setUser } = useOutletContext() || {};
  const hasCompany = Boolean(user?.company_id);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [companyForm, setCompanyForm] = useState({ name: '', email: '', logo: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchStats = useCallback(async () => {
    if (!hasCompany) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`, { credentials: 'include' });
      const resData = await response.json();
      if (resData.success) {
        setStats(resData.data);
      } else {
        throw new Error(resData.message || 'Failed to load stats');
      }
    } catch (err) {
      console.error('API error:', err);
      setStats(null);
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [hasCompany]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const res = await fetch(`${API_BASE}/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(companyForm),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create company');
      }

      setUser?.(data.data.user);
      setCompanyForm({ name: '', email: '', logo: '' });
    } catch (err) {
      setCreateError(err.message || 'Failed to create company');
    } finally {
      setCreating(false);
    }
  };

  if (!hasCompany) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-400" />
              Create Your Company
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              You need a company before using the POS. You will become the Master Admin.
            </p>
          </div>

          {createError && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Company Name
              </label>
              <input
                name="name"
                value={companyForm.name}
                onChange={handleCompanyChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="My Company"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Company Email
              </label>
              <input
                type="email"
                name="email"
                value={companyForm.email}
                onChange={handleCompanyChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="shop@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Logo URL
              </label>
              <input
                name="logo"
                value={companyForm.logo}
                onChange={handleCompanyChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Company'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#131a30] to-slate-900 border border-slate-800/80 p-8 md:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-4 animate-bounce">
            <Flame className="w-3.5 h-3.5" />
            POS Terminal Active
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            Welcome, {user?.name} <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              POS Management Hub
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed">
            Here is a live summary of today&apos;s sales activity and quick access to all modules.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:translate-x-1"
            >
              Open Full Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => fetchStats()} 
              className="px-4 py-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Analytics
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Analytics Playcards */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Today&apos;s Sales Analytics</h2>
          <p className="text-xs text-slate-400">Aggregated live totals from orders placed today</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#0f1626] border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-indigo-500/10 hover:border-indigo-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Today&apos;s Total Sales</span>
              <span className="text-3xl font-bold text-white">Rs. {(stats?.todaySales ?? 0).toLocaleString()}</span>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-violet-500/10 hover:border-violet-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Today&apos;s Total Orders</span>
              <span className="text-3xl font-bold text-white">{stats?.todayOrders ?? 0} Orders</span>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-emerald-500/10 hover:border-emerald-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full">Cash</span>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Total Cash Collected</span>
              <span className="text-3xl font-bold text-white">Rs. {(stats?.totalCashCollected ?? 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
