"use client";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <LoginForm onSuccess={() => {}} />
    </main>
  );
}
