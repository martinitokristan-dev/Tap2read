"use client";

import Link from "next/link";
import { BookOpen, UserCheck, Lock } from "lucide-react";
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
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#16a34a] to-[#dc2626] text-white shadow-md group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black font-jolly tracking-tight text-slate-900 group-hover:opacity-95 transition-opacity">
              Tap<span className="text-blue-600">2</span><ReadText uppercase />
            </span>
            <span className="text-[10px] text-blue-600 -mt-1 font-bold font-jolly tracking-wider uppercase">
              Reading Adventure
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
        <div className="flex items-center gap-3">
          {studentName ? (
            <Badge className="gap-1.5 py-1.5 px-3 text-xs font-bold font-jolly bg-emerald-100 text-emerald-800 border-emerald-300 rounded-full shadow-xs">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hi, {studentName}! 👋</span>
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenNameModal}
              className="text-xs font-bold font-jolly rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Enter Name 👋
            </Button>
          )}

          <Link href="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-bold font-jolly gap-1.5 text-slate-500 hover:text-slate-900 rounded-xl"
            >
              <Lock className="h-3.5 w-3.5" />
              Teacher Portal
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
