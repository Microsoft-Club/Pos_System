import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ReceiptText, 
  Printer, 
  Menu, 
  X, 
  ChefHat,
  User,
  Activity
} from 'lucide-react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Landing Page', href: '/', icon: ChefHat },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Billing', href: '/billing', icon: ReceiptText },
    { name: 'Receipts', href: '/receipts', icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f1626] border-r border-slate-800/80 shrink-0">
        {/* Brand logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
              POS System
            </span>
            <span className="block text-[10px] text-indigo-400 font-medium tracking-wider uppercase">
              Biryani Junction
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-600/10' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/20">
          <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              S
            </div>
            <div className="overflow-hidden">
              <span className="block text-sm font-semibold text-white truncate">Saadia</span>
              <span className="block text-xs text-indigo-400 font-medium truncate">Owner / Dashboard</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1626] border-r border-slate-800 flex flex-col transition-transform duration-300 lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">POS System</span>
          </div>
          <button 
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <span className="block text-sm font-semibold text-white">Saadia</span>
              <span className="block text-xs text-slate-400">Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#0f1626]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              className="p-2 -ml-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Live Server Connected
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-400">Current Session</div>
              <div className="text-xs font-medium text-indigo-300">Active - POS Terminal 1</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Saadia Dashboard</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
