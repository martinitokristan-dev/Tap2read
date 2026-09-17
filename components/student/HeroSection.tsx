"use client";

import React, { useState } from "react";
import { ArrowDown, BookOpen, Video, Palette, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { toast } from "sonner";

interface HeroSectionProps {
  studentName: string | null;
  onStudentRegister: (name: string) => void;
}

export function HeroSection({ studentName, onStudentRegister }: HeroSectionProps) {
  const [inputName, setInputName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError("Please enter your full name before continuing.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must have at least 2 letters.");
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
      if (!res.ok) throw new Error(data.error || "Failed to register.");

      localStorage.setItem("tap2read_student_name", trimmed);
      toast.success(`Welcome, ${trimmed}. You may now access the learning materials.`);
      onStudentRegister(trimmed);

      // Smooth scroll to Screen 3 (Action Hub)
      setTimeout(() => {
        scrollTo("action-hub");
      }, 300);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const nav = document.querySelector("header");
      const navHeight = nav ? nav.getBoundingClientRect().height : 64;
      const elementTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, Math.round(elementTop - navHeight)),
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* ─── SCREEN 1: FULL SCREEN HERO (PURE TAP2READ FULL-SCREEN IMAGE ONLY) ─── */}
      <section
        id="hero"
        onClick={() => scrollTo("get-started")}
        className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center relative overflow-hidden select-none cursor-pointer"
        title="Click to start reading!"
      >
        {/* Full-screen Widescreen Background Artwork with centered Tap2Read Logo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tap2read-hero-fullscreen.jpg"
            alt="Tap2Read - Where Reading is Fun & Magical"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* ─── SCREEN 2: WELCOME & NAME ENTRY SCREEN ────────────────────────── */}
      <section
        id="get-started"
        className="min-h-screen scroll-mt-16 sm:scroll-mt-20 flex flex-col items-center justify-start pt-0 pb-16 sm:pb-20 relative bg-transparent"
      >
        {/* Full-width Long and Clean Graphic Welcome Banner directly flush with top */}
        <div className="w-full relative z-10 mb-8 sm:mb-10 overflow-hidden bg-[#fef0b4] flex items-center justify-center border-b border-amber-200/40 shadow-xs">
          <img
            src="/images/welcome-banner-clean.png"
            alt="Hello! Welcome to Tap2Read"
            className="w-full max-w-5xl h-auto py-1.5 sm:py-2 px-4 object-contain transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>

        <div className="container relative z-10 max-w-3xl mx-auto px-4 sm:px-8 text-center my-auto">
            {/* Comprehensive Platform Description (Relocated to Screen 2) */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-10 bg-white/90 backdrop-blur-md border-2 border-amber-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg shadow-amber-500/5">
              <p className="text-lg sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-bold tracking-tight font-jolly drop-shadow-xs">
                Tap2Read is an interactive reading platform designed for early grade learners. Explore visual sight words, illustrated stories, teacher-led video lessons, and interactive Canva activities to build strong reading foundations.
              </p>
            </div>

            {/* Learner Name Prompt Card (Replaced 'Student Information' with 'What is your name?') */}
            {!studentName ? (
              <Card className="max-w-md mx-auto border-2 border-blue-200 shadow-xl bg-white/95 backdrop-blur rounded-3xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-black font-jolly text-slate-800 flex items-center justify-center gap-2">
                      <span>What is your name?</span>
                      <span className="inline-block animate-bounce text-2xl">😊</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2">
                      Type your name below so we can start your reading adventure! 🌟
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="Type your name here..."
                        value={inputName}
                        onChange={(e) => {
                          setInputName(e.target.value);
                          if (error) setError(null);
                        }}
                        className="h-12 text-base text-center font-bold font-jolly bg-sky-50/50 border-2 border-blue-200 focus-visible:ring-blue-400 rounded-2xl placeholder:font-normal placeholder:text-slate-400"
                      />
                      {error && (
                        <p className="text-xs text-destructive font-bold font-jolly mt-1.5">
                          ⚠️ {error}
                        </p>
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
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-md mx-auto border-2 border-emerald-200 shadow-xl bg-white/95 backdrop-blur rounded-3xl p-6 sm:p-8 text-center space-y-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black font-jolly text-slate-900 mt-1">
                    Welcome back, {studentName}! 🎉
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  You are all set! Explore the fun reading materials, videos, and games below.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <Button
                    onClick={() => scrollTo("action-hub")}
                    className="font-jolly font-bold gap-2 text-sm h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer w-full sm:w-auto"
                  >
                    Go to Learning Modules
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("tap2read_student_name");
                      window.location.reload();
                    }}
                    className="font-jolly text-xs h-11 px-4 rounded-xl border-slate-300 hover:bg-slate-100 cursor-pointer w-full sm:w-auto"
                  >
                    Change Name
                  </Button>
                </div>
              </Card>
            )}
        </div>
      </section>

      {/* ─── SCREEN 3: ACTION HUB (WITH COLORFUL CLIP-ART CARDS) ──────────── */}
      <section
        id="action-hub"
        className="min-h-[85vh] scroll-mt-16 sm:scroll-mt-20 flex flex-col items-center justify-center py-20 px-4 sm:px-8 relative bg-transparent"
      >

        <div className="container relative z-10 max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge
                variant="outline"
                className="mb-3 text-xs sm:text-sm font-bold bg-white/90 text-purple-700 border-purple-200 px-3.5 py-1 rounded-full shadow-xs"
              >
                🎈 Learning Modules
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-jolly tracking-tight text-slate-900 mb-3 drop-shadow-xs">
                Choose What to Explore!
              </h2>
              <p className="text-sm sm:text-base text-slate-800 font-medium">
                Tap any of the three fun categories below to jump right into your lesson!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Module 1: Reading Materials (Book Clip-art) */}
              <button
                onClick={() => scrollTo("materials")}
                className="group flex flex-col justify-between p-6 rounded-3xl border-2 border-sky-200 hover:border-sky-400 bg-white/95 backdrop-blur hover:shadow-2xl transition-all duration-300 text-left shadow-lg cursor-pointer hover:-translate-y-1.5"
              >
                <div>
                  {/* Clip-art illustration for Reading Materials */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/images/clipart/book-clipart.jpg"
                      alt="Reading Materials - Books and Stories"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-black font-jolly text-slate-900 group-hover:text-blue-600 transition-colors">
                      Reading Materials
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Visual sight words to strengthen vocabulary recognition and curated short stories with colorful pictures!
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-sky-100 flex items-center justify-between">
                  <span className="font-jolly font-bold text-xs sm:text-sm text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    Explore Materials 📖
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 group-hover:translate-y-0.5 transition-transform">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>

              {/* Module 2: Reading Videos (Video Clip-art) */}
              <button
                onClick={() => scrollTo("videos")}
                className="group flex flex-col justify-between p-6 rounded-3xl border-2 border-purple-200 hover:border-purple-400 bg-white/95 backdrop-blur hover:shadow-2xl transition-all duration-300 text-left shadow-lg cursor-pointer hover:-translate-y-1.5"
              >
                <div>
                  {/* Clip-art illustration for Videos */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/images/clipart/video-clipart.jpg"
                      alt="Reading Videos"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <Video className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-black font-jolly text-slate-900 group-hover:text-purple-600 transition-colors">
                      Reading Videos
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Curated video lessons uploaded by teachers with engaging storytelling and guided reading help!
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-purple-100 flex items-center justify-between">
                  <span className="font-jolly font-bold text-xs sm:text-sm text-purple-600 group-hover:text-purple-700 flex items-center gap-1">
                    Watch Videos 🎬
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 group-hover:translate-y-0.5 transition-transform">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>

              {/* Module 3: Activities (Activity Clip-art) */}
              <button
                onClick={() => scrollTo("activities")}
                className="group flex flex-col justify-between p-6 rounded-3xl border-2 border-amber-200 hover:border-amber-400 bg-white/95 backdrop-blur hover:shadow-2xl transition-all duration-300 text-left shadow-lg cursor-pointer hover:-translate-y-1.5"
              >
                <div>
                  {/* Clip-art illustration for Activities */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/images/clipart/activity-clipart.jpg"
                      alt="Interactive Activities"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <Palette className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-black font-jolly text-slate-900 group-hover:text-amber-600 transition-colors">
                      Interactive Activities
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Hands-on Canva worksheets, creative phonics games, and colorful reading puzzles to play!
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-amber-100 flex items-center justify-between">
                  <span className="font-jolly font-bold text-xs sm:text-sm text-amber-600 group-hover:text-amber-700 flex items-center gap-1">
                    Open Activities 🎨
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 group-hover:translate-y-0.5 transition-transform">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            </div>
        </div>
      </section>
    </>
  );
}
