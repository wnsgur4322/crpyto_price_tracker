"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  // react Query Client
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <html lang="en">
       <QueryClientProvider client={queryClient}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="min-h-screen flex items-center justify-center bg-background">
            {children}
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}
