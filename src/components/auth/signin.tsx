"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSession } from "@/providers/session";
import { Sun, Moon } from "lucide-react";

interface SignInProps {
  className?: string;
  onSuccess?: () => void;
}

export const SignIn = ({ className, onSuccess }: SignInProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [themeMode, setThemeMode] = React.useState<"light" | "dark">("light");

  return (
    <div className="max-w-md mx-auto p-4 bg-background">
      <h2 className="text-2xl font-extrabold text-center mb-6">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-3">
          Don't have an account? <a href="#" className="underline hover:text-primary">Sign up</a>
        </p>
      </form>

      {/* Theme toggle at bottom */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setThemeMode((m) => (m === "dark" ? "light" : "dark"))}
          className="rounded-md p-1 hover:bg-secondary/20 transition-colors"
          aria-label="Toggle theme"
        >
          {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};