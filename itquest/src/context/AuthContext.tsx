import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-fetch profile pagka-load o pag-refresh ng app
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Invalid token or session expired:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 🌟 REAL-TIME XP & LEVEL SYNC LISTENER
  useEffect(() => {
    const handleUserStatsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const xpGained = customEvent.detail?.xpGained || 0;

      setUser((prevUser: any) => {
        if (!prevUser) return null;

        const currentXp = Number(prevUser.total_xp || prevUser.xp || 0);
        const updatedXp = currentXp + Number(xpGained);

        return {
          ...prevUser,
          total_xp: updatedXp,
          xp: updatedXp,
        };
      });
    };

    window.addEventListener('user:stats-updated', handleUserStatsUpdate);
    return () => {
      window.removeEventListener('user:stats-updated', handleUserStatsUpdate);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        const { accessToken, user: userData } = res.data;

        localStorage.setItem('token', accessToken);
        setUser(userData);

        return { success: true, user: userData };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Failed to login';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);

      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data?.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const message = error.response?.data?.message || 'Failed to register';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

