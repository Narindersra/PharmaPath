import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

const POPULAR_SEARCHES = [
  'Dolo 650',
  'Paracetamol 500mg',
  'Augmentin 625',
  'Pantocid 40',
  'Telma 40',
  'Metformin 500mg',
];

export const LandingPage: React.FC = () => {
  const [medicineQuery, setMedicineQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Bengaluru, Karnataka');
  const [selectedRadius, setSelectedRadius] = useState('3 km');
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 59, seconds: 42 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMedicineQuery(tag);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', medicineQuery, 'in', locationQuery);
  };

  return (
    <div className="font-sans text-[15px] text-slate-muted antialiased relative min-h-screen selection:bg-primary/10 selection:text-primary flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-260px)] flex-1">
        <div className="flex flex-col w-full relative">

          {/* =========================================================================
                 1. HERO SECTION: Monumental Typography & Clinical Precision
                 ========================================================================= */}
          <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-visible">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-charcoal font-extrabold max-w-4xl leading-[1.12]">
                Find your medicine.
                <br />
                <span className="text-primary inline-block">Skip the pharmacy hunt.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-subtle max-w-2xl mt-5 leading-relaxed">
                Check real-time stock at verified pharmacies near you, compare prescription prices, and hold your medication for instant pickup.
              </p>

              {/* Search Bar Card */}
              <form
                onSubmit={handleSearchSubmit}
                className="w-full max-w-3xl mt-9 bg-surface-card rounded-xl p-2 border border-border-soft shadow-panel flex flex-col md:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-2.5 flex-1 w-full px-4 py-3 rounded-lg bg-surface-elevated border border-border-soft/60 focus-within:border-primary focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-primary text-[20px]">search</span>
                  <input
                    className="w-full bg-transparent text-slate-charcoal placeholder:text-slate-subtle focus:outline-none text-[14px]"
                    placeholder="Search medicine (e.g. Paracetamol 650, Azithromycin)..."
                    type="text"
                    value={medicineQuery}
                    onChange={(e) => setMedicineQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-60 px-4 py-3 rounded-lg bg-surface-elevated border border-border-soft/60 focus-within:border-primary focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-slate-subtle text-[19px]">location_on</span>
                  <input
                    className="w-full bg-transparent text-slate-charcoal placeholder:text-slate-subtle focus:outline-none text-[14px]"
                    placeholder="City, PIN or Area"
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto text-[14px] font-semibold px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search</span>
                </button>
              </form>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-slate-subtle text-[13px]">
                <span className="text-slate-subtle font-medium">Popular:</span>
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={(e) => handleTagClick(term, e)}
                    className="px-2.5 py-1 rounded-md bg-surface-card border border-border-soft hover:border-border-strong text-slate-charcoal text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* =========================================================================
                 2. EDITORIAL METRICS STRIP: High Precision Telemetry At A Glance
                 ========================================================================= */}
          <section className="w-full mx-auto my-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-surface-card p-6 md:p-8 rounded-xl shadow-subtle border border-border-soft divide-y md:divide-y-0 md:divide-x divide-border-soft">
              
              <div className="flex flex-col gap-1.5 md:pr-4 pt-3 md:pt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
                  Verified Chemists &amp; Pharmacies
                </span>
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-charcoal tracking-tight font-mono">
                  18,500+
                </span>
                <span className="text-[13px] text-slate-subtle leading-tight">
                  Apollo, MedPlus, Jan Aushadhi &amp; local retail
                </span>
              </div>

              <div className="flex flex-col gap-1.5 md:px-4 pt-3 md:pt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
                  Inventory Refresh
                </span>
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-charcoal tracking-tight font-mono">
                  Under 60s
                </span>
                <span className="text-[13px] text-slate-subtle leading-tight">
                  Direct POS / Marg ERP live connectivity
                </span>
              </div>

              <div className="flex flex-col gap-1.5 md:px-4 pt-3 md:pt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
                  Order Fulfillment Rate
                </span>
                <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-charcoal tracking-tight font-mono">
                  99.4%
                </span>
                <span className="text-[13px] text-slate-subtle leading-tight">
                  Confirmed counter pickup across 24+ cities
                </span>
              </div>

              <div className="flex flex-col gap-1.5 md:pl-4 pt-3 md:pt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-subtle">
                  Avg. Patient Savings
                </span>
                <span className="font-display text-2xl md:text-3xl text-primary font-bold tracking-tight font-mono">
                  ₹450 / Rx
                </span>
                <span className="text-[13px] text-slate-subtle leading-tight">
                  Generic alternatives &amp; PMBJP equivalents
                </span>
              </div>

            </div>
          </section>

          {/* =========================================================================
                 3. 3-STEP FLOW: Clean Editorial Layout
                 ========================================================================= */}
          <section id="how-it-works" className="w-full mx-auto my-16">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold px-2.5 py-0.5 rounded bg-primary-subtle border border-primary-border">
                Simple 3-Step Flow
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-charcoal mt-3 tracking-tight">
                How PharmaPath Works
              </h2>
              <p className="text-[14px] text-slate-subtle mt-2">
                Eliminate phone calls, guesswork, and back-and-forth pharmacy counter visits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* STEP // 01 */}
              <div className="bg-surface-card p-6 rounded-xl border border-border-soft shadow-subtle flex flex-col justify-between hover:border-border-strong transition-all duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border-soft">
                    <span className="font-mono text-xs font-semibold text-slate-subtle tracking-wider">
                      STEP // 01
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border-soft text-slate-charcoal flex items-center justify-center">
                      <span className="material-symbols-outlined text-[19px]">manage_search</span>
                    </div>
                  </div>
                  <h3 className="font-display text-[17px] font-bold text-slate-charcoal mt-1">
                    Search Medicine
                  </h3>
                  <p className="text-[14px] text-slate-muted leading-relaxed">
                    Enter your prescription name or snap a photo of your paper script. Our system indexes local batches in milliseconds.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-soft/60 font-mono text-[12px] text-slate-subtle flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-primary">check_circle</span>
                  <span>Instant radius telemetry</span>
                </div>
              </div>

              {/* STEP // 02 */}
              <div className="bg-surface-card p-6 rounded-xl border border-border-soft shadow-subtle flex flex-col justify-between hover:border-border-strong transition-all duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border-soft">
                    <span className="font-mono text-xs font-semibold text-slate-subtle tracking-wider">
                      STEP // 02
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border-soft text-slate-charcoal flex items-center justify-center">
                      <span className="material-symbols-outlined text-[19px]">compare_arrows</span>
                    </div>
                  </div>
                  <h3 className="font-display text-[17px] font-bold text-slate-charcoal mt-1">
                    Compare Nearby Pharmacies
                  </h3>
                  <p className="text-[14px] text-slate-muted leading-relaxed">
                    Inspect real-time stock levels, cash vs. insurance copays, and driving distance across independent pharmacies.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-soft/60 font-mono text-[12px] text-slate-subtle flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-primary">check_circle</span>
                  <span>Price &amp; distance transparent</span>
                </div>
              </div>

              {/* STEP // 03 */}
              <div className="bg-surface-card p-6 rounded-xl border border-border-soft shadow-subtle flex flex-col justify-between hover:border-border-strong transition-all duration-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border-soft">
                    <span className="font-mono text-xs font-semibold text-slate-subtle tracking-wider">
                      STEP // 03
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-surface-muted border border-border-soft text-slate-charcoal flex items-center justify-center">
                      <span className="material-symbols-outlined text-[19px]">qr_code_scanner</span>
                    </div>
                  </div>
                  <h3 className="font-display text-[17px] font-bold text-slate-charcoal mt-1">
                    Reserve for Pickup
                  </h3>
                  <p className="text-[14px] text-slate-muted leading-relaxed">
                    Lock in a 2-hour digital courtesy hold. Show your dynamic QR pass at the counter, sign, and be out the door in 60 seconds.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border-soft/60 font-mono text-[12px] text-slate-subtle flex items-center gap-2">
                  <span className="material-symbols-outlined text-[15px] text-primary">check_circle</span>
                  <span>Guaranteed hold protocol</span>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
                 4. WHY PHARMAPATH BENTO GRID: Engineering Precision
                 ========================================================================= */}
          <section id="features" className="w-full mx-auto my-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-border-soft">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold px-2 py-0.5 rounded bg-primary-subtle border border-primary-border">
                  Why PharmaPath
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-charcoal mt-2 tracking-tight">
                  Everything you need to get your prescription without the hassle.
                </h2>
              </div>
              <p className="text-[14px] text-slate-subtle max-w-md">
                Built directly on top of accredited pharmacy ERP pipelines, live inventory telemetry, and guaranteed hold protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* BOX 1: Live Spatial Node Tracking (Span 7) */}
              <div className="md:col-span-7 bg-surface-card rounded-xl p-6 border border-border-soft shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-surface-muted border border-border-soft text-slate-charcoal font-medium">
                      Live Radar Telemetry
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-[12px] text-slate-subtle bg-surface-muted px-2.5 py-0.5 rounded border border-border-soft">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Scanning 5.0 km radius</span>
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-charcoal">
                    Spatial Node Tracking
                  </h3>
                  <p className="text-[13px] text-slate-subtle mt-1 max-w-md">
                    Watch real-time dispensary batches update as supply shifts across regional nodes.
                  </p>
                </div>

                {/* Real Node Cards */}
                <div className="my-5 flex flex-col gap-2.5">
                  {/* Apollo */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border-soft bg-surface-elevated hover:bg-white hover:border-border-strong transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-white border border-border-soft text-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">local_pharmacy</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-[14px] font-semibold text-slate-charcoal">
                          Apollo Pharmacy
                        </span>
                        <span className="text-[12px] text-slate-subtle">
                          0.6 km · Koramangala 4th Block
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-emerald-text bg-emerald-badge border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        12 In Stock
                      </span>
                      <span className="material-symbols-outlined text-slate-subtle text-[16px]">chevron_right</span>
                    </div>
                  </div>

                  {/* MedPlus */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border-soft bg-surface-elevated hover:bg-white hover:border-border-strong transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-white border border-border-soft text-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-[14px] font-semibold text-slate-charcoal">
                          MedPlus Pharmacy
                        </span>
                        <span className="text-[12px] text-slate-subtle">
                          1.2 km · Indiranagar 100ft Rd
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-emerald-text bg-emerald-badge border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        4 In Stock
                      </span>
                      <span className="material-symbols-outlined text-slate-subtle text-[16px]">chevron_right</span>
                    </div>
                  </div>

                  {/* PMBJP */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border-soft bg-surface-elevated hover:bg-white hover:border-border-strong transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-white border border-border-soft text-primary flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-[14px] font-semibold text-slate-charcoal">
                          PMBJP - Pradhan Mantri Jan Aushadhi Kendra
                        </span>
                        <span className="text-[12px] text-slate-subtle">
                          1.8 km · HSR Layout Sector 2
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-amber-text bg-amber-badge border border-amber-200 px-2 py-0.5 rounded font-medium">
                        Low (2 left)
                      </span>
                      <span className="material-symbols-outlined text-slate-subtle text-[16px]">chevron_right</span>
                    </div>
                  </div>
                </div>

                {/* Radius Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-border-soft/60">
                  <span className="text-[12px] font-mono text-slate-subtle">Search Radius:</span>
                  <div className="flex items-center gap-1.5">
                    {['1 km', '3 km', '5 km', '10 km'].map((radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() => setSelectedRadius(radius)}
                        className={`px-2.5 py-1 rounded text-[12px] font-mono transition-colors cursor-pointer ${
                          selectedRadius === radius
                            ? 'bg-primary text-white font-medium shadow-xs'
                            : 'bg-surface-muted text-slate-muted border border-border-soft hover:bg-white'
                        }`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOX 2: Digital Hold Protocol (Span 5) */}
              <div className="md:col-span-5 bg-surface-card rounded-xl p-6 border border-border-soft shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-primary-subtle text-primary border border-primary-border font-medium">
                      Digital Hold Protocol
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">lock_clock</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-charcoal">
                    Instant 2-Hour Holds
                  </h3>
                  <p className="text-[13px] text-slate-subtle mt-1">
                    Lock critical medicines directly in the pharmacy's queue without upfront payment.
                  </p>
                </div>

                {/* Countdown Card */}
                <div className="bg-surface-elevated rounded-lg p-4 my-4 border border-border-soft flex flex-col gap-2">
                  <div className="flex items-center justify-between text-slate-subtle font-mono text-[11px]">
                    <span>HOLD EXPIRES IN</span>
                    <span className="text-primary font-semibold">GUARANTEED HOLD</span>
                  </div>
                  <div className="font-mono text-3xl font-extrabold text-slate-charcoal tracking-wider text-center my-2">
                    {formatDigits(timeLeft.hours)}:{formatDigits(timeLeft.minutes)}:{formatDigits(timeLeft.seconds)}
                  </div>
                  <div className="w-full bg-border-soft rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-4/5"></div>
                  </div>
                  <div className="flex items-center justify-between text-slate-subtle text-[11px] font-mono mt-1">
                    <span>Zero payment penalty</span>
                    <span className="text-slate-charcoal font-medium">Direct Queue Insert</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-muted text-[13px]">
                  <span className="material-symbols-outlined text-primary text-[17px]">verified</span>
                  <span>Pharmacist notified automatically on reservation</span>
                </div>
              </div>

              {/* BOX 3: Bio-Equivalent Match (Span 5) */}
              <div className="md:col-span-5 bg-surface-card rounded-xl p-6 border border-border-soft shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-surface-muted text-slate-charcoal border border-border-soft font-medium">
                      Cost Transparency
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">price_change</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-charcoal">
                    Bio-Equivalent Match
                  </h3>
                  <p className="text-[13px] text-slate-subtle mt-1">
                    Automatically surfaces FDA-approved equivalent generic medications at local shelf prices.
                  </p>
                </div>

                {/* Price Comparison Widget */}
                <div className="bg-surface-elevated rounded-lg p-4 my-4 border border-border-soft flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-slate-subtle">Brand Name MRP</span>
                      <span className="font-mono text-[15px] text-slate-subtle line-through">₹850.00</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[12px] text-primary font-medium">PMBJP / Generic Equivalent</span>
                      <span className="font-mono text-xl font-bold text-slate-charcoal">₹145.00</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-badge border border-emerald-200 text-emerald-text flex items-center justify-between">
                    <span className="text-[12px] font-mono font-semibold">Save 83% at counter</span>
                    <span className="material-symbols-outlined text-[16px]">trending_down</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-muted text-[13px]">
                  <span className="material-symbols-outlined text-primary text-[17px]">verified</span>
                  <span>Includes PMBJP &amp; Jan Aushadhi generic equivalent verification</span>
                </div>
              </div>

              {/* BOX 4: Wide Partner Network & Security (Span 7) */}
              <div className="md:col-span-7 bg-surface-card rounded-xl p-6 border border-border-soft shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                      100% Verified Dispensing Network
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-charcoal">
                    Direct Pharmacy ERP Protocol
                  </h3>
                  <p className="text-[13px] text-slate-subtle mt-1 leading-relaxed">
                    Direct dispensary feeds, verified pricing transparency, and instant prescription reservations designed for patients and caregivers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-border-soft">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[13px] text-slate-charcoal">
                      <span className="material-symbols-outlined text-[17px] text-primary">security</span>
                      <span>CDSCO Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-charcoal">
                      <span className="material-symbols-outlined text-[17px] text-primary">verified_user</span>
                      <span>State Pharmacy Council Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-charcoal">
                      <span className="material-symbols-outlined text-[17px] text-primary">health_and_safety</span>
                      <span>Marg ERP &amp; Vyapar Ready</span>
                    </div>
                  </div>

                  <div className="bg-surface-elevated p-4 rounded-lg border border-border-soft flex flex-col items-center justify-center text-center w-full sm:w-auto sm:min-w-[170px]">
                    <span className="font-mono text-[11px] text-slate-subtle uppercase tracking-wider">
                      Telemetry Latency
                    </span>
                    <span className="font-mono text-2xl font-bold text-primary mt-0.5">
                      120ms
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-subtle font-mono text-[11px] mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Real-time webhook sync</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
                 5. PHARMACY PARTNER CALLOUT BANNER
                 ========================================================================= */}
          <section id="pharmacy-partner" className="w-full mx-auto my-16">
            <div className="bg-surface-card border border-border-soft rounded-xl p-8 md:p-10 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-2.5 max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                    For Independent Pharmacies
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-charcoal">
                  Are you a pharmacy owner? Connect your dispensary.
                </h3>
                <p className="text-[14px] text-slate-muted leading-relaxed">
                  Sync your inventory in under 15 minutes via Marg ERP, Vyapar, or POS plugins. Route high-intent neighborhood patients directly to your pickup counter.
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono text-slate-subtle mt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-elevated border border-border-soft text-slate-charcoal">
                    <span className="material-symbols-outlined text-[15px] text-primary">bolt</span>
                    <span>15-minute setup</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-elevated border border-border-soft text-slate-charcoal">
                    <span className="material-symbols-outlined text-[15px] text-primary">trending_up</span>
                    <span>+32% new local patients</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-elevated border border-border-soft text-slate-charcoal">
                    <span className="material-symbols-outlined text-[15px] text-primary">sync</span>
                    <span>Zero lock-in contract</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  className="w-full sm:w-auto text-[13px] font-semibold px-5 py-3 rounded-lg bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all whitespace-nowrap text-center cursor-pointer"
                >
                  Partner with PharmaPath
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto text-[13px] font-semibold px-5 py-3 rounded-lg bg-surface-card border border-border-strong text-slate-charcoal hover:bg-surface-muted transition-all whitespace-nowrap text-center cursor-pointer"
                >
                  Book Integration Demo
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default LandingPage;
