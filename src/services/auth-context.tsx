import React, { createContext, useContext, useEffect, useState } from 'react';

import { auth } from './endpoints';
import { tokenStore } from './storage';
import type { User } from './types';

interface AuthState {
  user: User | null;
  /** True until we've checked for a stored token on app start. */
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await tokenStore.get();
        if (token) {
          setUser(await auth.me());
        }
      } catch {
        // Stored token is stale/invalid — drop it.
        await tokenStore.clear();
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    setUser(await auth.login(email, password));
  };
  const signUp = async (name: string, email: string, password: string) => {
    setUser(await auth.register(name, email, password));
  };
  const signOut = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
