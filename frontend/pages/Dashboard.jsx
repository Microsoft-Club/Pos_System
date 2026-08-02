import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Flame, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  Database,
  Info,
  Calendar,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const fetchStats = async (forceDemo = false) => {
    setLoading(true);
    setError(false);
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/dashboard/stats${forceDemo ? '?demo=true' : ''}`;
      const response = await fetch(url);
      const resData = await response.json();
      if (resData.success) {
        setStats(resData.data);
        setDemoMode(resData.data.isDemoData);
      } else {
        throw new Error("Failed to load stats");
      }
    } catch (err) {
      console.error("Dashboard API error, loading mock fallback:", err);
      // Fallback local mock data so the dashboard still looks premium
      const mockData = generateMockStats();
      setStats(mockData);
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const generateMockStats = () => {
    const weeklySales = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayOfWeek = d.getDay();
      const baseSales = (dayOfWeek === 0 || dayOfWeek === 6) ? 14000 : 8500;
      const randomFactor = Math.floor(Math.random() * 4000) - 2000;
      const sales = baseSales + randomFactor;
      weeklySales.push({
        date: dateStr,
        sales: parseFloat(sales.toFixed(2)),
        orders: Math.floor(sales / 350) + 1
      });
    }

    return {
      todaySales: 9480.00,
      todayOrders: 31,
      halfBiryaniCount: 48,
      fullBiryaniCount: 29,
      familyPackCount: 9,
      totalCashCollected: 9480.00,
      weeklySales: weeklySales,
      recentOrders: [
        { id: 1045, time: "12:45 PM", items: "2x Full Chicken Biryani, 1x Coke 1.5L", total: 1190.00, status: "Completed" },
        { id: 1044, time: "12:30 PM", items: "1x Half Beef Biryani, 1x Raita", total: 430.00, status: "Completed" },
        { id: 1043, time: "12:15 PM", items: "1x Family Pack Biryani, 1x Coke 1.5L", total: 1600.00, status: "Completed" },
        { id: 1042, time: "11:50 AM", items: "3x Half Chicken Biryani", total: 960.00, status: "Completed" },
        { id: 1041, time: "11:30 AM", items: "1x Full Chicken Biryani, 1x Salad", total: 570.00, status: "Completed" }
      ],
      isDemoData: true
    };
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleMode = () => {
    const targetDemo = !demoMode;
    setDemoMode(targetDemo);
    fetchStats(targetDemo);
  };

  // Helper values for drawing SVG chart
  const getWeeklyMaxSales = () => {
    if (!stats || !stats.weeklySales || stats.weeklySales.length === 0) return 10000;
    return Math.max(...stats.weeklySales.map(d => d.sales)) * 1.15; // padding
  };

  const drawWeeklyAreaPath = () => {
    if (!stats || !stats.weeklySales || stats.weeklySales.length === 0) return '';
    const maxSales = getWeeklyMaxSales();
    const width = 500;
    const height = 150;
    const points = stats.weeklySales.map((d, index) => {
      const x = (index / (stats.weeklySales.length - 1)) * (width - 40) + 20;
      const y = height - (d.sales / maxSales) * (height - 30) - 15;
      return `${x},${y}`;
    });

    return `M ${points[0]} ${points.slice(1).map(p => `L ${p}`).join(' ')}`;
  };

  const drawWeeklyAreaFillPath = () => {
    if (!stats || !stats.weeklySales || stats.weeklySales.length === 0) return '';
    const maxSales = getWeeklyMaxSales();
    const width = 500;
    const height = 150;
    const points = stats.weeklySales.map((d, index) => {
      const x = (index / (stats.weeklySales.length - 1)) * (width - 40) + 20;
      const y = height - (d.sales / maxSales) * (height - 30) - 15;
      return `${x},${y}`;
    });

    const startX = 20;
    const endX = (stats.weeklySales.length - 1) / (stats.weeklySales.length - 1) * (width - 40) + 20;
    const bottomY = height - 15;

    return `M ${startX},${bottomY} L ${points[0]} ${points.slice(1).map(p => `L ${p}`).join(' ')} L ${endX},${bottomY} Z`;
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            Module 4: Dashboard
          </h1>
          <p className="text-xs text-slate-400">Review business metrics, daily sales graphs, and biryani inventory tracking.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Database Sync Status Indicators */}
          <button
            onClick={handleToggleMode}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm
              ${demoMode 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/25' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'}`}
          >
            <Database className="w-3.5 h-3.5" />
            {demoMode ? 'Using Mock Demo Data' : 'Synced with PostgreSQL'}
            <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300 ml-1">
              Toggle Mode
            </span>
          </button>

          <button 
            onClick={() => fetchStats(demoMode)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#0f1626] border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-[#0f1626] border border-slate-800 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Row 1: Metrics Playcards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sales Card */}
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Today's Sales</span>
                <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">Rs. {stats?.todaySales.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">+14.2%</span> since yesterday
              </p>
            </div>

            {/* Orders Card */}
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Orders</span>
                <span className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">{stats?.todayOrders} Orders</div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">+6.5%</span> ticket count
              </p>
            </div>

            {/* Cash Collected Card */}
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Cash Collected</span>
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">Rs. {stats?.totalCashCollected.toLocaleString()}</div>
              <p className="text-[10px] text-slate-400 mt-2">
                100% payments cleared in cash
              </p>
            </div>

            {/* Total Biryani Units Card */}
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Biryani Servings</span>
                <span className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
                  <Flame className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white">
                {(stats ? stats.halfBiryaniCount + stats.fullBiryaniCount + stats.familyPackCount : 0)} Units
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Half: {stats?.halfBiryaniCount} | Full: {stats?.fullBiryaniCount} | Family: {stats?.familyPackCount}
              </p>
            </div>
          </div>

          {/* Row 2: Graph & Biryani Counts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Trend Custom SVG Area Chart */}
            <div className="lg:col-span-2 bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                    Weekly Sales Analytics
                  </h3>
                  <p className="text-[10px] text-slate-400">Total transaction values over the past 7 days</p>
                </div>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15">
                  Last 7 Days
                </span>
              </div>

              {/* Chart container */}
              <div className="relative w-full h-[180px] bg-slate-900/30 rounded-xl border border-slate-850 p-2 overflow-visible">
                <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {/* Y-axis grid lines */}
                  <line x1="20" y1="15" x2="480" y2="15" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="20" y1="52" x2="480" y2="52" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="20" y1="90" x2="480" y2="90" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="20" y1="135" x2="480" y2="135" stroke="#334155" strokeWidth="0.8" />

                  {/* Graph Paths */}
                  {stats?.weeklySales?.length > 0 && (
                    <>
                      {/* Area Fill */}
                      <path d={drawWeeklyAreaFillPath()} fill="url(#areaGrad)" />
                      {/* Stroke Line */}
                      <path d={drawWeeklyAreaPath()} fill="none" stroke="url(#strokeGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Interactive Point dots */}
                      {stats.weeklySales.map((d, index) => {
                        const maxSales = getWeeklyMaxSales();
                        const x = (index / (stats.weeklySales.length - 1)) * 460 + 20;
                        const y = 150 - (d.sales / maxSales) * 120 - 15;
                        return (
                          <g key={index} className="group/dot cursor-pointer">
                            <circle cx={x} cy={y} r="4.5" fill="#0f1626" stroke="#6366f1" strokeWidth="2" />
                            <circle cx={x} cy={y} r="8" fill="#6366f1" opacity="0" className="hover:opacity-20 transition-opacity" />
                            
                            {/* Hover tooltip for individual point */}
                            <foreignObject x={x - 45} y={y - 35} width="90" height="28" className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                              <div className="bg-slate-950/95 border border-slate-700/80 rounded-md text-[9px] font-bold text-center text-white py-1 shadow-lg backdrop-blur-sm">
                                Rs. {d.sales.toFixed(0)}
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })}
                    </>
                  )}
                </svg>
              </div>

              {/* X axis labels */}
              <div className="flex justify-between px-2 text-[9px] text-slate-500 font-bold tracking-wide uppercase">
                {stats?.weeklySales?.map((d, idx) => (
                  <span key={idx}>{d.date}</span>
                ))}
              </div>
            </div>

            {/* Biryani tracker visualizer */}
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4.5 h-4.5 text-orange-400" />
                  Biryani Packing Types
                </h3>
                <p className="text-[10px] text-slate-400">Total units sold today by packaging size</p>
              </div>

              {/* Progress visualizer */}
              <div className="space-y-4 py-4">
                {/* Half Biryani */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Half Biryani Box</span>
                    <span className="text-orange-400">{stats?.halfBiryaniCount} Sold</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (stats?.halfBiryaniCount / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Full Biryani */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Full Biryani Box</span>
                    <span className="text-orange-500">{stats?.fullBiryaniCount} Sold</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-600 to-red-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (stats?.fullBiryaniCount / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Family Pack */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Family Pack Tray</span>
                    <span className="text-red-500">{stats?.familyPackCount} Sold</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (stats?.familyPackCount / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-850 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Sizes help monitor packaging inventory (boxes/trays) in the kitchen.</span>
              </div>
            </div>
          </div>

          {/* Row 3: Recent Orders Table */}
          <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-indigo-400" />
                  Today's Recent Orders
                </h3>
                <p className="text-[10px] text-slate-400">List of last 5 checked-out transactions</p>
              </div>
              <span className="text-xs text-slate-400">Terminal 1</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/60 text-slate-400 border-b border-slate-850">
                  <tr>
                    <th className="py-3 px-4 font-bold">Order ID</th>
                    <th className="py-3 px-4 font-bold">Timestamp</th>
                    <th className="py-3 px-4 font-bold">Cart Items</th>
                    <th className="py-3 px-4 font-bold text-right">Total Bill</th>
                    <th className="py-3 px-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {stats?.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">#{order.id}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-400/80" />
                          {order.time}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-300 max-w-xs truncate">{order.items}</td>
                        <td className="py-3.5 px-4 font-bold text-white text-right">Rs. {order.total.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-500">
                        No orders recorded today. Go to the Billing Screen to create some sales!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
