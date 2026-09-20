"use client";

import React, { useState } from "react";
import { User, ArrowRight, Loader2, BookOpen, Smile, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StudentAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (fullName: string) => void;
}

export function StudentAuthModal({
  open,
  onOpenChange,
  onSuccess,
}: StudentAuthModalProps) {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();

    if (!trimmed) {
      setError("Please enter your full name before continuing.");
      return;
    }

    if (trimmed.length < 2) {
      setError("Full name must be at least 2 letters.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register. Please try again.");
      }

      localStorage.setItem("tap2read_student_name", trimmed);
      toast.success(`Welcome, ${trimmed}. You have joined the session.`);
      onSuccess(trimmed);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-2xl">
        <DialogHeader className="text-center sm:text-center">
          <img
            src="/images/tap2read-logo.png"
            alt="Tap2Read Logo"
            className="mx-auto h-16 w-16 object-contain rounded-2xl mb-2 drop-shadow-md"
          />
          <DialogTitle className="text-2xl font-black font-jolly text-slate-900 flex items-center justify-center gap-1.5">
            <span>What is your name?</span>
            <Smile className="h-6 w-6 text-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            <span>Type your name below so we can start your reading adventure!</span>
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2 text-left">
            <div className="relative">
              <Input
                id="student-name"
                placeholder="Type your name here..."
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError(null);
                }}
                className="h-12 text-base text-center font-bold font-jolly bg-sky-50/50 border-2 border-blue-200 focus-visible:ring-blue-400 rounded-2xl placeholder:font-normal placeholder:text-slate-400"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-destructive font-bold font-jolly text-center">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            size="default"
            className="w-full h-12 text-base font-bold font-jolly rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting Adventure...
              </>
            ) : (
              <>
                Let&apos;s Read!
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
