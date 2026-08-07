import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Flame, Package, ReceiptText, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function MainLandingPage() {
  const { user } = useOutletContext() || {};

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
      <header className="h-16 bg-[#0f1626]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-5 md:px-8 flex items-center">
        <Navbar showBrand />
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.08),transparent_45%)] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.035] bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%271%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-orange-300 bg-orange-500/10 border border-orange-500/20 mb-6">
                <Flame className="w-3.5 h-3.5" />
                Biryani Junction POS
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
                Run your kitchen from one{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
                  point of sale
                </span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Manage menu items, ring up orders, and track daily sales — built for fast-paced
                biryani counters and busy takeaway teams.
              </p>
              <div className="flex flex-wrap gap-3">
                {user ? (
                  <Link
                    to="/user"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:opacity-95 transition-opacity"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Everything your counter needs
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Products, billing, and live sales — without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6">
              <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Product Management</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add half, full, and family packs. Update prices and keep the menu in sync.
              </p>
            </div>

            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6">
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <ReceiptText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Billing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ring up orders quickly at the counter and save every sale to your company.
              </p>
            </div>

            <div className="bg-[#0f1626] border border-slate-800 rounded-2xl p-6">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                See today&apos;s sales, order counts, and biryani packs sold at a glance.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
          Biryani Junction POS System
        </footer>
      </main>
    </div>
  );
}
