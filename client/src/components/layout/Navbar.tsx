import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useSmoothScroll } from './SmoothScrollProvider';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { scrollTo } = useSmoothScroll();
  const shouldReduceMotion = useReducedMotion();

  const handleNavAnchor = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(target, { offset: -70 });
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return user.role === 'PHARMACY' ? '/pharmacy/dashboard' : '/customer/dashboard';
  };

  return (
    <header className="sticky top-4 z-50 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="h-14 bg-surface-card/90 backdrop-blur-md rounded-xl px-5 border border-border-soft shadow-subtle flex items-center justify-between">
        {/* Brand logo + name */}
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.img
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              src="/logo.png"
              alt="PharmaPath"
              className="w-8 h-8 rounded-lg object-contain transition-transform"
            />
            <span className="font-display text-[17px] tracking-tight text-slate-charcoal font-bold">
              PharmaPath
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-charcoal hover:bg-surface-muted transition-colors"
            to="/search"
          >
            Find Medicine
          </Link>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors cursor-pointer"
            href="#how-it-works"
            onClick={(e) => handleNavAnchor(e, '#how-it-works')}
          >
            How It Works
          </a>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors cursor-pointer"
            href="#pharmacy-partner"
            onClick={(e) => handleNavAnchor(e, '#pharmacy-partner')}
          >
            For Pharmacies
          </a>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors cursor-pointer"
            href="#features"
            onClick={(e) => handleNavAnchor(e, '#features')}
          >
            Features
          </a>
        </nav>

        {/* CTA Buttons or User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-soft hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#005c55] text-white flex items-center justify-center font-bold text-[10px]">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </motion.button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl border border-border-soft shadow-lg p-1.5 space-y-1 z-50 text-xs"
                  >
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#005c55]" />
                      <span>My Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal transition-colors cursor-pointer"
                to="/login"
              >
                Log In
              </Link>
              <Link
                className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all cursor-pointer"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <motion.button
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              type: shouldReduceMotion ? 'tween' : 'spring',
              stiffness: 400,
              damping: 30,
              duration: 0.2,
            }}
            className="md:hidden mt-2 bg-surface-card rounded-xl p-4 border border-border-soft shadow-panel space-y-2 origin-top"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[14px] font-medium text-slate-charcoal hover:text-primary py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors"
            >
              Find Medicine
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavAnchor(e, '#how-it-works')}
              className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#pharmacy-partner"
              onClick={(e) => handleNavAnchor(e, '#pharmacy-partner')}
              className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            >
              For Pharmacies
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavAnchor(e, '#features')}
              className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer"
            >
              Features
            </a>
            <div className="pt-2 border-t border-border-soft flex gap-2">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center text-[13px] font-semibold text-white py-2 rounded-lg bg-primary hover:bg-primary-hover transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-[13px] font-medium text-slate-charcoal py-2 rounded-lg border border-border-soft hover:bg-surface-muted transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-[13px] font-semibold text-white py-2 rounded-lg bg-primary hover:bg-primary-hover transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
