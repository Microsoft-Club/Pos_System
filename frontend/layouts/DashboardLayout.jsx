import { useState } from 'react';
import { Menu, User, Activity } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import UserNavbarDesktop from '../components/UserNavbarDesktop';
import UserNavbarMobile from '../components/UserNavbarMobile';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <Outlet />
            </main>
        </div>
        </div>
    )
}

export default DashboardLayout
