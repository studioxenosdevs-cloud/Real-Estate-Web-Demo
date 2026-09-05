'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  signIn: (email: string, name?: string) => void;
  signUp: (email: string, name: string) => void;
  signOut: () => void;
  savedHomes: number[];
  toggleSavedHome: (id: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedHomes, setSavedHomes] = useState<number[]>([]);

  const signIn = useCallback((email: string, name?: string) => {
    const displayName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setUser({ email, name: displayName });
  }, []);

  const signUp = useCallback((email: string, name: string) => {
    setUser({ email, name });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setSavedHomes([]);
  }, []);

  const toggleSavedHome = useCallback((id: number) => {
    setSavedHomes((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, savedHomes, toggleSavedHome }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
