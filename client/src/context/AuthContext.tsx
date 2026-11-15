import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../lib/api';

export type UserRole = 'CUSTOMER' | 'PHARMACY' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  [key: string]: string | number | boolean | undefined;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper to determine role-based redirect URL
  const getRoleDashboard = (role: UserRole): string => {
    switch (role) {
      case 'PHARMACY':
        return '/pharmacy/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      case 'CUSTOMER':
      default:
        return '/customer/dashboard';
    }
  };

  // Check auth session on application startup
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ success: boolean; data: User }>('/auth/me');
        if (isMounted && res?.data) {
          setUser(res.data);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = () => setError(null);

  /**
   * Log in user, store profile, and route based on role
   */
  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: User }>('/auth/login', {
        email: email.trim(),
        password,
      });

      if (!res?.data) {
        throw new Error('Authentication succeeded but user profile was not returned');
      }

      setUser(res.data);
      const targetDashboard = getRoleDashboard(res.data.role);
      navigate(targetDashboard, { replace: true });
      return res.data;
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user, then optionally log them in, and route based on role
   */
  const register = async (userData: RegisterData): Promise<User> => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: User }>('/auth/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
        role: userData.role || 'CUSTOMER',
      });

      if (!res?.data) {
        throw new Error('Registration succeeded but user profile was not returned');
      }

      // Automatically log the user in to establish the httpOnly JWT cookie
      return await login(userData.email, userData.password);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out user, invalidate cookie, and redirect to /login
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
