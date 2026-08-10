import { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { getHomePathForUser } from '../utils/roles.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function AddMember() {
  const { user } = useOutletContext() || {};
  const [form, setForm] = useState({ email: '', role: 'CASHIER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (user?.company_role !== 'MASTER_ADMIN') {
    return <Navigate to={getHomePathForUser(user)} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/company/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add member');
      }

      setSuccess(`${data.data.name} added as ${data.data.company_role}.`);
      setForm({ email: '', role: 'CASHIER' });
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-edge rounded-2xl p-6 md:p-8 shadow-xl space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-accent" />
            Add Member
          </h1>
          <p className="text-xs text-fg-muted mt-1">
            Invite an existing user to your company as Owner or Cashier.
          </p>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-danger-fg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-success-fg text-sm">
            {success}
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
            User Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none focus:border-indigo-500"
            placeholder="member@example.com"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2.5 text-sm text-fg focus:outline-none focus:border-indigo-500"
          >
            <option value="OWNER">OWNER</option>
            <option value="CASHIER">CASHIER</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:opacity-95 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>
    </div>
  );
}
