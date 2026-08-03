import React from 'react'
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
import { NavLink } from 'react-router-dom';

const navigation = [
    { name: 'Landing Page', href: '/', icon: ChefHat },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Billing', href: '/billing', icon: ReceiptText },
    { name: 'Receipts', href: '/receipts', icon: Printer },
];

const UserNavbarDesktop = () => {
    return (
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
    )
}

export default UserNavbarDesktop