"use client";

import * as React from "react";
import { useEffect, useState } from "react";

interface SessionData {
  userId: string;
  name?: string;
  email?: string;
  role?: string;
}

interface SessionContextValue {
  user: SessionData | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const SessionContext = React.createContext<
  SessionContextValue | undefined
>(undefined);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          return;
        }

        const sessionData: SessionData | null = await response.json();

        if (sessionData?.userId) {
          setUser({
            userId: sessionData.userId,
            name:
              sessionData.name ||
              sessionData.email?.split("@")[0] ||
              "User",
            email: sessionData.email || "",
            role: sessionData.role || "READER",
          });
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      initSession();
    }
  }, []);

  const signIn = async (
    email: string,
    password: string,
    rememberMe = false
  ) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (response.ok) {
      const data = await response.json();

      setUser({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Invalid credentials");
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      setUser({
        userId: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
    } else {
      throw new Error("Signup failed");
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      });

      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const resetPassword = async (email: string) => {
    await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  };

  const verifyEmail = async (token: string) => {
    await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  };

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => React.useContext(SessionContext);