import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Flame, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  Calendar,
  Layers
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`, {
        credentials: 'include',
      });
      const resData = await response.json();
      if (resData.success) {
        setStats(resData.data);
      } else {
        throw new Error(resData.message || 'Failed to load stats');
      }
    } catch (err) {
      console.error('Dashboard API error:', err);
      setStats(null);
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/40 p-5 rounded-2xl border border-edge/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg flex items-center gap-2">
            <Layers className="w-6 h-6 text-accent" />
            Dashboard
          </h1>
          <p className="text-xs text-fg-muted">Review business metrics, daily sales graphs, and recent orders.</p>
        </div>

        <button 
          onClick={fetchStats}
          className="p-2 rounded-lg bg-chip hover:bg-edge-strong text-fg-muted hover:text-fg border border-edge-strong/60 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-danger-fg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-surface border border-edge rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-surface border border-edge rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Row 1: Metrics Playcards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sales Card */}
            <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-fg-muted tracking-wider">Today's Sales</span>
                <span className="p-2 bg-indigo-500/10 text-accent rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-fg">Rs. {(stats?.todaySales ?? 0).toLocaleString()}</div>
            </div>

            {/* Orders Card */}
            <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-fg-muted tracking-wider">Total Orders</span>
                <span className="p-2 bg-violet-500/10 text-accent rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-fg">{stats?.todayOrders ?? 0} Orders</div>
            </div>

            {/* Cash Collected Card */}
            <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-fg-muted tracking-wider">Cash Collected</span>
                <span className="p-2 bg-emerald-500/10 text-success-fg rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-fg">Rs. {(stats?.totalCashCollected ?? 0).toLocaleString()}</div>
              <p className="text-[10px] text-fg-muted mt-2">
                100% payments cleared in cash
              </p>
            </div>

            {/* Total Units Card */}
            <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-lg pointer-events-none" />
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase text-fg-muted tracking-wider">Items Sold</span>
                <span className="p-2 bg-orange-500/10 text-orange-400 rounded-lg">
                  <Flame className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-fg">
                {stats?.itemsSold ?? 0} Units
              </div>
              <p className="text-[10px] text-fg-muted mt-2">
                Total quantity sold today
              </p>
            </div>
          </div>

          {/* Row 2: Weekly Sales Chart */}
          <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-fg tracking-tight flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-accent" />
                    Weekly Sales Analytics
                  </h3>
                  <p className="text-[10px] text-fg-muted">Total transaction values over the past 7 days</p>
                </div>
                <span className="text-xs font-semibold text-accent-soft bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/15">
                  Last 7 Days
                </span>
              </div>

              {/* Chart container */}
              <div className="relative w-full h-[180px] bg-muted/30 rounded-xl border border-slate-850 p-2 overflow-visible">
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
                            <circle cx={x} cy={y} r="4.5" fill="var(--surface)" stroke="#6366f1" strokeWidth="2" />
                            <circle cx={x} cy={y} r="8" fill="#6366f1" opacity="0" className="hover:opacity-20 transition-opacity" />
                            
                            {/* Hover tooltip for individual point */}
                            <foreignObject x={x - 45} y={y - 35} width="90" height="28" className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                              <div className="bg-page/95 border border-edge-strong/80 rounded-md text-[9px] font-bold text-center text-fg py-1 shadow-lg backdrop-blur-sm">
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
              <div className="flex justify-between px-2 text-[9px] text-fg-subtle font-bold tracking-wide uppercase">
                {stats?.weeklySales?.map((d, idx) => (
                  <span key={idx}>{d.date}</span>
                ))}
              </div>
          </div>

          {/* Row 3: Recent Orders Table */}
          <div className="bg-surface border border-edge rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-fg tracking-tight flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-accent" />
                  Today's Recent Orders
                </h3>
                <p className="text-[10px] text-fg-muted">List of last 5 checked-out transactions</p>
              </div>
              <span className="text-xs text-fg-muted">Terminal 1</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-fg-muted">
                <thead className="text-xs uppercase bg-muted/60 text-fg-muted border-b border-slate-850">
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
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-fg">#{order.id}</td>
                        <td className="py-3.5 px-4 text-xs text-fg-muted flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-accent/80" />
                          {order.time}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-fg-muted max-w-xs truncate">{order.items}</td>
                        <td className="py-3.5 px-4 font-bold text-fg text-right">Rs. {order.total.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-success-fg bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-fg-subtle">
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
