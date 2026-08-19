"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Cloud,
  LayoutDashboard,
  AlertTriangle,
  History,
  Settings,
  Activity,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview",        href: "/dashboard", icon: LayoutDashboard },
  { name: "Connect Account", href: "/connect",   icon: PlusCircle },
  { name: "Findings",        href: "/findings",  icon: AlertTriangle },
  { name: "Applied Fixes",   href: "/history",   icon: History },
  { name: "Activity Log",    href: "/audit",     icon: Activity },
  { name: "Settings",        href: "/settings",  icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="hidden sm:flex w-64 flex-col p-4">
        <div className="flex flex-col h-full bg-card border border-border rounded-2xl p-4 transition-colors">

          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cloud className="h-4 w-4" />
            </div>
            <Link
              href="/"
              className="font-heading font-semibold tracking-tight text-foreground text-base"
            >
              Stratosphere AI
            </Link>
          </div>

          {/* Nav items */}
          <nav className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                    active
                      ? "bg-secondary text-foreground font-semibold border border-border"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="font-heading tracking-[-0.01em]">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom account info */}
          <div className="pt-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-heading font-semibold">
                NA
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">Aditya</p>
                <p className="text-[11px] text-muted-foreground truncate">aditya@stratosphere.ai</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/60 backdrop-blur-sm px-6 md:px-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground sm:hidden">
            <Cloud className="h-5 w-5 text-primary" />
            <span className="font-heading font-semibold text-foreground">Stratosphere AI</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex bg-background border-border text-muted-foreground text-xs py-1 px-3">
              <span className="h-2 w-2 rounded-full bg-accent mr-2 inline-block"></span>
              Mock AWS Connected
            </Badge>
            <Link href="/connect">
              <Button variant="outline" size="sm">
                Switch Account
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
