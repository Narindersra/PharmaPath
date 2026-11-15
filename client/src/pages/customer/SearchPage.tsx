import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Store,
  ArrowRight,
  Filter,
  Phone,
  Thermometer
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export interface SearchMedicineResult {
  id: string;
  name: string;
  genericName: string;
  price: number;
  mrp: number;
  savingsPercent: number;
  stock: number;
  isAvailable: boolean;
  expiryDate: string;
  batchNumber: string;
  category: string;
  isColdChain: boolean;
  requiresPrescription: boolean;
  pharmacy: {
    id: string;
    name: string;
    contactPerson?: string;
    address: string;
    city: string;
    phone: string;
    isVerified: boolean;
    open24Hours: boolean;
    closingTime?: string;
    rating: number;
    distance: string;
  };
}

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('query') || '';
  const navigate = useNavigate();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('5 km');
  const [filterCategory, setFilterCategory] = useState<'all' | 'cold-chain' | 'schedule-h'>('all');
  const [inStockOnly, setInStockOnly] = useState(true);

  const [results, setResults] = useState<SearchMedicineResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Reservation Modal state
  const [selectedMedicine, setSelectedMedicine] = useState<SearchMedicineResult | null>(null);
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [isReserving, setIsReserving] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<{
    token: string;
    smsPin: string;
    counterNumber: string;
    expiresAt: string;
    totalPrice: number;
  } | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    try {
      setLoading(true);
      const res = await apiFetch<{
        success: boolean;
        count: number;
        data: SearchMedicineResult[];
      }>('/medicines/search', {
        params: {
          query: searchQuery,
          inStockOnly,
          category: filterCategory !== 'all' ? filterCategory : '',
        },
      });

      if (res?.data) {
        setResults(res.data);
      }
      setSearched(true);
    } catch (err) {
      console.error('Failed to search medicines:', err);
    } finally {
      setLoading(false);
    }
  }, [inStockOnly, filterCategory]);

  useEffect(() => {
    let isMounted = true;

    apiFetch<{
      success: boolean;
      count: number;
      data: SearchMedicineResult[];
    }>('/medicines/search', {
      params: {
        query: initialQuery,
        inStockOnly,
        category: filterCategory !== 'all' ? filterCategory : '',
      },
    })
      .then((res) => {
        if (isMounted && res?.data) {
          setResults(res.data);
          setSearched(true);
        }
      })
      .catch((err) => {
        console.error('Failed to search medicines:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [initialQuery, inStockOnly, filterCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    performSearch(query);
  };

  const handleOpenReserveModal = (medicine: SearchMedicineResult) => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    setSelectedMedicine(medicine);
    setReserveQuantity(1);
    setConfirmedReservation(null);
  };

  const handleConfirmReservation = async () => {
    if (!selectedMedicine) return;

    try {
      setIsReserving(true);
      const res = await apiFetch<{
        success: boolean;
        message: string;
        data: {
          token: string;
          smsPin: string;
          counterNumber: string;
          expiresAt: string;
          totalPrice: number;
        };
      }>('/reservations', {
        method: 'POST',
        body: {
          medicineId: selectedMedicine.id,
          quantity: reserveQuantity,
        },
      });

      if (res?.data) {
        setConfirmedReservation(res.data);
        // Refresh local search to reflect decremented stock
        performSearch(query);
      }
    } catch (err) {
      alert((err as Error).message || 'Failed to place reservation hold');
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="font-sans text-[15px] text-slate-800 antialiased min-h-screen flex flex-col bg-[#f8f9fa] selection:bg-teal-500/10 selection:text-teal-800">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Search Header Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-2.5">
            <div className="flex items-center gap-2.5 flex-1 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-teal-700 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-teal-700 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medicine brand or generic salt (e.g. Dolo 650, Augmentin, Paracetamol)..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-64 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-teal-700 focus-within:bg-white transition-all">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location / Area"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full md:w-auto px-6 h-11 shrink-0"
            >
              <span>Search Stock</span>
            </Button>
          </form>

          {/* Filters & Radius Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter Radius:
              </span>
              {['1 km', '3 km', '5 km', '10 km'].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => setSelectedRadius(rad)}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-colors cursor-pointer ${
                    selectedRadius === rad
                      ? 'bg-teal-800 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rad}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterCategory === 'all'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Types
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('cold-chain')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterCategory === 'cold-chain'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cold Chain
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('schedule-h')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    filterCategory === 'schedule-h'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Prescription Rx
                </button>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-teal-800 focus:ring-0 accent-teal-800 cursor-pointer"
                />
                <span>In-Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Counter Banner */}
        <div className="my-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-bold text-slate-900">
              {query ? `Search Results for "${query}"` : 'Verified Dispensary Inventory'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {results.length} Available Nearby
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Direct Marg ERP &amp; POS synchronized
          </span>
        </div>

        {/* Search Results Grid / List */}
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              No matching medicines found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searched
                ? `No dispensaries currently have "${query}" in stock within ${selectedRadius}. Try expanding the radius or search by generic salt.`
                : 'Enter a prescription name above to query real-time stock across accredited pharmacies.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <motion.div
                key={item.id}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-teal-700/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {item.batchNumber}
                        </span>
                        {item.isColdChain && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            <span>Cold Chain (4°C)</span>
                          </span>
                        )}
                        {item.requiresPrescription && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            Rx Required
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {item.genericName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xl font-extrabold text-teal-800">
                        ₹{item.price.toFixed(2)}
                      </div>
                      {item.savingsPercent > 0 && (
                        <div className="flex items-center gap-1 justify-end">
                          <span className="font-mono text-xs text-slate-400 line-through">
                            ₹{item.mrp.toFixed(2)}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Save {item.savingsPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pharmacy Details Box */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-teal-700 shadow-2xs">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span>{item.pharmacy.name}</span>
                            {item.pharmacy.isVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.pharmacy.address}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {item.pharmacy.distance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.pharmacy.open24Hours ? 'Open 24/7' : `Closes ${item.pharmacy.closingTime || '10:00 PM'}`}
                      </span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {item.pharmacy.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs font-bold text-emerald-800">
                      {item.stock} in stock
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenReserveModal(item)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    <span>Reserve Hold (2h Pass)</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* RESERVATION CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(selectedMedicine)}
        onClose={() => {
          setSelectedMedicine(null);
          setConfirmedReservation(null);
        }}
        title={confirmedReservation ? 'Hold Pass Confirmed!' : 'Confirm 2-Hour Medicine Hold'}
        maxWidth="md"
      >
        {selectedMedicine && (
          <div className="space-y-4 text-xs">
            {!confirmedReservation ? (
              <>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      Medicine Selected
                    </span>
                    {selectedMedicine.requiresPrescription && (
                      <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                        Doctor Rx Required
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-slate-900">{selectedMedicine.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{selectedMedicine.genericName}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-900 font-bold">
                    <Store className="w-3.5 h-3.5 text-teal-700" />
                    <span>Pickup Counter: {selectedMedicine.pharmacy.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5">
                    {selectedMedicine.pharmacy.address}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono pl-5 pt-1 text-slate-500">
                    <span>{selectedMedicine.pharmacy.distance}</span>
                    <span>{selectedMedicine.pharmacy.phone}</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-slate-700">Reserve Quantity:</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setReserveQuantity(q)}
                        disabled={q > selectedMedicine.stock}
                        className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          reserveQuantity === q
                            ? 'bg-teal-800 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Unit Price:</span>
                    <span className="font-mono">₹{selectedMedicine.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Amount (Pay at Counter):</span>
                    <span className="font-mono text-teal-800 text-sm">
                      ₹{(selectedMedicine.price * reserveQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>
                    No advance payment required. Medicine will be reserved strictly for 2 hours.
                  </span>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  isLoading={isReserving}
                  onClick={handleConfirmReservation}
                  className="w-full h-11"
                >
                  <span>Confirm 2-Hour Hold</span>
                </Button>
              </>
            ) : (
              /* Hold Pass Confirmation Card */
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Courtesy Hold Active!
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Show this pass at the counter to collect your medication.
                  </p>
                </div>

                {/* Token Pass Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>DIGITAL PASS</span>
                    <span className="text-emerald-400 font-bold">{confirmedReservation.counterNumber}</span>
                  </div>

                  <div className="py-2 border-y border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">RESERVATION TOKEN</p>
                      <p className="text-2xl font-bold tracking-wider text-white">
                        {confirmedReservation.token}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">SMS COUNTER PIN</p>
                      <p className="text-2xl font-bold tracking-wider text-emerald-400">
                        {confirmedReservation.smsPin}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>EXPIRES IN: 2 HOURS</span>
                    <span className="text-white font-bold">₹{confirmedReservation.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setSelectedMedicine(null);
                      setConfirmedReservation(null);
                    }}
                    className="flex-1"
                  >
                    <span>Done</span>
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/customer/dashboard')}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="flex-1"
                  >
                    <span>View in Dashboard</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default SearchPage;
