import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

const ITEM_TYPES = ['HALF', 'FULL', 'FAMILY'];

export default function ItemCard({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: item.name,
    price: item.price,
    type: item.type,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setForm({ name: item.name, price: item.price, type: item.type });
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.type) return;
    setSaving(true);
    try {
      await onUpdate(item.id, {
        name: form.name.trim(),
        price: parseFloat(form.price),
        type: form.type,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await onDelete(item.id);
  };

  return (
    <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-indigo-500/30 transition-all duration-300 flex flex-col gap-4">
      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Price
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {ITEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate">{item.name}</h3>
              <p className="text-lg font-extrabold text-indigo-300 mt-1">
                Rs. {Number(item.price).toLocaleString()}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-lg">
              {item.type}
            </span>
          </div>

          <div className="flex gap-2 mt-auto pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold hover:bg-red-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
