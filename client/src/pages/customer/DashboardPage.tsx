import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-base font-sans text-on-surface flex flex-col justify-between selection:bg-primary/10 selection:text-primary">
      <header className="h-16 bg-white border-b border-border-soft flex items-center px-6 lg:px-12 justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PharmaPath Logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-display text-[17px] font-bold text-slate-charcoal">PharmaPath</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-soft text-slate-charcoal hover:bg-surface-container transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f4f1] border border-[#a3faef] text-primary text-xs font-mono font-semibold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Authenticated Session Active</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-charcoal tracking-tight">
          Welcome to Your PharmaPath Dashboard
        </h1>
        <p className="text-slate-muted text-base max-w-lg mt-3 leading-relaxed">
          Your account is active. Live inventory feeds, instant 2-hour courtesy holds, and prescription tracking are ready.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-xs"
          >
            Find Medicines Nearby
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-lg border border-border-strong text-slate-charcoal bg-white hover:bg-surface-container text-sm font-semibold transition-colors"
          >
            Switch Account
          </Link>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-border-soft py-4 px-6 text-center text-xs text-slate-subtle flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span>PharmaPath Secure Workspace • DISHA &amp; HIPAA Compliant</span>
      </footer>
    </div>
  );
};

export default DashboardPage;
