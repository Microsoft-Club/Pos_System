import React from 'react';
import { Package, ReceiptText, Printer } from 'lucide-react';

export const ProductManagement = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-6 border border-indigo-500/20">
        <Package className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Module 1: Product Management</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Manage your product catalog, add new items, update prices, and edit menu options here. Currently assigned to Kabeer (Backend).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-indigo-400 font-semibold mb-1">View Menu Items</div>
          <p className="text-xs text-slate-400">List and search existing POS inventory and status.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-indigo-400 font-semibold mb-1">Add/Edit/Delete</div>
          <p className="text-xs text-slate-400">Keep inventory and item properties in sync.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-indigo-400 font-semibold mb-1">Update Prices</div>
          <p className="text-xs text-slate-400">Quick batch edits to adjust menu item pricing.</p>
        </div>
      </div>
    </div>
  );
};

export const BillingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-6 border border-emerald-500/20">
        <ReceiptText className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Module 2: POS Billing Screen</h1>
      <p className="text-slate-400 max-w-md mb-8">
        The main point of sale view for cashier billing, ordering, and cart calculation. Currently assigned to Areej (Frontend & Backend).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-emerald-400 font-semibold mb-1">Display Menu</div>
          <p className="text-xs text-slate-400">Browse categories and select item sizes/types.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-emerald-400 font-semibold mb-1">Cart Checkout</div>
          <p className="text-xs text-slate-400">Calculate tax, subtotal, discount, and total price.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-emerald-400 font-semibold mb-1">Store Sales</div>
          <p className="text-xs text-slate-400">Sync completed orders directly to the PG database.</p>
        </div>
      </div>
    </div>
  );
};

export const ReceiptPrinting = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full mb-6 border border-amber-500/20">
        <Printer className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Module 3: Receipt Printing</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Generate professional receipt print layouts and control physical thermal printing hardware.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-amber-400 font-semibold mb-1">Sleek Bill Layout</div>
          <p className="text-xs text-slate-400">Clean typography, order list, date/time, and shop logo.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-amber-400 font-semibold mb-1">Thermal Integration</div>
          <p className="text-xs text-slate-400">Driver connection for 58mm/80mm receipt printers.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-left">
          <div className="text-amber-400 font-semibold mb-1">Auto Print</div>
          <p className="text-xs text-slate-400">Trigger printer automatically on billing checkout.</p>
        </div>
      </div>
    </div>
  );
};
