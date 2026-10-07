"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SessionContextType {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      // TODO: Check authentication status
      // This would typically check a session cookie or JWT
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // TODO: Implement sign in logic
    console.log("Sign in attempted with:", email);
    setIsLoading(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // TODO: Implement sign up logic
    console.log("Sign up attempted with:", email);
    setIsLoading(false);
  };

  const signOut = async () => {
    // TODO: Implement sign out logic
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};