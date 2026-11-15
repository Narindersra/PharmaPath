import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  User,
  Store,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AtSign,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { login, loading, error: authError, clearError } = useAuth();
  const [role, setRole] = useState<'customer' | 'pharmacy'>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!identifier.trim()) {
      setFormError('Please enter your email or identifier');
      return;
    }
    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    try {
      await login(identifier.trim(), password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="bg-tech-grid font-sans text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary/10 selection:text-primary py-4">
      {/* Floating Navbar matching Landing Page design */}
      <header className="sticky top-4 z-50 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="h-14 bg-surface-card/90 backdrop-blur-md rounded-xl px-5 border border-border-soft shadow-subtle flex items-center justify-between">
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

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-[13px] font-medium text-slate-subtle hover:text-slate-charcoal transition-colors px-2 py-1"
            >
              Support
            </a>
            <Link
              to="/signup"
              className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single Centered Auth Card with Page Transition */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[440px] bg-white rounded-2xl border border-border-soft shadow-lg p-6 sm:p-8 space-y-5 relative"
        >
          
          {/* Header with Logo + Status Dot */}
          <div className="text-center space-y-2">
            <div className="relative inline-block mx-auto">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-border-soft flex items-center justify-center p-2 shadow-2xs">
                <img src="/logo.png" alt="PharmaPath" className="w-8 h-8 object-contain" />
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-[#005c55] border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
            </div>

            <h1 className="font-display text-2xl sm:text-[26px] font-extrabold text-slate-charcoal tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-muted max-w-xs mx-auto leading-relaxed">
              Access real-time medicine availability, batch holds, and prescription archives
            </p>
          </div>

          {/* Animated Role Switcher Tabs */}
          <div className="p-1 rounded-xl bg-surface-container flex items-center gap-1 relative">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer relative z-10 transition-colors"
            >
              {role === 'customer' && (
                <motion.div
                  layoutId="activeLoginRoleTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 500, damping: 35 }
                  }
                />
              )}
              <User
                className={`w-3.5 h-3.5 transition-colors ${
                  role === 'customer' ? 'text-primary' : 'text-slate-subtle'
                }`}
              />
              <span
                className={
                  role === 'customer'
                    ? 'text-slate-charcoal font-bold'
                    : 'text-slate-muted'
                }
              >
                Customer
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole('pharmacy')}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer relative z-10 transition-colors"
            >
              {role === 'pharmacy' && (
                <motion.div
                  layoutId="activeLoginRoleTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 500, damping: 35 }
                  }
                />
              )}
              <Store
                className={`w-3.5 h-3.5 transition-colors ${
                  role === 'pharmacy' ? 'text-primary' : 'text-slate-subtle'
                }`}
              />
              <span
                className={
                  role === 'pharmacy'
                    ? 'text-slate-charcoal font-bold'
                    : 'text-slate-muted'
                }
              >
                Pharmacy Owner
              </span>
            </button>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full h-11 bg-surface-container-low hover:bg-surface-container text-slate-charcoal text-[13px] font-semibold rounded-lg border border-border-soft transition-colors flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="w-full h-px bg-border-soft"></div>
            <span className="absolute px-3 bg-white text-[10px] font-mono text-slate-subtle uppercase tracking-wider font-bold">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Error Alert Box */}
          {(formError || authError) && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{formError || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Mobile Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-charcoal" htmlFor="identifier">
                  {role === 'customer' ? 'Email or Mobile Number' : 'Registered Mobile or DL / GSTIN'}
                </label>
                <span className="font-mono text-[10px] text-slate-subtle uppercase">SEC-UID</span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === 'customer'
                      ? 'name@example.com or +91 98765 43210'
                      : '98765 43210 or KA-BLR-2024-XXXX'
                  }
                  className="w-full h-11 pl-9 pr-3.5 bg-surface-container-low focus:bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-charcoal" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-primary font-semibold hover:underline text-[11px]">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-9 pr-10 bg-surface-container-low focus:bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm font-mono outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-subtle hover:text-slate-charcoal cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Workstation Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                />
                <span className="text-xs text-slate-muted">Remember this workstation (30 days)</span>
              </label>
            </div>

            {/* Animated Animate UI Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              className="w-full h-11 active:scale-[0.99] transition-all group"
            >
              {role === 'customer' ? 'Sign In to Account' : 'Access Dispatch Portal'}
            </Button>
          </form>

          {/* Bottom Footnote Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-muted">
              Don't have an active profile?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline ml-0.5">
                Register New Account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] font-mono text-slate-subtle py-2">
        <span>© 2026 PharmaPath Systems Corp. • CDSCO &amp; DISHA Compliant</span>
      </footer>
    </div>
  );
};

export default LoginPage;
