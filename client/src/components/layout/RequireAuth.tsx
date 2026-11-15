import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';

interface RequireAuthProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-teal-800/20 border-t-teal-800 rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
          Verifying Clinical Authentication...
        </p>
      </div>
    );
  }

  // If user is not authenticated, redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role-based permission check is requested
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective authorized dashboard
    const defaultDashboard =
      user.role === 'PHARMACY'
        ? '/pharmacy/dashboard'
        : user.role === 'ADMIN'
        ? '/admin/dashboard'
        : '/customer/dashboard';

    return <Navigate to={defaultDashboard} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
