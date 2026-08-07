import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Flame, 
  ArrowRight, 
  Package, 
  ReceiptText, 
  Printer, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';

<<<<<<< HEAD:frontend/pages/LandingPage.jsx
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const FALLBACK_STATS = {
  todaySales: 8750.00,
  todayOrders: 28,
  halfBiryaniCount: 42,
  fullBiryaniCount: 26,
  familyPackCount: 8,
  totalCashCollected: 8750.00,
  isDemoData: true
};

export default function LandingPage() {
=======
export default function UserLandingPage() {
>>>>>>> main:frontend/pages/UserLandingPage.jsx
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(false);

  const fetchStats = useCallback(async (forceDemo = false) => {
    setLoading(true);
    try {
      const url = `${API_BASE}/dashboard/stats${forceDemo ? '?demo=true' : ''}`;
      const response = await fetch(url);
      const resData = await response.json();
      if (resData.success) {
        setStats(resData.data);
        setUseDemo(resData.data.isDemoData);
      } else {
        throw new Error("Failed to load stats");
      }
    } catch (err) {
      console.error("API error, loading fallback mock data:", err);
      setStats(FALLBACK_STATS);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialStats() {
      try {
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        const resData = await response.json();
        if (cancelled) return;
        if (resData.success) {
          setStats(resData.data);
          setUseDemo(resData.data.isDemoData);
        } else {
          throw new Error("Failed to load stats");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("API error, loading fallback mock data:", err);
        setStats(FALLBACK_STATS);
        setUseDemo(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitialStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // Quick module access configuration
  const modules = [
    {
      name: "Product Management",
      desc: "Add or edit menu items, update prices, and configure variants.",
      href: "/products",
      icon: Package,
      color: "from-indigo-600 to-indigo-500",
      accent: "indigo",
      tag: "Module 1",
      assignee: "Kabeer"
    },
    {
      name: "POS Billing Screen",
      desc: "Interactive checkout screen, add to cart, and record sales.",
      href: "/billing",
      icon: ReceiptText,
      color: "from-emerald-600 to-emerald-500",
      accent: "emerald",
      tag: "Module 2",
      assignee: "Areej"
    },
    {
      name: "Receipt Printing",
      desc: "Customize thermal receipt templates and test print triggers.",
      href: "/receipts",
      icon: Printer,
      color: "from-amber-600 to-amber-500",
      accent: "amber",
      tag: "Module 3",
      assignee: "Zuhaib"
    }
  ];

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
            Biryani Junction <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              POS Management Hub
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg mb-6 leading-relaxed">
            Welcome back! Here is a live summary of today's kitchen activity, sales performance, and quick access to all checkout and inventory modules.
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

      {/* Analytics Playcards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Today's Sales Analytics</h2>
            <p className="text-xs text-slate-400">Aggregated live totals from orders placed today</p>
          </div>
          {useDemo && (
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full">
              Demo Mode Active
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#0f1626] border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Today's Sales Card */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-indigo-500/10 hover:border-indigo-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Today's Total Sales</span>
              <span className="text-3xl font-bold text-white">Rs. {stats?.todaySales.toLocaleString()}</span>
            </div>

            {/* Today's Orders Card */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-violet-500/10 hover:border-violet-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8.3%
                </span>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Today's Total Orders</span>
              <span className="text-3xl font-bold text-white">{stats?.todayOrders} Orders</span>
            </div>

            {/* Total Cash Collected Card */}
            <div className="group relative rounded-2xl bg-gradient-to-b from-[#131a30]/80 to-slate-900 border border-emerald-500/10 hover:border-emerald-500/30 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-tr-2xl pointer-events-none" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full">Cash</span>
              </div>
              <span className="text-slate-400 text-xs font-semibold tracking-wider uppercase block mb-1">Total Cash Collected</span>
              <span className="text-3xl font-bold text-white">Rs. {stats?.totalCashCollected.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Biryani Specific Sold Tracker */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Biryani Sales Tracker</h2>
          <p className="text-xs text-slate-400">Live breakdown of today's biryani orders by packaging type</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-[#0f1626] border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Half Biryani Card */}
            <div className="bg-[#0f1626] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-500/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block">Half Biryani</span>
                <span className="text-2xl font-bold text-white block">{stats?.halfBiryaniCount} Sold</span>
                <span className="text-[10px] text-slate-400 font-medium">Single Serving Box</span>
              </div>
              <div className="p-4 bg-orange-500/5 text-orange-400 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-7 h-7" />
              </div>
            </div>

            {/* Full Biryani Card */}
            <div className="bg-[#0f1626] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-500/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block">Full Biryani</span>
                <span className="text-2xl font-bold text-white block">{stats?.fullBiryaniCount} Sold</span>
                <span className="text-[10px] text-slate-400 font-medium">Double Serving Box</span>
              </div>
              <div className="p-4 bg-orange-500/10 text-orange-500 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-7 h-7" />
              </div>
            </div>

            {/* Family Pack Card */}
            <div className="bg-[#0f1626] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between group hover:border-indigo-500/20 transition-all duration-300">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 block">Family Pack</span>
                <span className="text-2xl font-bold text-white block">{stats?.familyPackCount} Sold</span>
                <span className="text-[10px] text-slate-400 font-medium">4+ Serving Tray</span>
              </div>
              <div className="p-4 bg-red-500/15 text-red-500 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Flame className="w-7 h-7 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Access Tabs Grid */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">POS Operation Modules</h2>
          <p className="text-xs text-slate-400">Launch other system modules to process sales or modify inventory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link 
              key={mod.name} 
              to={mod.href} 
              className="group relative flex flex-col bg-[#0f1626] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl transition-all duration-350 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
            >
              {/* Colored backdrop gradient */}
              <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-tr ${mod.color} opacity-[0.02] group-hover:opacity-[0.06] rounded-full blur-xl transition-all duration-350`} />

              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-slate-800 group-hover:bg-slate-700/60 rounded-xl border border-slate-700/50 group-hover:border-slate-600/50 text-slate-300 transition-colors`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/15">
                  {mod.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                {mod.name}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-6">
                {mod.desc}
              </p>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200">
                <span>Assignee: <span className="text-indigo-400">{mod.assignee}</span></span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Module
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
