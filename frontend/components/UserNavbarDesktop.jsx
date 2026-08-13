import {
  ChefHat,
  Lock,
} from 'lucide-react';
import { NavLink, useNavigate, useOutletContext } from 'react-router-dom';
import { getNavItemsForUser } from '../utils/roles.js';
import { useEffect } from 'react';

const UserNavbarDesktop = () => {
    const { user } = useOutletContext() || {};
    const navigation = getNavItemsForUser(user);
    const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = e => {
            if(e.ctrlKey && e.key.toLowerCase() === 'm'){
                e.preventDefault();
                navigate("/manage-member");
            }

            if(e.ctrlKey && e.key.toLowerCase() === 'd'){
                e.preventDefault();
                navigate("/dashboard");
            }

            if(e.ctrlKey && e.key.toLowerCase() === 'p'){
                e.preventDefault();
                navigate("/products");
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-edge/80 shrink-0">
            {/* Brand logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-edge/80 bg-muted/40">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                <ChefHat className="w-5 h-5" />
            </div>
            <div>
                <span className="font-bold text-lg bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
                POS System
                </span>
                <span className="block text-[10px] text-accent font-medium tracking-wider uppercase">
                Your Business
                </span>
            </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => (
                item.locked ? (
                    <div
                        key={item.name}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-fg-subtle cursor-not-allowed opacity-60"
                        title="Create a company to unlock"
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span className="flex-1">{item.name}</span>
                        <Lock className="w-3.5 h-3.5" />
                    </div>
                ) : (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.href === '/user'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group
                            ${isActive 
                            ? 'bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-600/10' 
                            : 'text-fg-muted hover:bg-chip/50 hover:text-fg'}
                        `}
                    >
                        <item.icon className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" />
                        {item.name}
                    </NavLink>
                )
            ))}
            </nav>

            {/* User Card */}
            <div className="p-4 border-t border-edge/80 bg-muted/20">
            <div className="flex items-center gap-3 p-3 bg-chip/40 rounded-xl border border-edge-strong/30">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {initial}
                </div>
                <div className="overflow-hidden">
                <span className="block text-sm font-semibold text-fg truncate">{user?.name || 'User'}</span>
                <span className="block text-xs text-accent font-medium truncate">
                    {user?.company_id ? (user.company_role || '').replace('_', ' ') : 'No company'}
                </span>
                </div>
            </div>
            </div>
        </aside>
    )
}

export default UserNavbarDesktop
