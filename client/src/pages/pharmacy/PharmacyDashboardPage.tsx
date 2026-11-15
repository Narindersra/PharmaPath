import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import {
  Package,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  UploadCloud,
  Download,
  ShieldCheck,
  X,
  ChevronDown,
  LogOut,
  Menu,
  FileSpreadsheet,
  Bell,
  Thermometer,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileCheck2,
  Settings,
  User,
  CheckCircle2,
  Check,
  RefreshCw,
  Activity,
  ChevronRight
} from 'lucide-react';

interface MedicineRosterItem {
  id: string;
  initials: string;
  initialsBg: string;
  initialsColor: string;
  name: string;
  generic: string;
  badgeText: string;
  badgeType: 'low-stock' | 'expiring' | 'optimal' | 'cold-chain';
  batchNo: string;
  expiryDate: string;
  rack: string;
  stockQty: number;
  stockUnit: string;
  minQty: number;
  price: number;
  actionType: 'reorder' | 'return-lot' | 'adjust';
  category: 'all' | 'low-stock' | 'near-expiry' | 'cold-chain' | 'schedule-h';
}

const INITIAL_ROSTER: MedicineRosterItem[] = [
  {
    id: 'med-1',
    initials: 'DL',
    initialsBg: 'bg-amber-100',
    initialsColor: 'text-amber-900',
    name: 'Dolo 650mg Tablet',
    generic: 'Paracetamol 650mg + Micro-crystalline Cellulose',
    badgeText: 'Low Stock',
    badgeType: 'low-stock',
    batchNo: 'BT-9921',
    expiryDate: '09/26',
    rack: 'Rack A-04',
    stockQty: 12,
    stockUnit: 'Strips',
    minQty: 50,
    price: 32.5,
    actionType: 'reorder',
    category: 'low-stock'
  },
  {
    id: 'med-2',
    initials: 'AG',
    initialsBg: 'bg-rose-100',
    initialsColor: 'text-rose-900',
    name: 'Augmentin 625 Duo',
    generic: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    badgeText: 'Expiring 28d',
    badgeType: 'expiring',
    batchNo: 'AUG-442',
    expiryDate: '01/25',
    rack: 'Rack B-12',
    stockQty: 45,
    stockUnit: 'Strips',
    minQty: 30,
    price: 204.0,
    actionType: 'return-lot',
    category: 'near-expiry'
  },
  {
    id: 'med-3',
    initials: 'PD',
    initialsBg: 'bg-emerald-100',
    initialsColor: 'text-emerald-900',
    name: 'Pan-D Capsule (Strip of 15)',
    generic: 'Pantoprazole (40mg) + Domperidone (30mg)',
    badgeText: 'Optimal',
    badgeType: 'optimal',
    batchNo: 'PND-108',
    expiryDate: '11/26',
    rack: 'Rack A-02',
    stockQty: 140,
    stockUnit: 'Strips',
    minQty: 40,
    price: 198.0,
    actionType: 'adjust',
    category: 'all'
  },
  {
    id: 'med-4',
    initials: 'TL',
    initialsBg: 'bg-emerald-100',
    initialsColor: 'text-emerald-900',
    name: 'Telma 40mg Tablet',
    generic: 'Telmisartan (40mg) + Chlorthalidone (12.5mg)',
    badgeText: 'Optimal',
    badgeType: 'optimal',
    batchNo: 'TL-882',
    expiryDate: '07/25',
    rack: 'Rack C-01',
    stockQty: 88,
    stockUnit: 'Strips',
    minQty: 25,
    price: 245.0,
    actionType: 'adjust',
    category: 'schedule-h'
  },
  {
    id: 'med-5',
    initials: 'IN',
    initialsBg: 'bg-sky-100',
    initialsColor: 'text-sky-900',
    name: 'Insulin Mixtard 30/70',
    generic: 'Isophane Insulin Human Suspension 100 IU/ml',
    badgeText: 'Cold Chain (4°C)',
    badgeType: 'cold-chain',
    batchNo: 'IN-5501',
    expiryDate: '03/26',
    rack: 'Cold Vault #2',
    stockQty: 8,
    stockUnit: 'Vials',
    minQty: 20,
    price: 178.5,
    actionType: 'reorder',
    category: 'cold-chain'
  },
  {
    id: 'med-6',
    initials: 'TH',
    initialsBg: 'bg-emerald-100',
    initialsColor: 'text-emerald-900',
    name: 'Thyronorm 50mcg Tablet',
    generic: 'Thyroxine Sodium • Abbott Formulations',
    badgeText: 'Optimal',
    badgeType: 'optimal',
    batchNo: 'TH-302',
    expiryDate: '08/26',
    rack: 'Rack B-03',
    stockQty: 64,
    stockUnit: 'Bottles',
    minQty: 20,
    price: 145.2,
    actionType: 'adjust',
    category: 'all'
  }
];

