
import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import ClientEffects from "./ClientEffects";

const fontGoogle = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "ReadIt Library",
  description: "A library for the age of AI",
  authors: [{ name: "ReadIt Library" }],
  openGraph: {
    title: "ReadIt Library",
    description: "A library for the age of AI",
    images: [
      {
        url: "/hero-image.png",
        width: 1200,
        height: 630,
        alt: "ReadIt Library - A library for the age of AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ReadIt Library",
    description: "A library for the age of AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontGoogle.className}>
        <div>{children}</div>
        <ClientEffects />

        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
      </body>
    </html>
  );
}

