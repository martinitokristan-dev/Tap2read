"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SightWord {
  id: string | number;
  word: string;
  imageUrl: string;
}

export default function SightWordPage() {
  const params = useParams();
  const router = useRouter();
  const wordId = params?.id as string;

  const [sightWord, setSightWord] = useState<SightWord | null>(null);
  const [allWords, setAllWords] = useState<SightWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wordId) return;

    async function fetchWordAndList() {
      setLoading(true);
      setError(null);
      try {
        const [singleRes, allRes] = await Promise.all([
          fetch(`/api/sightwords/${wordId}`),
          fetch("/api/sightwords"),
        ]);

        const singleData = await singleRes.json();
        const allData = await allRes.json();

        if (singleData.success && singleData.data) {
          setSightWord(singleData.data);
        } else {
          setError("Sight word not found");
        }

        if (allData.success && Array.isArray(allData.data)) {
          setAllWords(allData.data);
        }
      } catch (err) {
        console.error("Failed to fetch sight word:", err);
        setError("Failed to load sight word. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchWordAndList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [wordId]);

  const currentIndex = sightWord
    ? allWords.findIndex((w) => String(w.id) === String(sightWord.id))
    : -1;
  const prevWord = currentIndex > 0 ? allWords[currentIndex - 1] : null;
  const nextWord =
    currentIndex >= 0 && currentIndex < allWords.length - 1
      ? allWords[currentIndex + 1]
      : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/#materials");
      } else if (e.key === "ArrowLeft" && prevWord) {
        router.push(`/sightwords/${prevWord.id}`);
      } else if (e.key === "ArrowRight" && nextWord) {
        router.push(`/sightwords/${nextWord.id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevWord, nextWord, router]);

  if (loading) {
    return (
      <div className="h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-sky-100 flex flex-col items-center gap-4 text-center max-w-sm w-full animate-pulse">
          <Sparkles className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="font-jolly font-black text-xl text-slate-800">Opening flashcard...</p>
        </div>
      </div>
    );
  }

  if (error || !sightWord) {
    return (
      <div className="h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-red-100 flex flex-col items-center gap-4 text-center max-w-md w-full">
          <p className="font-jolly font-black text-2xl text-red-600">{error || "Sight word not found"}</p>
          <Link href="/#materials">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-jolly font-bold px-6 py-2 rounded-xl">
              Back to Sight Words
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col overflow-hidden">
      {/* Modern, High UI/UX Top Navigation Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs flex items-center justify-between shrink-0 z-30">
        <Link href="/#materials">
          <Button className="gap-2 font-jolly font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs h-9 sm:h-10 px-3 sm:px-4 transition-all">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sight Words</span>
          </Button>
        </Link>

        {/* Center Progress Indicator & Word */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 font-jolly font-bold text-xs sm:text-sm shadow-2xs">
            <span>Word {currentIndex >= 0 ? currentIndex + 1 : 1} of {allWords.length || 5}</span>
          </div>
          {sightWord.word ? (
            <span className="font-jolly font-black text-slate-800 text-sm truncate capitalize hidden md:inline">
              {sightWord.word}
            </span>
          ) : null}
        </div>

        {/* Right Close Action */}
        <Link href="/#materials">
          <Button
            variant="outline"
            className="gap-1.5 font-jolly font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100 rounded-xl h-9 sm:h-10 px-3 sm:px-4 shadow-xs transition-colors"
            title="Back to Materials (Esc)"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </Button>
        </Link>
      </header>

      {/* Main Flashcard Viewport Area - Fits completely on 100% Chrome zoom */}
      <main className="flex-1 min-h-0 container mx-auto px-2 sm:px-6 py-2 sm:py-3 max-w-5xl flex flex-col justify-center overflow-hidden">
        <div className="h-full max-h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-sky-100 p-3 sm:p-5 overflow-hidden">
          {/* Flashcard Header & Word (optional) - Clean, No Cluttered Badges */}
          {sightWord.word ? (
            <div className="text-center shrink-0 pb-1.5 sm:pb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-jolly text-slate-900 capitalize tracking-tight leading-tight">
                {sightWord.word}
              </h1>
            </div>
          ) : null}

          {/* Flashcard Image Container - Image fills the full container */}
          <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-sky-100 bg-sky-50/20">
            <img
              src={sightWord.imageUrl}
              alt={sightWord.word || "Sight word card"}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation Controls - Fully visible at 100% zoom without scrolling */}
          <div className="shrink-0 pt-2.5 sm:pt-3 border-t-2 border-dashed border-sky-100 flex items-center justify-between gap-3 w-full mt-2">
            {prevWord ? (
              <Link href={`/sightwords/${prevWord.id}`} className="shrink-0">
                <Button
                  variant="outline"
                  className="font-jolly font-bold rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous Card
                </Button>
              </Link>
            ) : (
              <div className="w-24 sm:w-28" />
            )}

            <Link href="/#materials">
              <Button className="font-jolly font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm">
                Back to All Words
              </Button>
            </Link>

            {nextWord ? (
              <Link href={`/sightwords/${nextWord.id}`} className="shrink-0">
                <Button
                  variant="outline"
                  className="font-jolly font-bold rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  Next Card <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="w-24 sm:w-28" />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
