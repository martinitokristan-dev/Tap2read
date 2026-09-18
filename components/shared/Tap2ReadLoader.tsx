"use client";

import React from "react";

interface Tap2ReadLoaderProps {
  message?: string;
  subMessage?: string;
}

export function Tap2ReadLoader({
  message = "Opening flashcard...",
  subMessage = "Get ready to learn!",
}: Tap2ReadLoaderProps) {
  return (
    <div className="h-screen bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px] bg-[#fbfbf9] flex flex-col items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-sky-100 flex flex-col items-center gap-4 text-center max-w-sm w-full transition-all duration-300">
        {/* Animated Brand Logo Container */}
        <div className="relative flex items-center justify-center">
          {/* Subtle pulse aura */}
          <div className="absolute h-20 w-20 rounded-full bg-blue-100 animate-ping opacity-35" />
          <div className="absolute h-24 w-24 rounded-full bg-sky-50 animate-pulse" />
          
          {/* Official Tap2Read Logo */}
          <img
            src="/images/tap2read-logo.png"
            alt="Tap2Read Logo"
            className="relative h-16 w-16 object-contain rounded-2xl drop-shadow-md animate-bounce"
          />
        </div>

        {/* Loading Message */}
        <div className="space-y-1">
          <p className="font-jolly font-black text-2xl text-slate-900 tracking-wide">
            {message}
          </p>
          {subMessage && (
            <p className="text-xs text-slate-500 font-medium font-sans">
              {subMessage}
            </p>
          )}
        </div>

        {/* Playful bouncing color dots */}
        <div className="flex items-center gap-2 justify-center pt-1">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
