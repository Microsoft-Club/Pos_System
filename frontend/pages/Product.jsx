import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, Plus, RefreshCw } from 'lucide-react';
import ItemCard from '../components/ItemCard.jsx';

const API_BASE = import.meta.env.VITE_API_URL;
const emptyForm = { name: '', price: '', type: '' };

export default function Product() {
  const { user } = useOutletContext() || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/items`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load items');
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      try {
        const res = await fetch(`${API_BASE}/items`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (cancelled) return;
        if (!data.success) throw new Error(data.message || 'Failed to load items');
        setItems(data.data || []);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(err.message || 'Failed to load items');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItems();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.type) {
      setError('Please fill in name, price, and type.');
      return;
    }

    if (!user?.company_id) {
      setError('Company ID not available from user context yet.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          type: form.type,
          company_id: user.company_id,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to add item');

      setItems((prev) => [...prev, data.data]);
      setForm(emptyForm);
      setShowForm(false);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, updates) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to update item');

      setItems((prev) => prev.map((item) => (item.id === id ? data.data : item)));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update item');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to delete item');

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete item');
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if(e.ctrlKey && e.key.toLowerCase() === 'i'){
        setShowForm((v) => !v);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/40 p-5 rounded-2xl border border-edge/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg flex items-center gap-2">
            <Package className="w-6 h-6 text-accent" />
            Product Management
          </h1>
          <p className="text-xs text-fg-muted">
            Add, edit, and remove menu items for your company.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchItems}
            className="p-2 rounded-lg bg-chip hover:bg-edge-strong text-fg-muted hover:text-fg border border-edge-strong/60 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Close' : 'Add Item'}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-danger-fg text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-surface border border-edge rounded-2xl p-6 shadow-xl space-y-4"
        >
          <h2 className="text-base font-bold text-fg">New Menu Item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Menu Item Name"
                className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
                Price (Rs.)
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="320.00"
                className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-fg-muted font-semibold mb-1">
                Type
              </label>
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Food, Drink"
                className="w-full bg-muted/60 border border-edge-strong rounded-lg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-success-fg text-sm font-semibold hover:bg-emerald-500/25 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Save Item'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-36 bg-surface border border-edge rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-edge rounded-2xl">
          <Package className="w-12 h-12 text-fg-subtle mb-3" />
          <p className="text-fg-muted text-sm">No items yet. Add your first menu item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
