import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Building2,
  MapPin,
  Clock,
  FileCheck,
  UploadCloud,
  Check
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'customer' | 'pharmacy'>('customer');

  // Customer Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Pharmacy Owner Form State
  const [pharmacyStoreName, setPharmacyStoreName] = useState('');
  const [branchArea, setBranchArea] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('10:00 PM');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dlNumber, setDlNumber] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [complianceAgreed, setComplianceAgreed] = useState(false);

  // Password validation calculation
  const hasMinChars = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const strengthCount = (hasMinChars ? 1 : 0) + (hasDigit ? 1 : 0) + (hasSpecial ? 1 : 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'pharmacy') {
      console.log('Registering Pharmacy Owner:', {
        fullName,
        email,
        mobile,
        pharmacyStoreName,
        branchArea,
        fullAddress,
        city,
        pinCode,
        openingTime,
        closingTime,
        dlNumber,
        uploadedFile: uploadedFile?.name,
        complianceAgreed
      });
    } else {
      console.log('Registering Customer:', { fullName, email, mobile });
    }
    if (role === 'pharmacy') {
      navigate('/pharmacy/dashboard');
    } else {
      navigate('/dashboard');
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
              to="/login"
              className="text-[13px] font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all cursor-pointer"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single Centered Auth Card */}
      <main className="w-full flex-1 flex items-center justify-center px-4 py-6">
        <div
          className={`w-full ${
            role === 'pharmacy' ? 'max-w-[620px]' : 'max-w-[460px]'
          } bg-white rounded-2xl border border-border-soft shadow-lg p-6 sm:p-8 space-y-5 relative transition-all duration-300`}
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
              {role === 'customer' ? 'Create your account' : 'Register your Pharmacy'}
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-muted max-w-sm mx-auto leading-relaxed">
              {role === 'customer'
                ? 'Search medicines, compare nearby pharmacy prices, and reserve orders'
                : 'Join PharmaPath dispensary network to digitize medicine inventory and receive verified prescription orders'}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="p-1 rounded-xl bg-surface-container flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'customer'
                  ? 'bg-white text-slate-charcoal shadow-xs'
                  : 'text-slate-muted hover:text-slate-charcoal'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${role === 'customer' ? 'text-primary' : 'text-slate-subtle'}`} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('pharmacy')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'pharmacy'
                  ? 'bg-white text-slate-charcoal shadow-xs'
                  : 'text-slate-muted hover:text-slate-charcoal'
              }`}
            >
              <Store className={`w-3.5 h-3.5 ${role === 'pharmacy' ? 'text-primary' : 'text-slate-subtle'}`} />
              <span>Pharmacy Owner</span>
            </button>
          </div>

          {/* Customer Google Auth Button */}
          {role === 'customer' && (
            <>
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

              <div className="relative flex items-center justify-center my-3">
                <div className="w-full h-px bg-border-soft"></div>
                <span className="absolute px-3 bg-white text-[10px] font-mono text-slate-subtle uppercase tracking-wider font-bold">
                  OR SIGN UP WITH EMAIL
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'customer' ? (
              /* CUSTOMER FORM FIELDS */
              <>
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-charcoal" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Navneet Sharma"
                      className="w-full h-11 pl-9 pr-3.5 bg-surface-container-low focus:bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-charcoal" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 pl-9 pr-3.5 bg-surface-container-low focus:bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-charcoal" htmlFor="mobile">
                    Phone Number
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                    <div className="bg-surface-container px-3 flex items-center border-r border-border-soft text-xs font-mono font-medium text-slate-muted">
                      +91
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full h-11 px-3 bg-surface-container-low focus:bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-charcoal" htmlFor="password">
                    Create Password
                  </label>
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1 h-1">
                        <div
                          className={`flex-1 rounded-full ${
                            strengthCount >= 1 ? 'bg-amber-500' : 'bg-surface-container'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strengthCount >= 2 ? 'bg-amber-500' : 'bg-surface-container'
                          }`}
                        />
                        <div
                          className={`flex-1 rounded-full ${
                            strengthCount >= 3 ? 'bg-emerald-500' : 'bg-surface-container'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-subtle">
                        <span className={hasMinChars ? 'text-emerald-700 font-medium' : ''}>
                          ✓ 8+ chars
                        </span>
                        <span className={hasDigit ? 'text-emerald-700 font-medium' : ''}>
                          ✓ Number
                        </span>
                        <span className={hasSpecial ? 'text-emerald-700 font-medium' : ''}>
                          ✓ Symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      required
                      className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-0 accent-primary cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-muted leading-relaxed">
                      I agree to PharmaPath{' '}
                      <a href="#" className="text-primary underline hover:text-primary-hover">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary underline hover:text-primary-hover">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </>
            ) : (
              /* PHARMACY OWNER DETAILED FORM */
              <div className="space-y-6">
                {/* 1. Owner Account Details */}
                <div className="space-y-3 p-4 rounded-xl bg-surface-container-low/60 border border-border-soft">
                  <div className="flex items-center gap-2 pb-1 border-b border-border-soft/60">
                    <User className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-bold text-slate-charcoal uppercase tracking-wider">
                      1. Owner Account Details
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="ownerName">
                      Full Name
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="ownerName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="ownerEmail">
                      Email Address / Login ID
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="ownerEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh@apexpharma.in"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="ownerPhone">
                      Phone Number (Verified Contact)
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="bg-surface-container px-3 flex items-center border-r border-border-soft text-xs font-mono font-medium text-slate-muted">
                        +91
                      </div>
                      <input
                        id="ownerPhone"
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full h-10 px-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  {/* Passwords row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal" htmlFor="ownerPwd">
                        Create Password
                      </label>
                      <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                        <input
                          id="ownerPwd"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="w-full h-10 pl-3 pr-8 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-subtle hover:text-slate-charcoal cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal" htmlFor="ownerConfirmPwd">
                        Confirm Password
                      </label>
                      <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                        <input
                          id="ownerConfirmPwd"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full h-10 pl-3 pr-8 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-subtle hover:text-slate-charcoal cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pharmacy & Branch Details */}
                <div className="space-y-3 p-4 rounded-xl bg-surface-container-low/60 border border-border-soft">
                  <div className="flex items-center gap-2 pb-1 border-b border-border-soft/60">
                    <Store className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-bold text-slate-charcoal uppercase tracking-wider">
                      2. Pharmacy &amp; Branch Details
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="storeName">
                      Pharmacy Store Name
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        id="storeName"
                        type="text"
                        required
                        value={pharmacyStoreName}
                        onChange={(e) => setPharmacyStoreName(e.target.value)}
                        placeholder="e.g. Apollo Pharmacy / Apex Medico"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="branch">
                      Branch / Area Name
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        id="branch"
                        type="text"
                        required
                        value={branchArea}
                        onChange={(e) => setBranchArea(e.target.value)}
                        placeholder="e.g. Koramangala 4th Block"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="address">
                      Full Address
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        id="address"
                        type="text"
                        required
                        value={fullAddress}
                        onChange={(e) => setFullAddress(e.target.value)}
                        placeholder="Building, Street, Landmark"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>

                  {/* City & PIN Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal" htmlFor="city">
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Bengaluru"
                        className="w-full h-10 px-3 rounded-lg border border-border-soft focus:border-primary bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal" htmlFor="pinCode">
                        PIN Code
                      </label>
                      <input
                        id="pinCode"
                        type="text"
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="e.g. 560034"
                        className="w-full h-10 px-3 rounded-lg border border-border-soft focus:border-primary bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal flex items-center gap-1" htmlFor="openTime">
                        <Clock className="w-3.5 h-3.5 text-slate-subtle" />
                        <span>Opening Time</span>
                      </label>
                      <input
                        id="openTime"
                        type="text"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-full h-10 px-3 rounded-lg border border-border-soft focus:border-primary bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-charcoal flex items-center gap-1" htmlFor="closeTime">
                        <Clock className="w-3.5 h-3.5 text-slate-subtle" />
                        <span>Closing Time</span>
                      </label>
                      <input
                        id="closeTime"
                        type="text"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        placeholder="10:00 PM"
                        className="w-full h-10 px-3 rounded-lg border border-border-soft focus:border-primary bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Legal & Verification Details */}
                <div className="space-y-3 p-4 rounded-xl bg-surface-container-low/60 border border-border-soft">
                  <div className="flex items-center justify-between pb-1 border-b border-border-soft/60">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <h2 className="text-xs font-bold text-slate-charcoal uppercase tracking-wider">
                        3. Legal &amp; Verification Details
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Required Form 20/21
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal" htmlFor="dlNumber">
                      Drug License (DL) Number
                    </label>
                    <div className="relative rounded-lg overflow-hidden border border-border-soft focus-within:border-primary transition-all">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-subtle">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <input
                        id="dlNumber"
                        type="text"
                        required
                        value={dlNumber}
                        onChange={(e) => setDlNumber(e.target.value)}
                        placeholder="e.g. KA-BLR-2024-88491"
                        className="w-full h-10 pl-9 pr-3 bg-white text-slate-charcoal placeholder:text-slate-subtle text-xs font-mono outline-none"
                      />
                    </div>
                  </div>

                  {/* Upload License Document */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-charcoal">
                      Upload License Document
                    </label>
                    <label className="border-2 border-dashed border-border-soft hover:border-primary rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors group">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center mb-1.5 group-hover:bg-primary/10 transition-colors">
                        <UploadCloud className="w-5 h-5 text-slate-muted group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-xs font-medium text-slate-charcoal text-center">
                        {uploadedFile ? (
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> {uploadedFile.name}
                          </span>
                        ) : (
                          'Upload Drug License Document (PDF, JPG, PNG up to 5MB)'
                        )}
                      </span>
                      <span className="text-[10px] text-slate-subtle mt-0.5">
                        Admin verification required within 24 hours • Click to browse files
                      </span>
                    </label>
                  </div>

                  {/* Compliance Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={complianceAgreed}
                        onChange={(e) => setComplianceAgreed(e.target.checked)}
                        required
                        className="w-4 h-4 mt-0.5 rounded text-primary focus:ring-0 accent-primary cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-slate-muted leading-relaxed">
                        I declare that the drug license and pharmacy information provided are authentic and
                        comply with CDSCO / State FDA regulations.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group mt-2"
            >
              <span>
                {role === 'customer'
                  ? 'Create Free Account'
                  : 'Register Pharmacy Dispensary'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Bottom Footnote Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-muted">
              Already registered?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline ml-0.5">
                {role === 'customer' ? 'Sign in to account' : 'Sign in to Dispensary Portal'}
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] font-mono text-slate-subtle py-2">
        <span>© 2026 PharmaPath Systems Corp. • CDSCO &amp; DISHA Compliant</span>
      </footer>
    </div>
  );
};

export default SignupPage;
