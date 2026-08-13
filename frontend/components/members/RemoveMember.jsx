import { useState } from 'react';
import { UserMinus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function RemoveMember() {
  const [form, setForm] = useState({ email: '', role: 'CASHIER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to remove member');
      }

      setSuccess(`Member ${form.email} removed successfully.`);
      setForm({ email: '', role: 'CASHIER' });
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-edge rounded-2xl p-6 md:p-8 shadow-xl space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-fg flex items-center gap-2">
          <UserMinus className="w-5 h-5 text-accent" />
          Remove Member
        </h2>
        <p className="text-xs text-fg-muted mt-1">
          Remove an Owner or Cashier from your company by email and role.
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
        {loading ? 'Removing...' : 'Remove Member'}
      </button>
    </form>
  );
}
