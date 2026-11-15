import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { apiFetch } from '../../lib/api';
import {
  Search,
  MapPin,
  Clock,
  QrCode,
  Navigation,
  Store,
  Phone,
  ChevronRight,
  LogOut,
  Settings,
  Menu,
  Bell,
  Star,
  Layers,
  Check,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface ActiveHold {
  id: string;
  token: string;
  smsPin: string;
  pharmacyName: string;
  pharmacyType: string;
  address: string;
  distance: string;
  isOpen24: boolean;
  closingTime?: string;
  medicineName: string;
  genericName: string;
  quantity: number;
  totalPrice: number;
  status: 'ready' | 'rx-needed';
  counterNumber: string;
  holdUntil: string;
  remainingSeconds: number;
}



const POPULAR_SEARCH_ITEMS = [
  {
    name: 'Dolo 650mg',
    generic: 'Paracetamol 650mg',
    stockStatus: '98% in stock',
    storesCount: '28 stores',
    color: 'emerald'
  },
  {
    name: 'Pan-D Capsule',
    generic: 'Pantoprazole + Domperidone',
    stockStatus: 'Available',
    storesCount: '22 stores',
    color: 'emerald'
  },
  {
    name: 'Azithral 500mg',
    generic: 'Azithromycin',
    stockStatus: 'Limited stock',
    storesCount: '12 stores near',
    color: 'amber'
  },
  {
    name: 'Montair-LC',
    generic: 'Montelukast + Levocetirizine',
    stockStatus: 'High stock',
    storesCount: '34 stores',
    color: 'emerald'
  },
  {
    name: 'Telma 40mg',
    generic: 'Telmisartan IP',
    stockStatus: 'Verified in stock',
    storesCount: '18 stores',
    color: 'emerald'
  },
  {
    name: 'Shelcal 500',
    generic: 'Calcium + Vitamin D3',
    stockStatus: 'High stock',
    storesCount: '41 stores',
    color: 'emerald'
  },
  {
    name: 'Allegra 120mg',
    generic: 'Fexofenadine HCl',
    stockStatus: 'In stock',
    storesCount: '19 stores',
    color: 'emerald'
  },
  {
    name: 'Glycomet 500 SR',
    generic: 'Metformin 500mg SR',
    stockStatus: 'In stock',
    storesCount: '35 stores',
    color: 'emerald'
  }
];

const SAVED_PHARMACIES = [
  {
    id: 'pharm-1',
    name: 'Apollo Pharmacy – Green Park Market',
    tag: 'Verified Hub',
    address: 'G-14, Main Market, Green Park, New Delhi',
    distance: '0.8 km away',
    hours: 'Open 24/7',
    rating: 4.8,
    reviewsCount: '1,240 verified reviews',
    perk: 'Tele-consult desk on site',
    stockInfo: 'Live sync 3m ago | 4,210 SKUs in stock',
    phone: '+91 11 2658 9123'
  },
  {
    id: 'pharm-2',
    name: 'Pradhan Mantri Jan Aushadhi Kendra',
    tag: 'Affordable Generics Certified',
    address: 'Shop 4, Community Center, Safdarjung Enclave',
    distance: '1.2 km away',
    hours: 'Open till 10:00 PM',
    rating: 4.6,
    reviewsCount: '480 reviews',
    perk: 'Up to 80% generic price savings',
    stockInfo: 'Live sync 5m ago | Generic salts available',
    phone: '+91 11 2619 4402'
  },
  {
    id: 'pharm-3',
    name: 'Wellness Forever Chemists – South Extension I',
    tag: 'Cold Chain Facility',
    address: 'Block E, Ring Road, South Extension',
    distance: '2.6 km away',
    hours: 'Open 24/7',
    rating: 4.9,
    reviewsCount: '2,100 reviews',
    perk: 'Insulins & Biologics in Cold Storage',
    stockInfo: 'Live sync 1m ago | 5,800 SKUs in stock',
    phone: '+91 11 4164 8870'
  }
];

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'reservations' | 'saved' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search input states
  const [medicineQuery, setMedicineQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState<number>(3);
  const [holds, setHolds] = useState<ActiveHold[]>([]);

  // QR Pass Modal State
  const [selectedHoldForQR, setSelectedHoldForQR] = useState<ActiveHold | null>(null);

  // Fetch real customer reservations from MongoDB
  useEffect(() => {
    let isMounted = true;
    apiFetch<{
      success: boolean;
      data: Array<{
        _id: string;
        token: string;
        smsPin: string;
        counterNumber?: string;
        expiresAt: string;
        quantity: number;
        totalPrice: number;
        status: string;
        pharmacyId?: {
          name?: string;
          pharmacyName?: string;
          address?: string;
          open24Hours?: boolean;
        };
        medicineId?: {
          name?: string;
          genericName?: string;
          requiresPrescription?: boolean;
        };
      }>;
    }>('/reservations/customer')
      .then((res) => {
        if (isMounted && res?.data && res.data.length > 0) {
          const mapped: ActiveHold[] = res.data
            .filter((r) => r.status === 'CONFIRMED' || r.status === 'PENDING')
            .map((r) => {
              const secondsLeft = Math.max(
                0,
                Math.floor((new Date(r.expiresAt).getTime() - Date.now()) / 1000)
              );
              return {
                id: r._id,
                token: r.token,
                smsPin: r.smsPin,
                pharmacyName: r.pharmacyId?.pharmacyName || r.pharmacyId?.name || 'Verified Dispensary',
                pharmacyType: 'Verified Hub',
                address: r.pharmacyId?.address || 'Dispensary Counter Market',
                distance: '0.8 km away',
                isOpen24: Boolean(r.pharmacyId?.open24Hours),
                medicineName: r.medicineId?.name || 'Prescription Medicine',
                genericName: r.medicineId?.genericName || 'Formula Salt',
                quantity: r.quantity,
                totalPrice: r.totalPrice,
                status: r.medicineId?.requiresPrescription ? 'rx-needed' : 'ready',
                counterNumber: r.counterNumber || 'Counter 2',
                holdUntil: new Date(r.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                remainingSeconds: secondsLeft,
              };
            });
          if (mapped.length > 0) {
            setHolds(mapped);
          }
        }
      })
      .catch((err) => console.error('Failed to load customer reservations:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown timer effect for active holds
  useEffect(() => {
    const timer = setInterval(() => {
      setHolds((prev) =>
        prev.map((h) => ({
          ...h,
          remainingSeconds: Math.max(0, h.remainingSeconds - 1)
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancelHold = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this 2-hour reservation hold?')) return;
    try {
      await apiFetch('/reservations/' + id, { method: 'DELETE' });
      setHolds((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert((err as Error).message || 'Failed to cancel hold');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineQuery.trim()) return;
    navigate('/search?q=' + encodeURIComponent(medicineQuery.trim()));
  };

  const handlePopularClick = (name: string) => {
    navigate('/search?q=' + encodeURIComponent(name));
  };

  return (
    <div className="bg-[#f8f9fa] font-sans text-slate-800 antialiased min-h-screen flex selection:bg-teal-500/10 selection:text-teal-800">
      {/* =========================================================================
          LEFT SIDEBAR (Clinical Modernism Customer Navigation)
          ========================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 z-40 w-64 h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Top Logo & Customer Portal Title (matching Landing Page) */}
          <div className="px-2 pt-1 pb-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="PharmaPath Logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <div className="flex flex-col">
                <span className="font-display text-[17px] tracking-tight text-slate-900 font-bold leading-none">
                  PharmaPath
                </span>
                <span className="text-[10px] font-mono text-teal-700 font-semibold tracking-wide uppercase mt-1">
                  Customer Portal
                </span>
              </div>
            </Link>
          </div>

          {/* OPERATIONS & DISPENSE SECTION */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              OPERATIONS &amp; DISPENSE
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('search');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Search className={`w-4 h-4 ${activeTab === 'search' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Search Medicine</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('reservations');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className={`w-4 h-4 ${activeTab === 'reservations' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>My Reservations</span>
              </div>
              {holds.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {holds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('saved');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className={`w-4 h-4 ${activeTab === 'saved' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Saved Pharmacies</span>
              </div>
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: User Profile & Settings */}
        <div className="p-4 border-t border-slate-200/80 space-y-2">
          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-teal-700' : 'text-slate-400'}`} />
              <span>Settings</span>
            </div>
          </button>

          {/* User Card */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'RS'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Rahul Sharma'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user?.email || 'rahul.s@example.com'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
        />
      )}

      {/* =========================================================================
          MAIN RIGHT WORKSPACE
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Greeting */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Rahul'}
              </h1>
            </div>
          </div>

          {/* Center: Search input */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                placeholder="Press ⌘K to search lot or name..."
                className="w-full h-9 pl-9 pr-10 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-700 outline-none transition-all shadow-2xs"
              />
              <span className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Notifications & Quick Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => alert('You have 2 active courtesy holds awaiting counter pickup.')}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5"></span>
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              RS
            </div>
          </div>
        </header>

        {/* =========================================================================
            TAB CONTENT CONTAINER
            ========================================================================= */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl w-full mx-auto">
          {/* TAB 1: MAIN DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* 1. HERO SEARCH & TELEMETRY BANNER */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      <span>DELHI NCR DISPENSARY TELEMETRY | ACTIVE</span>
                    </div>

                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Find verified medicines in real-time.
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      Cross-reference live counter stocks across 1,840+ licensed pharmacies with guaranteed 2-hour holds.
                    </p>
                  </div>

                  {/* Telemetry Stats on Right */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3 shrink-0 self-start md:self-auto text-xs font-mono">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">LOCAL STOCK LATENCY</p>
                      <p className="font-bold text-slate-900 text-sm">13 sec ago</p>
                    </div>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">PARTICIPATING CHEMISTS</p>
                      <p className="font-bold text-slate-900 text-sm">184 in {searchRadius}km</p>
                    </div>
                  </div>
                </div>

                {/* Large Search Bar Card with Distance Radius */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200 flex flex-col gap-2.5 shadow-2xs"
                >
                  <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="flex items-center gap-2.5 flex-1 w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 focus-within:border-teal-700 transition-all">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={medicineQuery}
                        onChange={(e) => setMedicineQuery(e.target.value)}
                        placeholder="e.g., Paracetamol, Dolo 650, Augmentin..."
                        className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-500">
                        Rx
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-72 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/80 focus-within:border-teal-700 transition-all">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="Pickup vicinity / Pincode"
                        className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setLocationQuery('Green Park, Delhi')}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-600 font-semibold shrink-0 cursor-pointer"
                      >
                        GPS Current
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Stock</span>
                    </button>
                  </div>

                  {/* Pharmacy Distance Range Selector (1 km, 3 km, 5 km, 10 km) */}
                  <div className="flex flex-wrap items-center justify-between pt-2 px-1 border-t border-slate-200/70 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-700">Select Pharmacy Range:</span>
                      <div className="inline-flex items-center gap-1.5">
                        {[1, 3, 5, 10].map((km) => (
                          <button
                            key={km}
                            type="button"
                            onClick={() => setSearchRadius(km)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              searchRadius === km
                                ? 'bg-teal-800 text-white shadow-2xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {km} km
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">
                      Showing results within {searchRadius} km radius
                    </span>
                  </div>
                </form>

                {/* Subtext clean indicators */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-semibold text-slate-700">Instant stock verification</span>
                    <span className="text-slate-300">|</span>
                    <span>Direct counter reservations locked for 2 hours with SMS PIN</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono text-slate-400 text-[10px]">
                    <span className="text-emerald-700 font-semibold">100% CDSCO Verified</span>
                    <span>|</span>
                    <a href="#emergency" className="text-slate-600 hover:underline">Emergency Chemist Finder</a>
                  </div>
                </div>
              </div>

              {/* 2. ACTIVE RESERVATIONS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Active Reservations
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {holds.length} Holds Active
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Holds</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {holds.map((hold) => (
                    <motion.div
                      key={hold.id}
                      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 hover:border-slate-300 hover:shadow-subtle transition-all flex flex-col justify-between"
                    >
                      {/* Store Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-display text-sm font-bold text-slate-900">
                              {hold.pharmacyName}
                            </h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                              {hold.pharmacyType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {hold.address} | {hold.distance}
                          </p>
                        </div>

                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-mono font-semibold shrink-0">
                          {hold.isOpen24 ? 'Open 24/7' : hold.closingTime}
                        </span>
                      </div>

                      {/* Medicine Info & Status */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{hold.medicineName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{hold.genericName}</p>
                            <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                              Qty: {hold.quantity} Strips | ₹{hold.totalPrice.toFixed(2)}
                            </p>
                          </div>

                          {hold.status === 'ready' ? (
                            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold shrink-0 text-right">
                              <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-emerald-700" /> Rx Verified</span><br />
                              <span className="text-[9px] font-normal text-emerald-700">Ready at {hold.counterNumber}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold shrink-0 text-right">
                              <span className="inline-flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-700" /> Rx Check Needed</span><br />
                              <span className="text-[9px] font-normal text-amber-700">Show Original at Dispense</span>
                            </span>
                          )}
                        </div>

                        {/* Hold Timer Box */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono">
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                              HOLD WINDOW EXPIRY
                            </p>
                            <p className="text-[11px] text-slate-600 font-medium">
                              Reserved strictly until {hold.holdUntil}
                            </p>
                          </div>

                          <div className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono text-xs font-bold text-teal-800 shadow-2xs">
                            {formatCountdown(hold.remainingSeconds)}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => handleCancelHold(hold.id)}
                          className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          Cancel Hold
                        </button>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          leftIcon={<Navigation className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedHoldForQR(hold)}
                        >
                          Directions &amp; QR Pass
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3. POPULAR & FREQUENT SEARCHES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Popular &amp; Frequent Searches
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      One-click live availability and salt bioequivalence near you
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Filter by therapeutic salt category: Analgesic, Antibiotic, Antacid, Anti-hypertensive')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Filter by Salt Category</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {POPULAR_SEARCH_ITEMS.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      onClick={() => handlePopularClick(item.name)}
                      className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs hover:border-teal-700 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-display text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                          {item.name}
                        </p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1"></span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        {item.generic}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                        <span className={`font-semibold ${item.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {item.stockStatus}
                        </span>
                        <span className="text-slate-400">{item.storesCount}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 4. SAVED PHARMACIES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Saved Pharmacies
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Your trusted local chemists with active stock telemetry &amp; preferential reserve desks
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('saved')}
                    className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Saved Dispensaries (5)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {SAVED_PHARMACIES.map((pharm) => (
                    <motion.div
                      key={pharm.id}
                      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:border-slate-300 hover:shadow-subtle transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Store className="w-4 h-4 text-teal-700" />
                          <h3 className="font-display text-sm font-bold text-slate-900">
                            {pharm.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {pharm.tag}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">
                          {pharm.address} | <span className="font-semibold text-slate-800">{pharm.distance}</span>
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5 flex-wrap">
                          <span className="font-mono text-slate-700 font-semibold">{pharm.hours}</span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{pharm.rating}</span>
                            <span className="text-slate-400 font-normal">({pharm.reviewsCount})</span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="text-teal-700 font-medium">{pharm.perk}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                            <span>{pharm.stockInfo}</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setMedicineQuery(pharm.name);
                            setActiveTab('search');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>View Inventory</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 5. SOS CRITICAL / RARE MEDICINE INQUIRY BANNER */}
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 font-bold text-xs font-mono shrink-0">
                    SOS
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-display text-sm font-bold text-white">
                      Critical or Rare Medicine Request?
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Submit your prescription for high-dependency formulations, oncology compounds, or emergency antidotes across Delhi state warehouses.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('SOS Form opened: Centralized emergency depot search initiated.')}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                >
                  <span>Raise SOS Inquiry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH MEDICINES TAB */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Search &amp; Compare Nearby Pharmacies
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time stock availability, price comparison, and counter hold reservation
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={medicineQuery}
                      onChange={(e) => setMedicineQuery(e.target.value)}
                      placeholder="Search medicine brand or generic salt..."
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>
                  <div className="relative w-full sm:w-64">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Location / Area"
                      className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Refreshed live results for ${medicineQuery || 'Dolo 650'}`)}
                    className="w-full sm:w-auto px-5 h-10 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-700">Radius Filter:</span>
                    <div className="inline-flex items-center gap-1.5">
                      {[1, 3, 5, 10].map((km) => (
                        <button
                          key={km}
                          type="button"
                          onClick={() => setSearchRadius(km)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            searchRadius === km
                              ? 'bg-teal-800 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {km} km
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-teal-800 font-bold">
                    Pharmacies within {searchRadius} km radius
                  </span>
                </div>
              </div>

              {/* Results list filtered by radius */}
              <div className="space-y-3">
                {[
                  {
                    name: 'Apollo Pharmacy – Green Park',
                    distNum: 0.8,
                    distance: '0.8 km',
                    price: '₹31.00 / strip',
                    stock: '142 units in stock',
                    rx: 'No Rx Needed',
                    hours: 'Open 24/7'
                  },
                  {
                    name: 'Pradhan Mantri Jan Aushadhi Kendra',
                    distNum: 1.2,
                    distance: '1.2 km',
                    price: '₹9.50 / strip (Generic Paracetamol)',
                    stock: '80 units in stock',
                    rx: 'Generic Alternative',
                    hours: 'Closes 10 PM'
                  },
                  {
                    name: 'MedPlus Wellness – Hauz Khas',
                    distNum: 1.4,
                    distance: '1.4 km',
                    price: '₹32.50 / strip',
                    stock: '45 units in stock',
                    rx: 'OTC',
                    hours: 'Open till 11 PM'
                  },
                  {
                    name: 'Wellness Forever Chemists – South Ex',
                    distNum: 2.6,
                    distance: '2.6 km',
                    price: '₹31.50 / strip',
                    stock: '98 units in stock',
                    rx: 'No Rx Needed',
                    hours: 'Open 24/7'
                  },
                  {
                    name: 'Guardian Pharmacy – Lajpat Nagar',
                    distNum: 4.2,
                    distance: '4.2 km',
                    price: '₹32.00 / strip',
                    stock: '30 units in stock',
                    rx: 'OTC',
                    hours: 'Open till 10 PM'
                  },
                  {
                    name: 'Max Healthcare Chemist – Saket',
                    distNum: 7.5,
                    distance: '7.5 km',
                    price: '₹33.00 / strip',
                    stock: '120 units in stock',
                    rx: 'OTC',
                    hours: 'Open 24/7'
                  }
                ]
                  .filter((item) => item.distNum <= searchRadius)
                  .map((res, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{res.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                          {res.hours}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {res.distance} away | <span className="text-emerald-700 font-semibold">{res.stock}</span> | <span className="font-mono font-bold text-slate-900">{res.price}</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`2-Hour courtesy hold requested at ${res.name}! SMS token dispatched.`)}
                      className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reserve for Pickup</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  My Counter Reservations &amp; Pickup Passes
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active 2-hour holds with digital counter QR tokens
                </p>
              </div>

              <div className="space-y-4">
                {holds.map((hold) => (
                  <div
                    key={hold.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800">
                          Token #{hold.token}
                        </span>
                        <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                          {hold.medicineName} ({hold.quantity} Strips)
                        </h3>
                        <p className="text-xs text-slate-500">
                          {hold.pharmacyName} | {hold.address}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs uppercase text-slate-400 font-mono font-semibold">
                          Countdown Remaining
                        </p>
                        <p className="text-xl font-mono font-extrabold text-teal-800">
                          {formatCountdown(hold.remainingSeconds)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCancelHold(hold.id)}
                        className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Cancel Reservation
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedHoldForQR(hold)}
                        className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show QR Pass &amp; Directions</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED PHARMACIES TAB */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Saved Local Pharmacies (3)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quick access to inventory telemetry and contact desks
                </p>
              </div>

              <div className="space-y-4">
                {SAVED_PHARMACIES.map((pharm) => (
                  <div
                    key={pharm.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-bold text-slate-900">
                            {pharm.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {pharm.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{pharm.address}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${pharm.phone}`}
                          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                      <span>{pharm.hours}</span>
                      <span className="text-emerald-700 font-semibold">{pharm.stockInfo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Account &amp; Notification Settings
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your patient profile and counter hold SMS notifications
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Settings updated successfully!');
                }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5"
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    placeholder="Enter your full name"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder="Enter your email"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mobile Number (For Hold SMS PINs)</label>
                  <input
                    type="tel"
                    defaultValue=""
                    placeholder="+91 98765 43210"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Default Vicinity / Pincode</label>
                  <input
                    type="text"
                    defaultValue=""
                    placeholder="Enter your area or pincode"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-teal-700 focus:ring-0 accent-teal-700 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Send instant SMS &amp; WhatsApp alerts when pharmacy confirms my reservation hold
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          ANIMATED DIGITAL QR PASS & COUNTER PICKUP MODAL
          ========================================================================= */}
      <Modal
        isOpen={!!selectedHoldForQR}
        onClose={() => setSelectedHoldForQR(null)}
        maxWidth="sm"
        title={
          selectedHoldForQR ? (
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-wider">
                DIGITAL COUNTER PASS
              </span>
              <h3 className="font-display text-base font-bold text-slate-900">
                {selectedHoldForQR.pharmacyName}
              </h3>
              <p className="text-xs text-slate-500 font-mono">{selectedHoldForQR.address}</p>
            </div>
          ) : undefined
        }
      >
        {selectedHoldForQR && (
          <div className="space-y-4 text-center">
            {/* QR Code Container Simulation */}
            <div className="w-44 h-44 mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-20 h-20 text-slate-900" />
              <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                TOKEN: {selectedHoldForQR.token}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs font-mono text-teal-900">
              <p className="text-[10px] text-teal-700 uppercase font-semibold">COUNTER SMS PIN</p>
              <p className="text-lg font-extrabold tracking-widest">{selectedHoldForQR.smsPin}</p>
              <p className="text-[10px] text-teal-700 mt-0.5">Show this PIN or scan QR at counter for instant release</p>
            </div>

            <div className="text-left text-[11px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">Medicine: {selectedHoldForQR.medicineName}</p>
              <p>Amount to Pay at Pickup: <span className="font-mono font-bold text-slate-900">₹{selectedHoldForQR.totalPrice.toFixed(2)}</span></p>
              {selectedHoldForQR.status === 'rx-needed' && (
                <p className="text-amber-800 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Please carry original physical doctor prescription for counter verification.</span>
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<Navigation className="w-3.5 h-3.5" />}
              onClick={() => {
                alert(`Opening navigation directions to ${selectedHoldForQR.pharmacyName}...`);
                setSelectedHoldForQR(null);
              }}
              className="w-full"
            >
              Navigate in Google Maps
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
