import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { User, LogOut, LogIn, UserPlus, Menu, X, ChefHat } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Navbar = ({ showBrand = false, user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Cookie clear may fail if logout route is unavailable; clear local state anyway
    } finally {
      setUser?.(null);
      setMenuOpen(false);
      navigate('/');
    }
  };

  const authLinks = user ? (
    <>
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium text-slate-300">{user.name}</span>
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        onClick={() => setMenuOpen(false)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        <LogIn className="w-3.5 h-3.5" />
        Login
      </Link>
      <Link
        to="/signup"
        onClick={() => setMenuOpen(false)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 transition-opacity"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Signup
      </Link>
    </>
  );

  return (
    <nav className={`relative flex items-center ${showBrand ? 'w-full justify-between' : 'gap-4'}`}>
      {showBrand && (
        <Link to="/" className="flex items-center gap-2.5">
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
        </Link>
      )}

      {/* Desktop auth */}
      <div className="hidden sm:flex items-center gap-3">
        {user && !showBrand && (
          <>
            <div className="text-right">
              <div className="text-xs text-slate-400">Current Session</div>
              <div className="text-xs font-medium text-indigo-300">Active - POS Terminal 1</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800" />
          </>
        )}
        {authLinks}
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="sm:hidden p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-slate-700 bg-[#0f1626] shadow-xl p-3 flex flex-col gap-2 sm:hidden">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-300">
                <User className="w-4 h-4 text-indigo-400" />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/25"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
