import { useEffect, useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import AnalyticsPDFLayout from './AnalyticsPDFLayout';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const PERIODS = ['daily', 'monthly', 'yearly', 'all'];

export default function ViewAnalytics() {
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError('');

      try {
        // Backend route: GET /company/analytics/:timeline — period also required as query
        const res = await fetch(
          `${API_BASE}/company/analytics/${period}?period=${period}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || data.status !== 'success') {
          throw new Error(data.message || 'Failed to load analytics');
        }

        setAnalytics(data.data.analytics);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [period]);

  const downloadAnalyticsAsPDF = async () => {
    const blob = await pdf(<AnalyticsPDFLayout analytics={analytics}/>)?.toBlob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `analytics.pdf`;
    a.click();
  }

  return (
    <div className="bg-surface border border-edge rounded-2xl p-6 md:p-8 shadow-xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-fg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-accent" />
          View Analytics
        </h2>
        <p className="text-xs text-fg-muted mt-1">
          Member analytics for the selected period.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={
              'rounded-lg px-3 py-1 text-xs font-medium cursor-pointer shrink-0 capitalize ' +
              (period === p
                ? 'bg-indigo-600 text-white'
                : 'bg-chip text-fg-muted hover:bg-hover hover:text-fg')
            }
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-danger-fg text-sm">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-xs text-fg-muted">Loading analytics…</p>
      )}

      <button
        type="button"
        disabled={loading}
        onClick={downloadAnalyticsAsPDF}
        className="disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-95"
      >
        <Download className="w-4 h-4" />
        {loading ? 'Fetching analytics' : 'Download as PDF'}
      </button>
    </div>
  );
}
