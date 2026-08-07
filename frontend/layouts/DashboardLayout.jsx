import { useState } from 'react';
import { Menu, User, Activity } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { 
  Menu, 
  Activity
} from 'lucide-react';
import UserNavbarDesktop from '../components/UserNavbarDesktop';
import UserNavbarMobile from '../components/UserNavbarMobile';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const outletContext = useOutletContext();

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex">
        {/* Sidebar for Desktop */}
        <UserNavbarDesktop />

        {/* Sidebar Mobile Overlay */}
        {sidebarOpen && (
            <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar for Mobile */}
        <UserNavbarMobile setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>

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

            <Navbar user={outletContext.user} setUser={outletContext.setUser}/>
            </header>

            {/* Content Body */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <Outlet context={outletContext} />
            </main>
        </div>
        </div>
    )
}

export default DashboardLayout
