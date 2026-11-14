import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 px-4 md:px-8 max-w-6xl mx-auto w-full">
      <div className="h-14 bg-surface-card/90 backdrop-blur-md rounded-xl px-5 border border-border-soft shadow-subtle flex items-center justify-between">
        {/* Brand logo + name */}
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="PharmaPath"
              className="w-8 h-8 rounded-lg object-contain"
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
            to="/"
          >
            Find Medicine
          </Link>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors"
            href="#pharmacy-partner"
          >
            For Pharmacies
          </a>
          <a
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors"
            href="#pricing"
          >
            Pricing
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
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
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-subtle hover:text-slate-charcoal hover:bg-surface-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-surface-card rounded-xl p-4 border border-border-soft shadow-panel space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[14px] font-medium text-slate-charcoal hover:text-primary py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors"
          >
            Find Medicine
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pharmacy-partner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors"
          >
            For Pharmacies
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[14px] font-medium text-slate-subtle hover:text-slate-charcoal py-2 px-3 rounded-lg hover:bg-surface-muted transition-colors"
          >
            Pricing
          </a>
          <div className="pt-2 border-t border-border-soft flex gap-2">
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
          </div>
        </div>
      )}
    </header>
  );
};
