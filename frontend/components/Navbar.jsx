import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, UserPlus, Menu, X, ChefHat, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Navbar = ({ showBrand = false, user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center p-2 rounded-lg text-fg-muted hover:text-fg bg-chip/60 border border-edge hover:bg-hover transition-colors"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );

  const authLinks = user ? (
    <>
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-fg-muted">{user.name}</span>
      </div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-danger-fg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-colors"
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-fg bg-chip border border-edge-strong hover:bg-hover transition-colors"
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
            <span className="font-bold text-lg bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              POS System
            </span>
            <span className="block text-[10px] text-accent font-medium tracking-wider uppercase">
              Your Business
              </span>
          </div>
        </Link>
      )}

      {/* Desktop auth */}
      <div className="hidden sm:flex items-center gap-3">
        {themeToggle}
        {user && !showBrand && (
          <>
            <div className="text-right">
              <div className="text-xs text-fg-muted">Current Session</div>
              <div className="text-xs font-medium text-accent-soft">Active - POS Terminal 1</div>
            </div>
            <div className="h-8 w-[1px] bg-edge" />
          </>
        )}
        {authLinks}
      </div>

      {/* Mobile: theme + hamburger */}
      <div className="flex sm:hidden items-center gap-1">
        {themeToggle}
        <button
          type="button"
          className="p-2 text-fg-muted hover:text-fg rounded-lg hover:bg-hover"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-edge-strong bg-surface shadow-xl p-3 flex flex-col gap-2 sm:hidden">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-fg-muted">
                <User className="w-4 h-4 text-accent" />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-danger-fg bg-red-500/10 border border-red-500/25"
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-fg bg-chip border border-edge-strong"
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
