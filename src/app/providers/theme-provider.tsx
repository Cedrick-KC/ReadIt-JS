"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "reading";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // Initialize from preference or system
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const storedMode = localStorage.getItem("readit-theme");

    if (
      storedMode === "light" ||
      storedMode === "dark" ||
      storedMode === "reading"
    ) {
      setMode(storedMode);
    } else if (prefersDark) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem("readit-theme", mode);
  }, [mode]);

  const value: ThemeContextValue = {
    mode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};