export interface PharmacyReservationItem {
  _id: string;
  token: string;
  smsPin: string;
  counterNumber: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COLLECTED' | 'REJECTED' | 'CANCELLED';
  expiresAt: string;
  notes?: string;
  createdAt: string;
  customerId?: {
    name: string;
    email: string;
    phone?: string;
  };
  medicineId?: {
    _id: string;
    name: string;
    genericName: string;
    requiresPrescription?: boolean;
    isColdChain?: boolean;
    batchNumber?: string;
    rackLocation?: string;
  };
}

export interface BackendMedicineItem {
  _id: string;
  name: string;
  genericName: string;
  price: number;
  stock: number;
  minStockAlert?: number;
  expiryDate: string;
  batchNumber?: string;
  rackLocation?: string;
  isColdChain?: boolean;
  requiresPrescription?: boolean;
}

const mapBackendToRoster = (med: BackendMedicineItem): MedicineRosterItem => {
  const isCold = med.isColdChain ?? false;
  const initials = (med.name || 'MD').substring(0, 2).toUpperCase();
  const minStock = med.minStockAlert || 20;

  let badgeText = 'Optimal';
  let badgeType: 'low-stock' | 'expiring' | 'optimal' | 'cold-chain' = 'optimal';

  if (isCold) {
    badgeText = 'Cold Chain (4°C)';
    badgeType = 'cold-chain';
  } else if (med.stock < minStock) {
    badgeText = 'Low Stock';
    badgeType = 'low-stock';
  } else if (med.expiryDate) {
    const diffDays = (new Date(med.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24);
    if (diffDays > 0 && diffDays < 60) {
      badgeText = `Expiring ${Math.ceil(diffDays)}d`;
      badgeType = 'expiring';
    }
  }

  return {
    id: med._id,
    initials,
    initialsBg: isCold ? 'bg-sky-100' : 'bg-emerald-100',
    initialsColor: isCold ? 'text-sky-900' : 'text-emerald-900',
    name: med.name,
    generic: med.genericName,
    badgeText,
    badgeType,
    batchNo: med.batchNumber || 'BT-2026',
    expiryDate: med.expiryDate,
    rack: med.rackLocation || 'Rack A-01',
    stockQty: med.stock,
    stockUnit: 'Strips',
    minQty: minStock,
    price: med.price,
    actionType: med.stock < minStock ? 'reorder' : 'adjust',
    category: isCold ? 'cold-chain' : med.requiresPrescription ? 'schedule-h' : 'all',
  };
};

export const PharmacyDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'notifications' | 'reservations' | 'batch-expiry' | 'csv-sync' | 'license' | 'settings'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search & Filter state for Roster
  const [rosterSearch, setRosterSearch] = useState('');
  const [activeRosterFilter, setActiveRosterFilter] = useState<'all' | 'low-stock' | 'near-expiry' | 'cold-chain' | 'schedule-h'>('all');
  const [rosterItems, setRosterItems] = useState<MedicineRosterItem[]>(INITIAL_ROSTER);
  const [reservations, setReservations] = useState<PharmacyReservationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSKUs: 6,
    totalStockUnits: 848,
    totalInventoryValue: 72901,
    lowStockCount: 1,
  });

  // Add Stock Modal state
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedGeneric, setNewMedGeneric] = useState('');
  const [newMedBatch, setNewMedBatch] = useState('');
  const [newMedRack, setNewMedRack] = useState('');
  const [newMedQty, setNewMedQty] = useState('');
  const [newMedPrice, setNewMedPrice] = useState('');
  const [newMedExpiry, setNewMedExpiry] = useState('');
  const [isColdChain, setIsColdChain] = useState(false);

  // Global search input state
  const [globalSearch, setGlobalSearch] = useState('');

  // Fetch Inventory from Database
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{
        success: boolean;
        data: BackendMedicineItem[];
        stats?: {
          totalSKUs: number;
          totalStockUnits: number;
          totalInventoryValue: number;
          lowStockCount: number;
        };
      }>('/inventory');
      if (res?.data && res.data.length > 0) {
        setRosterItems(res.data.map(mapBackendToRoster));
      }
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load inventory from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Reservations from Database
  const fetchReservations = useCallback(async () => {
    try {
      const res = await apiFetch<{
        success: boolean;
        data: PharmacyReservationItem[];
        activeHoldsCount?: number;
      }>('/reservations/pharmacy');
      if (res?.data) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    apiFetch<{
      success: boolean;
      data: BackendMedicineItem[];
      stats?: {
        totalSKUs: number;
        totalStockUnits: number;
        totalInventoryValue: number;
        lowStockCount: number;
      };
    }>('/inventory')
      .then((res) => {
        if (isMounted) {
          if (res?.data && res.data.length > 0) {
            setRosterItems(res.data.map(mapBackendToRoster));
          }
          if (res?.stats) {
            setStats(res.stats);
          }
        }
      })
      .catch((err) => console.error('Failed to load inventory:', err));

    apiFetch<{
      success: boolean;
      data: PharmacyReservationItem[];
    }>('/reservations/pharmacy')
      .then((res) => {
        if (isMounted && res?.data) {
          setReservations(res.data);
        }
      })
      .catch((err) => console.error('Failed to load reservations:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Quick Reorder / Adjustment
  const handleItemAction = async (id: string, action: string) => {
    if (action === 'reorder') {
      alert(`PO Draft generated for SKU ${id}. Sent to preferred distributor!`);
    } else if (action === 'return-lot') {
      alert(`Debit Note / Return voucher generated for Batch ${id}.`);
    } else {
      const currentItem = rosterItems.find((i) => i.id === id);
      const newStock = (currentItem?.stockQty || 0) + 10;
      setRosterItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stockQty: newStock } : item
        )
      );

      // Persist stock adjustment to database
      try {
        await apiFetch(`/inventory/${id}`, {
          method: 'PUT',
          body: { stock: newStock },
        });
        fetchInventory();
      } catch (err) {
        console.error('Failed to adjust stock:', err);
      }
    }
  };

  // Handle Delete Medicine
  const handleDeleteMedicine = async (id: string) => {
    if (!confirm('Are you sure you want to remove this medicine SKU from inventory?')) return;
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
      setRosterItems((prev) => prev.filter((item) => item.id !== id));
      fetchInventory();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete medicine');
    }
  };

  // Handle Add Medicine Submit
  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    try {
      const payload = {
        name: newMedName.trim(),
        genericName: newMedGeneric.trim() || 'Formulation Salt Compound',
        batchNumber: newMedBatch.trim() || `BT-${Math.floor(1000 + Math.random() * 9000)}`,
        rackLocation: newMedRack.trim() || 'Rack A-01',
        stock: parseInt(newMedQty, 10) || 50,
        price: parseFloat(newMedPrice) || 120.0,
        expiryDate: newMedExpiry.trim() || '2027-12-31',
        isColdChain,
      };

      const res = await apiFetch<{ success: boolean; data: BackendMedicineItem }>('/inventory', {
        method: 'POST',
        body: payload,
      });

      if (res?.data) {
        const mapped = mapBackendToRoster(res.data);
        setRosterItems((prev) => [mapped, ...prev]);
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to add medicine:', err);
      alert((err as Error).message || 'Failed to add medicine to inventory');
    }

    setShowAddStockModal(false);
    setNewMedName('');
    setNewMedGeneric('');
    setNewMedBatch('');
    setNewMedRack('');
    setNewMedQty('');
    setNewMedPrice('');
    setNewMedExpiry('');
    setIsColdChain(false);
  };

  // Handle Reservation status update (Accept, Reject, Mark Collected)
  const handleReservationStatusChange = async (
    reservationId: string,
    status: 'CONFIRMED' | 'REJECTED' | 'COLLECTED'
  ) => {
    try {
      await apiFetch(`/reservations/${reservationId}/status`, {
        method: 'PATCH',
        body: { status },
      });
      fetchReservations();
      fetchInventory();
    } catch (err) {
      console.error('Failed to update reservation status:', err);
      alert((err as Error).message || 'Failed to update reservation status');
    }
  };

  // Filtered roster
  const filteredRoster = rosterItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      item.generic.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      item.rack.toLowerCase().includes(rosterSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (activeRosterFilter === 'all') return true;
    if (activeRosterFilter === 'low-stock') return item.stockQty < item.minQty;
    if (activeRosterFilter === 'near-expiry') return item.badgeType === 'expiring';
    if (activeRosterFilter === 'cold-chain') return item.badgeType === 'cold-chain';
    if (activeRosterFilter === 'schedule-h') return item.category === 'schedule-h';
    return true;
  });

  return (
    <div className="bg-[#f8f9fa] font-sans text-slate-800 antialiased min-h-screen flex selection:bg-teal-500/10 selection:text-teal-800">
      {/* =========================================================================
          LEFT SIDEBAR (Matches Landing Page Logo & Name + Settings at bottom)
          ========================================================================= */}
      <aside
        className={`fixed lg:sticky top-0 z-40 w-64 h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* Top Website Logo & Brand (matching Landing Page exactly) */}
          <div className="px-2 pt-1 pb-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="PharmaPath Logo"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span className="font-display text-[17px] tracking-tight text-slate-charcoal font-bold">
                PharmaPath
              </span>
            </Link>
          </div>

          {/* MAIN MENU SECTION */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>MAIN MENU</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeTab === 'overview' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Overview</span>
              </div>
              {activeTab === 'overview' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('inventory');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Inventory</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('notifications');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${activeTab === 'notifications' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Notifications</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                3
              </span>
            </button>
          </div>

          {/* DISPENSARY OPS SECTION */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>DISPENSARY OPS</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

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
                <span>Hold Reservations</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                7 pending
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('batch-expiry');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'batch-expiry'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-4 h-4 ${activeTab === 'batch-expiry' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Batch &amp; Expiry</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
                2 critical
              </span>
            </button>

            {/* CSV Bulk Sync - Added as requested by user */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('csv-sync');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'csv-sync'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className={`w-4 h-4 ${activeTab === 'csv-sync' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>CSV Bulk Sync</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-100 text-slate-600">
                Marg/Vyapar
              </span>
            </button>

            {/* Drug License & CDSCO - Added as requested by user */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('license');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'license'
                  ? 'bg-slate-50 text-slate-900 font-bold shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className={`w-4 h-4 ${activeTab === 'license' ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>Drug License (DL)</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Form 20/21
              </span>
            </button>
          </div>
        </div>

        {/* Pharmacist Footer Card with Settings Placed at the Bottom */}
        <div className="p-4 border-t border-slate-200/80 space-y-2">
          {/* Settings Button (Placed at the bottom as requested) */}
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

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'RK'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.name || 'Dr. Rajesh Kumar'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user?.email || 'KA-BLR-2024-88491'}
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
        {/* Top Header Bar with Centered Search */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-900 text-sm hidden sm:inline">
                Dashboard
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs text-slate-500 font-medium capitalize hidden sm:inline">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Center: Search Bar (Centered) */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search medicine, salt, patient, or token..."
                className="w-full h-9 pl-9 pr-10 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-teal-700 outline-none transition-all shadow-2xs"
              />
              <span className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-bold">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddStockModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* =========================================================================
              VIEW: OVERVIEW (Updated for Live Dispensary Counter Operations)
              ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Title & Operational Status Strip */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                      Dispensary Operations Dashboard
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>ONLINE &amp; ACCEPTING HOLDS</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Apex Medico &amp; Pharmacy • Koramangala 4th Block, Bengaluru • Operating 09:00 AM – 10:00 PM
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
                    <Activity className="w-3.5 h-3.5 text-teal-700" />
                    <span className="font-mono text-[11px]">Marg ERP Sync: 2m ago</span>
                    <button
                      type="button"
                      onClick={() => alert('Marg ERP inventory refreshed: 3,420 SKUs synchronized!')}
                      className="p-1 text-slate-400 hover:text-teal-800 transition-colors cursor-pointer"
                      title="Sync POS Now"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-mono shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DL KA-BLR-2024-88491</span>
                  </span>
                </div>
              </div>

              {/* LIVE INVENTORY METRICS & ALERTS STRIP (4 Key Operational KPI Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1: Pending Patient Holds */}
                <div
                  onClick={() => setActiveTab('reservations')}
                  className="bg-white rounded-2xl p-5 border border-amber-200/90 bg-gradient-to-b from-amber-50/30 to-white shadow-2xs hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                      Action Required
                    </span>
                    <Clock className="w-4 h-4 text-amber-700" />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {reservations.filter((r) => r.status === 'CONFIRMED' || r.status === 'PENDING').length} Holds
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-800 mt-0.5">
                      Respond within 30 minutes
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Patients awaiting hold confirmation</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Card 2: Active 2-Hour Holds */}
                <div
                  onClick={() => setActiveTab('reservations')}
                  className="bg-white rounded-2xl p-5 border border-teal-200/90 bg-gradient-to-b from-teal-50/20 to-white shadow-2xs hover:border-teal-500 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-100 text-teal-800">
                      Counter Hold Active
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {reservations.filter((r) => r.status === 'CONFIRMED').length} Patients
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-800 mt-0.5">
                      Held at counter for pickup
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Locked in dispense queue</span>
                    <ChevronRight className="w-3.5 h-3.5 text-teal-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Card 3: Today's Dispensed Revenue */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Inventory Valuation
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-700" />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                        ₹{stats.totalInventoryValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {stats.totalStockUnits} Total Stock Units
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">100% counter verified</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Card 4: Live Stock Catalog */}
                <div
                  onClick={() => setActiveTab('inventory')}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-slate-400 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                      Live on PharmaPath
                    </span>
                    <Package className="w-4 h-4 text-slate-700" />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {stats.totalSKUs} SKUs
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {stats.lowStockCount} Low Stock Alert
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Available to nearby patients</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* TWO COLUMN WORKSPACE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* =========================================================================
                    LEFT COLUMN: LIVE COUNTER DISPENSING & STOCK ROSTER (8 Cols)
                    ========================================================================= */}
                <div className="lg:col-span-8 space-y-6">
                  {/* SECTION 1: INCOMING PATIENT RESERVATIONS (ACTION QUEUE) */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-base font-bold text-slate-900">
                            Live Patient Holds &amp; Dispensing Queue
                          </h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                            3 Pending Action
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Confirm hold within 30 minutes. Held medicines are reserved for 2 hours for patient counter pickup.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('reservations')}
                        className="text-xs font-semibold text-teal-800 hover:underline hidden sm:flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All (7)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Active Queue List */}
                    <div className="divide-y divide-slate-100">
                      {reservations.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 font-mono">
                          No active holds or incoming patient reservations at this moment.
                        </div>
                      ) : (
                        reservations.slice(0, 5).map((res) => (
                          <div
                            key={res._id}
                            className={`py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                              res.status === 'CONFIRMED' ? 'bg-emerald-50/20 -mx-2 px-2 rounded-xl' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                                  #{res.token}
                                </span>
                                <span
                                  className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    res.status === 'CONFIRMED'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : res.status === 'COLLECTED'
                                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {res.status === 'CONFIRMED' ? 'Held at Counter' : res.status}
                                </span>
                                {res.medicineId?.requiresPrescription && (
                                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                                    Rx Required
                                  </span>
                                )}
                                <span className="text-[11px] font-mono text-amber-700 font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>SMS PIN: {res.smsPin}</span>
                                </span>
                              </div>

                              <p className="text-sm font-bold text-slate-900">
                                {res.quantity}x {res.medicineId?.name || 'Prescription Medicine'}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {res.medicineId?.genericName || 'Verified batch'}
                              </p>

                              <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-slate-400" /> {res.customerId?.name || 'Patient'}
                                </span>
                                <span>•</span>
                                <span className="font-mono">{res.customerId?.phone || '+91 98765 43210'}</span>
                                <span>•</span>
                                <span className="font-mono font-bold text-slate-900">₹{res.totalPrice.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {res.status === 'CONFIRMED' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleReservationStatusChange(res._id, 'REJECTED')}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    Release Hold
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReservationStatusChange(res._id, 'COLLECTED')}
                                    className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark Dispensed</span>
                                  </button>
                                </>
                              ) : res.status === 'COLLECTED' ? (
                                <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  ✓ Dispensed
                                </span>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleReservationStatusChange(res._id, 'REJECTED')}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReservationStatusChange(res._id, 'CONFIRMED')}
                                    className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept &amp; Hold</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: FAST COUNTER INVENTORY AVAILABILITY & STOCK ADJUSTER */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                            <span>High-Demand Medicine Availability</span>
                            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />}
                          </h2>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            Live Patient Index
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Patients see these quantities in real-time search results within 5km of your pharmacy.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {(['all', 'low-stock', 'cold-chain'] as const).map((fk) => (
                            <button
                              key={fk}
                              type="button"
                              onClick={() => setActiveRosterFilter(fk)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                activeRosterFilter === fk
                                  ? 'bg-slate-900 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {fk.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            value={rosterSearch}
                            onChange={(e) => setRosterSearch(e.target.value)}
                            placeholder="Filter medicine or batch..."
                            className="h-8 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-teal-700 w-36 sm:w-44"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px]">
                            <th className="pb-3 font-semibold">Medicine &amp; Salt</th>
                            <th className="pb-3 font-semibold">Location</th>
                            <th className="pb-3 font-semibold">Price</th>
                            <th className="pb-3 font-semibold">Available Stock</th>
                            <th className="pb-3 font-semibold text-right">Quick Stock Counter</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredRoster.slice(0, 6).map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3">
                                <p className="font-bold text-slate-900">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{item.generic}</p>
                              </td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                                  {item.rack}
                                </span>
                              </td>
                              <td className="py-3 font-mono font-bold text-slate-900">
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                    item.stockQty < item.minQty
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {item.stockQty} {item.stockUnit}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleItemAction(item.id, 'adjust')}
                                    className="px-2 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 font-mono text-slate-700 text-xs font-semibold cursor-pointer"
                                  >
                                    -1
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleItemAction(item.id, 'adjust')}
                                    className="px-2.5 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 font-mono text-slate-700 text-xs font-semibold cursor-pointer"
                                  >
                                    +5
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleItemAction(item.id, 'adjust')}
                                    className="px-2.5 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold cursor-pointer shadow-2xs"
                                  >
                                    +20
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* =========================================================================
                    RIGHT COLUMN: COUNTER ACTIVITY & STORAGE MONITOR (4 Cols)
                    ========================================================================= */}
                <div className="lg:col-span-4 space-y-5">
                  {/* WIDGET 1: RECENT COUNTER PICKUPS AUDIT */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-display text-xs font-bold text-slate-900">
                            Recent Counter Pickups
                          </h3>
                          <p className="text-[10px] text-slate-400">Verified patient handovers</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        18 Today
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Sunil Gowda</span>
                          <span className="font-mono font-bold text-xs text-slate-900">₹119.50</span>
                        </div>
                        <p className="text-[11px] text-slate-600">1x Azithral 500mg (Strip of 5)</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                          <span>Token #TKN-8485</span>
                          <span>25 mins ago</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Meera Nair</span>
                          <span className="font-mono font-bold text-xs text-slate-900">₹32.50</span>
                        </div>
                        <p className="text-[11px] text-slate-600">1x Dolo 650mg Tablet</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                          <span>Token #TKN-8482</span>
                          <span>1 hour ago</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Amit Verma</span>
                          <span className="font-mono font-bold text-xs text-slate-900">₹198.00</span>
                        </div>
                        <p className="text-[11px] text-slate-600">1x Pan-D Capsule (Strip of 15)</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                          <span>Token #TKN-8479</span>
                          <span>2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 2: COLD CHAIN STORAGE MONITOR */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                          <Thermometer className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-display text-xs font-bold text-slate-900">
                            Cold Chain &amp; Sensitive Storage
                          </h3>
                          <p className="text-[10px] text-slate-400">Insulins &amp; Biologics Telemetry</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Normal
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                        <p className="text-[10px] font-mono text-slate-400">Chiller Vault #01</p>
                        <p className="font-display text-2xl font-bold font-mono text-slate-900">4.2°C</p>
                        <p className="text-[9px] font-mono text-slate-400">Target: 2°C - 8°C</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
                        <p className="text-[10px] font-mono text-slate-400">Deep Freeze #02</p>
                        <p className="font-display text-2xl font-bold font-mono text-slate-900">-18.5°C</p>
                        <p className="text-[9px] font-mono text-slate-400">Stable (-20°C)</p>
                      </div>
                    </div>
                  </div>

                  {/* WIDGET 3: CDSCO COMPLIANCE BANNER */}
                  <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-2xl p-5 text-white space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-display text-xs font-bold text-white">
                        CDSCO Prescription Protocol
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Pharmacists must physically inspect original signed doctor prescriptions for all Schedule H &amp; H1 medicines before marking handovers as &quot;Dispensed&quot;.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>License: Form 20 &amp; 21</span>
                      <span className="text-emerald-400 font-bold">100% Audit Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: CSV BULK SYNC (Requested by user in menu)
              ========================================================================= */}
          {activeTab === 'csv-sync' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Bulk Inventory Sync (CSV / Marg ERP)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Import entire stock files directly from Marg ERP, Vyapar, or download the official template.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-5 h-5 text-teal-800" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        PharmaPath Official CSV Format
                      </h3>
                      <p className="text-xs text-slate-400">Standard columns mapping</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('PharmaPath_Inventory_Template.csv downloaded!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-teal-800 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Template</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 font-mono space-y-1">
                  <p>Required header row:</p>
                  <p className="text-[11px] text-slate-800 font-bold bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                    medicine_name, generic_salt, batch_no, rack_code, mrp, selling_price, stock_qty, expiry_date, is_cold_chain
                  </p>
                </div>

                {/* Dropzone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-teal-700 rounded-2xl p-8 text-center space-y-3 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Select CSV or Marg ERP Export file
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Supports .csv, .xlsx up to 25MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    id="csv-upload-input"
                    className="hidden"
                    onChange={() => alert('Sample file parsed: 184 SKUs verified ready for live network indexing!')}
                  />
                  <label
                    htmlFor="csv-upload-input"
                    className="inline-block px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Browse Files
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: DRUG LICENSE (DL) & CDSCO VERIFICATION (Requested by user in menu)
              ========================================================================= */}
          {activeTab === 'license' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Drug License &amp; CDSCO Verification
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulatory compliance documents under the Drugs and Cosmetics Act, 1940
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Form 20 &amp; Form 21 Retail License
                      </h3>
                      <p className="text-xs font-mono text-emerald-700 font-semibold">
                        STATUS: ACTIVE &amp; VERIFIED BY DRUG CONTROLLER
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    VALID TILL 2029
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Drug License Number
                    </span>
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      KA-BLR-2024-88491
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Registered Pharmacist
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      Dr. Rajesh Kumar (Reg #KSPC-44912)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      Dispensary Address
                    </span>
                    <p className="text-slate-800 font-medium">
                      #42, 80 Feet Road, Koramangala 4th Block, Bengaluru - 560034
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      GSTIN
                    </span>
                    <p className="font-mono font-bold text-slate-900">
                      29AAAAA0000A1Z5
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold">CDSCO Scheduled Drug Verification Requirement:</p>
                  <p className="leading-relaxed text-[11px] text-amber-800">
                    All Schedule H and H1 medicines reserved through PharmaPath require physical verification of the original signed prescription at the dispensary counter before marking "Dispensed".
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: SETTINGS (Added as requested by user)
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Dispensary &amp; Terminal Settings
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure store timings, ERP synchronization frequency, and alert thresholds.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Dispensary settings updated successfully!');
                }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6"
              >
                {/* 1. Dispensary Profile Settings */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    1. Dispensary Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Dispensary Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="e.g. Apollo Pharmacy"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Chief Pharmacist
                      </label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="Chief Pharmacist Name"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Dispensary Counter Address
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      placeholder="Dispensary counter address"
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                    />
                  </div>
                </div>

                {/* 2. Store Hours */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    2. Operating Hours &amp; Emergency Dispensary
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Opening Time
                      </label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="09:00 AM"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Closing Time
                      </label>
                      <input
                        type="text"
                        defaultValue=""
                        placeholder="10:00 PM"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-700 bg-slate-50 font-mono"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-teal-700 focus:ring-0 accent-teal-700 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Enable 24/7 Night Emergency Counter on PharmaPath Map
                    </span>
                  </label>
                </div>

                {/* 3. ERP Sync & Thresholds */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    3. Inventory &amp; POS Sync Preferences
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Marg ERP Auto Sync Interval
                      </label>
                      <select className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none bg-slate-50 cursor-pointer">
                        <option>Every 5 minutes (Real-time recommended)</option>
                        <option>Every 15 minutes</option>
                        <option>Hourly</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Low Stock Alert Threshold
                      </label>
                      <input
                        type="number"
                        defaultValue=""
                        placeholder="5"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-teal-700 bg-slate-50"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-teal-700 focus:ring-0 accent-teal-700 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Play audio chime when a patient reserves a medicine
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Dispensary Node: HYDERABAD-NODE-01
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW: INVENTORY FULL LIST (When user clicks Inventory tab)
              ========================================================================= */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                    Dispensary Medicine Catalog
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Total 3,420 SKUs indexed for patients across Bengaluru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px]">
                        <th className="pb-3 font-semibold">SKU / Medicine</th>
                        <th className="pb-3 font-semibold">Batch</th>
                        <th className="pb-3 font-semibold">Rack Location</th>
                        <th className="pb-3 font-semibold">Stock Level</th>
                        <th className="pb-3 font-semibold">Selling Price</th>
                        <th className="pb-3 font-semibold text-right">Quick Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRoster.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3">
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{item.generic}</p>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-700">
                            {item.batchNo}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold">
                              {item.rack}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                item.stockQty < item.minQty
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.stockQty} {item.stockUnit}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleItemAction(item.id, 'adjust')}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
                                title="Add 10 units to stock"
                              >
                                +10 Units
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMedicine(item.id)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                                title="Delete medicine from inventory"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: HOLD RESERVATIONS (When user clicks Hold Reservations tab)
              ========================================================================= */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Hold Reservations ({reservations.filter((r) => r.status === 'CONFIRMED' || r.status === 'PENDING').length} Active)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient courtesy 2-hour holds awaiting counter verification &amp; pickup.
                </p>
              </div>

              <div className="space-y-3">
                {reservations.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-xs text-slate-400 font-mono">
                    No active hold reservations currently in queue.
                  </div>
                ) : (
                  reservations.map((res) => (
                    <div
                      key={res._id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            #{res.token}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                              res.status === 'CONFIRMED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : res.status === 'COLLECTED'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {res.status}
                          </span>
                          {res.medicineId?.requiresPrescription && (
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                              Rx Required
                            </span>
                          )}
                          <span className="font-mono text-xs text-amber-700 font-bold">
                            SMS PIN: {res.smsPin}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">
                          {res.quantity}x {res.medicineId?.name || 'Medicine SKU'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {res.customerId?.name || 'Customer'} • {res.customerId?.phone || '+91 98765 43210'} •{' '}
                          <span className="font-mono font-bold text-slate-900">₹{res.totalPrice.toFixed(2)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status === 'CONFIRMED' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReservationStatusChange(res._id, 'REJECTED')}
                              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                            >
                              Release Hold
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReservationStatusChange(res._id, 'COLLECTED')}
                              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Dispensed</span>
                            </button>
                          </>
                        ) : res.status === 'COLLECTED' ? (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✓ Dispensed at Counter
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReservationStatusChange(res._id, 'REJECTED')}
                              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReservationStatusChange(res._id, 'CONFIRMED')}
                              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept &amp; Hold</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: BATCH & EXPIRY ALERT (When user clicks Batch & Expiry tab)
              ========================================================================= */}
          {activeTab === 'batch-expiry' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Batch &amp; Expiry Sentinel
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  12 Batches expiring within 60 days • Automatic distributor return lot generator
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                    <p className="text-xs text-rose-900 font-semibold">
                      Action Required: 2 Batches have under 30 days of shelf life remaining.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Batch Return Voucher generated for distributor pick-up!')}
                    className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shadow-xs cursor-pointer"
                  >
                    Generate Return Lot
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {rosterItems
                    .filter((i) => i.badgeType === 'expiring' || i.badgeType === 'low-stock')
                    .map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">
                            Batch: {item.batchNo} • Expiry: {item.expiryDate} • Location: {item.rack}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-slate-900">
                            {item.stockQty} {item.stockUnit}
                          </p>
                          <span className="text-[10px] font-mono text-rose-700 font-bold">
                            ₹{(item.stockQty * item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW: NOTIFICATIONS
              ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                  Dispensary Notifications
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time alerts from Marg ERP, customer reservation requests, and CDSCO updates.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs divide-y divide-slate-100">
                <div className="py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Marg ERP Automated Sync Completed</p>
                    <p className="text-[11px] text-slate-500">4 minutes ago • 3,420 SKUs refreshed successfully with 0 conflicts.</p>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">New Reservation Request (TKN-8491)</p>
                    <p className="text-[11px] text-slate-500">18 minutes ago • Ramesh P. Sharma reserved 2x Augmentin 625 Duo.</p>
                  </div>
                </div>

                <div className="py-3 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cold Chain IoT Temperature Normal</p>
                    <p className="text-[11px] text-slate-500">1 hour ago • Chiller Vault #01 holding 4.2°C (optimal 2°C - 8°C).</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          + ADD STOCK MODAL (Opens via "+ Add Stock" button in Header)
          ========================================================================= */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">
                  Add New Stock to Dispensary
                </h3>
                <p className="text-xs text-slate-500">Index formulation rack location &amp; batch</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStockModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedName">
                  Medicine Brand Name
                </label>
                <input
                  id="modalMedName"
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Dolo 650mg Tablet"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedGeneric">
                  Generic Salt &amp; Composition
                </label>
                <input
                  id="modalMedGeneric"
                  type="text"
                  required
                  value={newMedGeneric}
                  onChange={(e) => setNewMedGeneric(e.target.value)}
                  placeholder="e.g. Paracetamol (650mg)"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedBatch">
                    Batch Number
                  </label>
                  <input
                    id="modalMedBatch"
                    type="text"
                    required
                    value={newMedBatch}
                    onChange={(e) => setNewMedBatch(e.target.value)}
                    placeholder="BT-9921"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedRack">
                    Rack / Storage Location
                  </label>
                  <input
                    id="modalMedRack"
                    type="text"
                    required
                    value={newMedRack}
                    onChange={(e) => setNewMedRack(e.target.value)}
                    placeholder="Rack A-04 or Cold Vault #1"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedQty">
                    Quantity (Strips/Units)
                  </label>
                  <input
                    id="modalMedQty"
                    type="number"
                    required
                    value={newMedQty}
                    onChange={(e) => setNewMedQty(e.target.value)}
                    placeholder="50"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedPrice">
                    Selling Price (₹)
                  </label>
                  <input
                    id="modalMedPrice"
                    type="number"
                    step="0.1"
                    required
                    value={newMedPrice}
                    onChange={(e) => setNewMedPrice(e.target.value)}
                    placeholder="32.50"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 outline-none focus:border-teal-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700" htmlFor="modalMedExpiry">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="modalMedExpiry"
                    type="text"
                    required
                    value={newMedExpiry}
                    onChange={(e) => setNewMedExpiry(e.target.value)}
                    placeholder="09/26"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isColdChain}
                    onChange={(e) => setIsColdChain(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-0 accent-teal-700 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Cold Chain Storage (Store in 2°C - 8°C Chiller Vault)
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Save &amp; Index Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboardPage;
