"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  Search,
  Sparkles,
  Menu,
  X,
  Database,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: UploadCloud,
  },
  {
    title: "Vector Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ask",
    icon: Sparkles,
  },
];

export function DashboardNav({
  userEmail,
  signOutAction,
}: {
  userEmail?: string | null;
  signOutAction?: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }

  const NavContent = () => (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md shadow-indigo-500/20 text-white font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight text-base">DocuIntel</span>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                AI RAG
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Document Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
            Workspace
          </div>
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform duration-150 group-hover:scale-110 ${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                />
                <span>{item.title}</span>
                {active && (
                  <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Architecture Status Badge */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Database className="h-3.5 w-3.5 text-emerald-500" />
            <span>pgvector + Gemini 3.6</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Vector embeddings active with 768-dim similarity search.
          </p>
        </div>
      </div>

      {/* User info & Signout */}
      {userEmail && (
        <div className="border-t border-border/60 pt-4 space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {userEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-medium text-foreground">{userEmail}</p>
              <p className="text-[11px] text-muted-foreground">Connected</p>
            </div>
          </div>
          {signOutAction && (
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              >
                Sign out
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm">DocuIntel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-card border-r border-border shadow-2xl transition-transform">
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-border/60 bg-card/60 backdrop-blur-md">
        <NavContent />
      </aside>
    </>
  );
}
