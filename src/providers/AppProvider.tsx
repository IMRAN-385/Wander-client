'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Toaster } from 'sonner';

interface AuthUser {
  _id: string; name: string; email: string; role: 'user' | 'admin'; avatar?: string; wishlist: string[];
}

interface AuthContextType {
  user: AuthUser | null; token: string | null;
  loading: boolean; isAuthenticated: boolean;
  login: (u: AuthUser, t: string) => void; logout: () => void;
  toggleWishlist: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, loading: true, isAuthenticated: false,
  login: () => {}, logout: () => {}, toggleWishlist: () => {},
});

export function useAuth() { return useContext(AuthContext); }

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem('wanderlust_token');
      const u = localStorage.getItem('wanderlust_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {} finally { setLoading(false); }
  }, []);

  const login = useCallback((u: AuthUser, t: string) => {
    setUser(u); setToken(t);
    localStorage.setItem('wanderlust_token', t);
    localStorage.setItem('wanderlust_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null); setToken(null);
    localStorage.removeItem('wanderlust_token');
    localStorage.removeItem('wanderlust_user');
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setUser(prev => {
      if (!prev) return null;
      const wishlist = prev.wishlist.includes(id)
        ? prev.wishlist.filter(w => w !== id)
        : [...prev.wishlist, id];
      const updated = { ...prev, wishlist };
      localStorage.setItem('wanderlust_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user && !!token, login, logout, toggleWishlist }}>
      {children}
      <Toaster position="top-center" richColors />
    </AuthContext.Provider>
  );
}