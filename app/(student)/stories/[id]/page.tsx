"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tap2ReadLoader } from "@/components/shared/Tap2ReadLoader";

interface ShortStory {
  id: string | number;
  title: string;
  content: string;
  coverImage?: string | null;
}

export default function ShortStoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params?.id as string;

  const [story, setStory] = useState<ShortStory | null>(null);
  const [allStories, setAllStories] = useState<ShortStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyId) return;

    async function fetchStoryAndList() {
      setLoading(true);
      setError(null);
      try {
        const [singleRes, allRes] = await Promise.all([
          fetch(`/api/shortstories/${storyId}`),
          fetch("/api/shortstories"),
        ]);

        const singleData = await singleRes.json();
        const allData = await allRes.json();

        if (singleData.success && singleData.data) {
          setStory(singleData.data);
        } else {
          setError("Story not found");
        }

        if (allData.success && Array.isArray(allData.data)) {
          setAllStories(allData.data);
        }
      } catch (err) {
        console.error("Failed to fetch story:", err);
        setError("Failed to load the story. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchStoryAndList();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [storyId]);

  const currentIndex = story
    ? allStories.findIndex((s) => String(s.id) === String(story.id))
    : -1;
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;
  const nextStory =
    currentIndex >= 0 && currentIndex < allStories.length - 1
      ? allStories[currentIndex + 1]
      : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/#materials");
      } else if (e.key === "ArrowLeft" && prevStory) {
        router.push(`/stories/${prevStory.id}`);
      } else if (e.key === "ArrowRight" && nextStory) {
        router.push(`/stories/${nextStory.id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevStory, nextStory, router]);

  if (loading) {
    return <Tap2ReadLoader message="Opening your story..." subMessage="Get ready for an exciting adventure!" />;
  }

  if (error || !story) {
    return (
      <div className="h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-red-100 flex flex-col items-center gap-4 text-center max-w-md w-full">
          <p className="font-jolly font-black text-2xl text-red-600">{error || "Story not found"}</p>
          <Link href="/#materials">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-jolly font-bold px-6 py-2 rounded-xl">
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasTextContent = Boolean(story.content?.trim());

  return (
    <div className="h-screen max-h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col overflow-hidden">
      {/* Modern, High UI/UX Top Navigation Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs flex items-center justify-between shrink-0 z-30">
        <Link href="/#materials">
          <Button className="gap-2 font-jolly font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs h-9 sm:h-10 px-3 sm:px-4 transition-all">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Stories</span>
          </Button>
        </Link>

        {/* Center Progress Indicator & Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 font-jolly font-bold text-xs sm:text-sm shadow-2xs">
            <BookOpen className="h-3.5 w-3.5 text-purple-700" />
            <span>Story {currentIndex >= 0 ? currentIndex + 1 : 1} of {allStories.length || 5}</span>
          </div>
          <span className="font-jolly font-black text-slate-800 text-sm truncate max-w-xs hidden lg:inline">
            {story.title}
          </span>
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

      {/* Main Reading Container - Fits 100% on screen at Chrome default zoom */}
      <main className="flex-1 min-h-0 container mx-auto px-2 sm:px-6 py-2 sm:py-3 max-w-5xl flex flex-col justify-center overflow-hidden">
        <article className="h-full max-h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-purple-100 p-3 sm:p-5 overflow-hidden">
          {/* Story Title - Clean & Prominent, No Cluttered Badges */}
          <div className="text-center shrink-0 pb-1.5 sm:pb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-jolly text-slate-900 tracking-tight leading-tight">
              {story.title}
            </h1>
          </div>

          {/* Story Body: If only image is uploaded, it fills the container full size. If text is also present, it scrolls smoothly. */}
          {hasTextContent ? (
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {story.coverImage && (
                <div className="w-full max-h-[50vh] flex items-center justify-center rounded-xl overflow-hidden border border-purple-100 bg-purple-50/20 p-2">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full max-h-[46vh] object-contain rounded-lg"
                  />
                </div>
              )}
              <div className="space-y-4 px-2 sm:px-4 pb-2">
                {story.content
                  .split(/\n+/)
                  .filter((paragraph) => paragraph.trim().length > 0)
                  .map((para, idx) => (
                    <p
                      key={idx}
                      className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-800 font-medium font-sans selection:bg-purple-100 selection:text-purple-900"
                    >
                      {para}
                    </p>
                  ))}
              </div>
            </div>
          ) : (
            /* Illustrated Story Page (Image IS the Story) - Full size matching container */
            story.coverImage && (
              <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-purple-100 bg-purple-50/20">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )
          )}

          {/* Bottom Navigation Controls - Always anchored and 100% visible */}
          <div className="shrink-0 pt-2.5 sm:pt-3 border-t-2 border-dashed border-purple-100 flex items-center justify-between gap-3 w-full mt-2">
            {prevStory ? (
              <Link href={`/stories/${prevStory.id}`} className="shrink-0">
                <Button
                  variant="outline"
                  className="font-jolly font-bold rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous Story
                </Button>
              </Link>
            ) : (
              <div className="w-24 sm:w-28" />
            )}

            <Link href="/#materials">
              <Button className="font-jolly font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-sm">
                Back to All Stories
              </Button>
            </Link>

            {nextStory ? (
              <Link href={`/stories/${nextStory.id}`} className="shrink-0">
                <Button
                  variant="outline"
                  className="font-jolly font-bold rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
                >
                  Next Story <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="w-24 sm:w-28" />
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
