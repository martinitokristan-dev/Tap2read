"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BookOpen,
  LayoutDashboard,
  Sparkles,
  BookMarked,
  Video,
  Palette,
  Users,
  MessageSquare,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages/count");
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.unreadCount !== undefined) {
          setUnreadCount(data.data.unreadCount);
        }
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener("messages-updated", handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener("messages-updated", handleUpdate);
    };
  }, [pathname]);

  // If on login page, render clean layout without navigation bar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Sight Words (Max 5)", href: "/admin/sightwords", icon: BookOpen },
    { label: "Short Stories (Max 5)", href: "/admin/shortstories", icon: BookMarked },
    { label: "Videos (Max 5)", href: "/admin/videos", icon: Video },
    { label: "Activities (Max 5)", href: "/admin/activities", icon: Palette },
    { label: "Researchers (6)", href: "/admin/researchers", icon: Users },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-60 bg-background border-r border-border flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="h-16 px-5 flex items-center border-b border-border gap-2.5">
            <img
              src="/images/tap2read-logo.png"
              alt="Tap2Read Logo"
              className="h-8 w-8 object-contain rounded-md shadow-xs"
            />
            <div>
              <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                Tap2Read
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block -mt-0.5">
                Teacher Portal
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              const isMessages = link.href === "/admin/messages";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </div>
                  {isMessages && unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-xs animate-in zoom-in-75">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border space-y-1.5">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs gap-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Student Site
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full justify-start text-xs gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
