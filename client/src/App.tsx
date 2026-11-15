import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/layout/RequireAuth';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/customer/DashboardPage';
import SearchPage from './pages/customer/SearchPage';
import PharmacyDashboardPage from './pages/pharmacy/PharmacyDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <RequireAuth allowedRoles={['CUSTOMER', 'ADMIN']}>
            <DashboardPage />
          </RequireAuth>
        }
      />
      {/* Fallback alias for /dashboard */}
      <Route
        path="/dashboard"
        element={<Navigate to="/customer/dashboard" replace />}
      />

      {/* Protected Pharmacy Routes */}
      <Route
        path="/pharmacy/dashboard"
        element={
          <RequireAuth allowedRoles={['PHARMACY', 'ADMIN']}>
            <PharmacyDashboardPage />
          </RequireAuth>
        }
      />
      {/* Fallback alias for /pharmacy */}
      <Route
        path="/pharmacy"
        element={<Navigate to="/pharmacy/dashboard" replace />}
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </RequireAuth>
        }
      />
      {/* Fallback alias for /admin */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SmoothScrollProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SmoothScrollProvider>
    </BrowserRouter>
  );
}

export default App;
