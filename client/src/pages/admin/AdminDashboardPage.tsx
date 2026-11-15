import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShieldCheck,
  ShieldAlert,
  Package,
  Clock,
  CheckCircle2,
  Search,
  LogOut,
  RefreshCw,
  Building2,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/ui/Button';

interface AdminStats {
  users: {
    total: number;
    customers: number;
    pharmacies: number;
    verifiedPharmacies: number;
  };
  inventory: {
    totalMedicines: number;
    totalStockUnits: number;
    totalInventoryValue: number;
  };
  reservations: {
    total: number;
    activeHolds: number;
    collected: number;
  };
}

interface PharmacyRecord {
  id: string;
  name: string;
  email: string;
  pharmacyName: string;
  address: string;
  city: string;
  phone: string;
  licenseNumber: string;
  isVerified: boolean;
  rating: number;
  medicineCount: number;
  reservationCount: number;
  createdAt: string;
}

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'PHARMACY' | 'ADMIN';
  phone?: string;
  createdAt: string;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pharmacies' | 'users'>('pharmacies');

  const [stats, setStats] = useState<AdminStats>({
    users: { total: 0, customers: 0, pharmacies: 0, verifiedPharmacies: 0 },
    inventory: { totalMedicines: 0, totalStockUnits: 0, totalInventoryValue: 0 },
    reservations: { total: 0, activeHolds: 0, collected: 0 },
  });

  const [pharmacies, setPharmacies] = useState<PharmacyRecord[]>([]);
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'CUSTOMER' | 'PHARMACY' | 'ADMIN'>('all');

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiFetch<{ success: boolean; data: AdminStats }>('/admin/stats');
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }, []);

  const fetchPharmacies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; data: PharmacyRecord[] }>('/admin/pharmacies');
      if (res?.data) {
        setPharmacies(res.data);
      }
    } catch (err) {
      console.error('Failed to load pharmacies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ success: boolean; data: UserRecord[] }>('/admin/users');
      if (res?.data) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    apiFetch<{ success: boolean; data: AdminStats }>('/admin/stats')
      .then((res) => {
        if (isMounted && res?.data) setStats(res.data);
      })
      .catch((err) => console.error(err));

    apiFetch<{ success: boolean; data: PharmacyRecord[] }>('/admin/pharmacies')
      .then((res) => {
        if (isMounted && res?.data) setPharmacies(res.data);
      })
      .catch((err) => console.error(err));

    apiFetch<{ success: boolean; data: UserRecord[] }>('/admin/users')
      .then((res) => {
        if (isMounted && res?.data) setUsersList(res.data);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleVerify = async (pharmacyId: string, currentStatus: boolean) => {
    try {
      await apiFetch(`/admin/pharmacies/${pharmacyId}/verify`, {
        method: 'PATCH',
        body: { isVerified: !currentStatus },
      });
      fetchPharmacies();
      fetchStats();
    } catch (err) {
      alert((err as Error).message || 'Failed to toggle verification');
    }
  };

  const filteredPharmacies = pharmacies.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="bg-[#f8f9fa] font-sans text-slate-800 antialiased min-h-screen flex flex-col selection:bg-teal-500/10 selection:text-teal-800">
      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="PharmaPath Logo" className="w-8 h-8 rounded-lg object-contain" />
              <div className="flex flex-col">
                <span className="font-display text-base font-bold text-slate-900 leading-none">
                  PharmaPath
                </span>
                <span className="font-mono text-[10px] text-teal-800 uppercase font-bold tracking-wider mt-0.5">
                  Admin Sentinel
                </span>
              </div>
            </Link>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-200">
              System Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">{user?.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{user?.email}</span>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-6">
        {/* Platform Overview Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Platform Governance &amp; Dispensary Registry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live system telemetry, CDSCO compliance audit trails, and pharmacy partner verification.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              fetchStats();
              if (activeTab === 'pharmacies') fetchPharmacies();
              else fetchUsers();
            }}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            <span>Refresh Telemetry</span>
          </Button>
        </div>

        {/* Operational KPI Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Total Users
              </span>
              <Users className="w-4 h-4 text-teal-700" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 font-mono">
              {stats.users.total}
            </div>
            <p className="text-xs text-slate-500">
              {stats.users.customers} Patients • {stats.users.pharmacies} Dispensaries
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Verified Network
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 font-mono">
              {stats.users.verifiedPharmacies} / {stats.users.pharmacies}
            </div>
            <p className="text-xs text-slate-500">
              Accredited CDSCO Retail Pharmacies
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Live SKUs Indexed
              </span>
              <Package className="w-4 h-4 text-slate-700" />
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900 font-mono">
              {stats.inventory.totalMedicines} SKUs
            </div>
            <p className="text-xs text-slate-500">
              ₹{stats.inventory.totalInventoryValue.toLocaleString('en-IN')} Total Valuation
            </p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Active Holds
              </span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="font-display text-3xl font-extrabold text-teal-800 font-mono">
              {stats.reservations.activeHolds}
            </div>
            <p className="text-xs text-slate-500">
              {stats.reservations.total} Cumulative Prescriptions Held
            </p>
          </div>
        </div>

        {/* Tab Controls and Filter Strip */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pharmacies');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pharmacies'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-teal-700" />
              <span>Pharmacy Hubs ({pharmacies.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('users');
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-700" />
              <span>User Registry ({usersList.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus-within:border-teal-700 focus-within:bg-white transition-all w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'pharmacies' ? 'Search pharmacy, license...' : 'Search name, email...'}
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {activeTab === 'users' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'CUSTOMER' | 'PHARMACY' | 'ADMIN')}
                className="h-8 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="CUSTOMER">Customers</option>
                <option value="PHARMACY">Pharmacies</option>
                <option value="ADMIN">Admins</option>
              </select>
            )}
          </div>
        </div>

        {/* Tab 1: Pharmacies Management Table */}
        {activeTab === 'pharmacies' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Dispensary Hub</th>
                    <th className="py-3 px-4">License / Address</th>
                    <th className="py-3 px-4">Inventory SKUs</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPharmacies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">
                        No pharmacies matching query found.
                      </td>
                    </tr>
                  ) : (
                    filteredPharmacies.map((pharmacy) => (
                      <tr key={pharmacy.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-[13px]">{pharmacy.pharmacyName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{pharmacy.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pharmacy.licenseNumber || 'DL-2026-PH-001'}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{pharmacy.address || pharmacy.city}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-800">
                            {pharmacy.medicineCount} active SKUs
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {pharmacy.reservationCount} holds served
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          {pharmacy.isVerified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified CDSCO</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleVerify(pharmacy.id, pharmacy.isVerified)}
                            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                              pharmacy.isVerified
                                ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                                : 'bg-teal-800 hover:bg-teal-900 text-white shadow-2xs'
                            }`}
                          >
                            {pharmacy.isVerified ? (
                              <>
                                <X className="w-3.5 h-3.5" />
                                <span>Revoke</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify Dispensary</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: User Registry Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">System Role</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-mono">
                        No registered users found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : u.role === 'PHARMACY'
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
