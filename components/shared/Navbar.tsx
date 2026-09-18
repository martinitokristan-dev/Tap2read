"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReadText } from "@/components/shared/ReadText";

interface NavbarProps {
  studentName?: string | null;
  onOpenNameModal?: () => void;
}

export function Navbar({ studentName, onOpenNameModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/tap2read-logo.png"
            alt="Tap2Read Logo"
            className="h-11 w-11 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black font-jolly tracking-tight text-slate-900 group-hover:opacity-95 transition-opacity">
              Tap<span className="text-blue-600">2</span><ReadText uppercase />
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a
            href="#materials"
            className="hover:text-foreground transition-colors"
          >
            Materials
          </a>
          <a
            href="#videos"
            className="hover:text-foreground transition-colors"
          >
            Videos
          </a>
          <a
            href="#activities"
            className="hover:text-foreground transition-colors"
          >
            Activities
          </a>
          <a
            href="#researchers"
            className="hover:text-foreground transition-colors"
          >
            Researchers
          </a>
          <a
            href="#contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {studentName ? (
            <Badge className="py-1.5 px-3 text-xs font-bold font-jolly bg-emerald-100 text-emerald-800 border-emerald-300 rounded-xl shadow-xs">
              Hi, {studentName}!
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenNameModal}
              className="text-xs font-bold font-jolly rounded-xl border-2 border-blue-300 text-blue-700 bg-blue-50/60 hover:bg-blue-100 hover:text-blue-800 shadow-xs px-3.5 py-1.5 transition-all cursor-pointer"
            >
              Enter Name
            </Button>
          )}

          <Link href="/admin">
            <Button
              size="sm"
              className="text-xs font-bold font-jolly rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs hover:shadow px-3.5 py-1.5 transition-all cursor-pointer"
            >
              Teacher Portal
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
