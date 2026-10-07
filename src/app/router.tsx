"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./providers/theme-provider";

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // TODO: Track page views for analytics
      console.log("Navigated to:", pathname);
    }
  }, [pathname]);

  return <ThemeProvider>{children}</ThemeProvider>;
};

// Compatibility export for src/index.tsx
export const Router = RouterProvider;