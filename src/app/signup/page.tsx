"use client";

import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <SignupForm onSuccess={() => {}} />
    </main>
  );
}
