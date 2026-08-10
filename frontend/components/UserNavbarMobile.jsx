import { 
  X, 
  ChefHat,
  Lock,
} from 'lucide-react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { getNavItemsForUser } from '../utils/roles.js';

const UserNavbarMobile = ({sidebarOpen, setSidebarOpen}) => {
    const { user } = useOutletContext() || {};
    const navigation = getNavItemsForUser(user);
    const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-edge flex flex-col transition-transform duration-300 lg:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-16 flex items-center justify-between px-6 border-b border-edge">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <ChefHat className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-fg">POS System</span>
            </div>
            <button 
                className="p-1 text-fg-muted hover:text-fg rounded-lg hover:bg-chip"
                onClick={() => setSidebarOpen(false)}
            >
                <X className="w-6 h-6" />
            </button>
            </div>

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
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                            ${isActive 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-fg-muted hover:bg-chip/50 hover:text-fg'}
                        `}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {item.name}
                    </NavLink>
                )
            ))}
            </nav>

            <div className="p-4 border-t border-edge">
            <div className="flex items-center gap-3 p-3 bg-chip/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {initial}
                </div>
                <div>
                <span className="block text-sm font-semibold text-fg">{user?.name || 'User'}</span>
                <span className="block text-xs text-fg-muted">
                    {user?.company_id ? (user.company_role || '').replace('_', ' ') : 'No company'}
                </span>
                </div>
            </div>
            </div>
        </aside>
    )
}

export default UserNavbarMobile
