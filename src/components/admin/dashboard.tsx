"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  BarChart2,
  Shield,
  Folder,
  Layout,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

interface AdminDashboardProps {
  className?: string;
}

export const AdminDashboard = ({ className }: AdminDashboardProps) => {
  const [themeMode, setThemeMode] = React.useState<"light" | "dark">("light");

  // Initialize from localStorage or system preference
  React.useEffect(() => {
    const storedMode = localStorage.getItem("readit-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedMode === "light" || storedMode === "dark") {
      setThemeMode(storedMode);
    } else if (prefersDark) {
      setThemeMode("dark");
    }
  }, []);

  // Save to localStorage when mode changes
  React.useEffect(() => {
    localStorage.setItem("readit-theme", themeMode);
  }, [themeMode]);

  const stats: DashboardStats[] = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12% today",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Published Works",
      value: "3,421",
      change: "+8% this month",
      trend: "up",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Active Readers",
      value: "8,934",
      change: "+5% this week",
      trend: "up",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Reports Pending",
      value: "47",
      change: "+3 yesterday",
      trend: "up",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  const menuItems = [
    { name: "Works", href: "/admin/works", icon: Folder },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: Shield },
    { name: "Categories", href: "/admin/categories", icon: Folder },
    { name: "AI Models", href: "/admin/models", icon: Layout },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <section
      className={cn(
        "py-8 bg-background max-w-7xl mx-auto px-4",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Platform management and analytics
            </p>
          </div>

          <button
            onClick={() =>
              setThemeMode((m) => (m === "dark" ? "light" : "dark"))
            }
            className="rounded-md p-2 hover:bg-secondary/20 transition-colors"
            aria-label="Toggle theme"
          >
            {themeMode === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {stat.title}
                </span>

                <Badge variant="outline" className="text-xs">
                  {stat.trend === "up"
                    ? "▲"
                    : stat.trend === "down"
                      ? "▼"
                      : "•"}
                </Badge>
              </div>

              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.change}</p>
            </Card>
          ))}
        </div>

        {/* Navigation Menu */}
        <nav className="border rounded-md overflow-hidden bg-card">
          <ul className="space-y-1 border-b border-border">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/10 transition-colors",
                      "data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Key metrics and charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Works */}
            <Card className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Trending This Week
              </h2>

              <ProgressBar value={75} className="h-2" />

              <p className="text-xs text-muted-foreground mt-2">
                75% completion rate
              </p>
            </Card>

            {/* Recent Submissions */}
            <Card className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Recent Submissions
              </h2>

              <p className="text-xs text-muted-foreground">
                12 submissions pending review
              </p>
            </Card>

            {/* System Health */}
            <Card className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                System Health
              </h2>

              <ProgressBar value={98} className="h-2" />

              <p className="text-xs text-muted-foreground mt-2">
                98% uptime
              </p>
            </Card>
          </div>

          {/* Right column: Quick actions */}
          <div>
            {/* Quick Actions */}
            <Card className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Quick Actions
              </h2>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium">Approve submissions</span>
                  <span className="ml-auto">12 pending</span>
                </li>

                <li>
                  <span className="font-medium">Review reports</span>
                  <span className="ml-auto">47 open</span>
                </li>

                <li>
                  <span className="font-medium">Ban users</span>
                  <span className="ml-auto">3 active</span>
                </li>
              </ul>
            </Card>

            {/* Recent Activity */}
            <Card className="p-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Recent Activity
              </h2>

              <p className="text-xs text-muted-foreground">
                Last activity: 2 minutes ago
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};