import { 
  LayoutDashboard, 
  Package, 
  ReceiptText, 
  Printer, 
  X, 
  ChefHat,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
    { name: 'Landing Page', href: '/user', icon: ChefHat },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Billing', href: '/billing', icon: ReceiptText },
    { name: 'Receipts', href: '/receipts', icon: Printer },
];

const UserNavbarMobile = ({sidebarOpen, setSidebarOpen}) => {
    return (
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
                end={item.href === '/'}
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
    )
}

export default UserNavbarMobile
