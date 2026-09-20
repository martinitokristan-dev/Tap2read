"use client";

import React, { useState } from "react";
import { Video, Play, Clapperboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReadText } from "@/components/shared/ReadText";
import {
  HandPaintedBorderBanner,
  DoodleStar,
  DoodleSparkle,
  BrushSquiggle,
} from "@/components/shared/HandcraftedElements";

interface VideoItem {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
}

interface VideosSectionProps {
  videos: VideoItem[];
}

export function VideosSection({ videos }: VideosSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section id="videos" className="scroll-mt-16 sm:scroll-mt-20 py-20 md:py-28 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        {/* Photo 4: Handcrafted Header Block */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          {/* Video Clip-art icon with background removed */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <img
                src="/images/clipart/video-clipart.png"
                alt="Reading Videos Clip-art"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Section 4: Hand-Painted Watercolor Border Style Banner */}
          <HandPaintedBorderBanner className="max-w-2xl">
            <div className="text-center relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DoodleSparkle size={16} color="#a855f7" />
                <Badge
                  variant="outline"
                  className="font-bold font-jolly text-xs sm:text-sm bg-purple-50/90 text-purple-800 border-purple-200 px-3.5 py-1 rounded-full shadow-xs inline-flex items-center gap-1.5"
                >
                  <Clapperboard className="h-4 w-4 text-purple-600" />
                  <span>Teacher Video Lessons</span>
                </Badge>
                <DoodleStar size={16} color="#ec4899" />
              </div>

              <div className="relative inline-block mb-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-jolly text-slate-900 tracking-tight">
                  <ReadText />ing <span className="jolly-gradient-text">Videos</span>
                </h2>
                <BrushSquiggle color="#c084fc" className="mt-0.5 opacity-80" />
              </div>

              <p className="text-sm sm:text-base text-slate-700 font-medium font-sans max-w-lg mx-auto leading-relaxed">
                The Video Materials contain sight words, CVC words, and short passages while providing models of correct pronunciation, pacing, phrasing, and expression for the learners to follow.
              </p>
            </div>
          </HandPaintedBorderBanner>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-dashed border-purple-200 shadow-sm">
            <Video className="h-10 w-10 text-purple-400 mx-auto mb-2" />
            <p className="text-base font-bold font-jolly text-slate-800">No videos available yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Exciting lessons will appear here once published by your teacher!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <Card
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="group cursor-pointer overflow-hidden border-2 border-purple-100 hover:border-purple-400 transition-all duration-300 rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col"
              >
                <div className="relative aspect-video w-full bg-purple-900/10 flex items-center justify-center overflow-hidden border-b border-purple-100">
                  {vid.thumbnailUrl ? (
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={vid.videoUrl}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-purple-600 ml-0.5" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black font-jolly text-slate-900 mb-1.5 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {vid.title}
                    </h3>
                    {vid.description && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {vid.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 flex items-center border-t border-purple-100 mt-4">
                    <span className="text-xs sm:text-sm font-bold font-jolly text-purple-600 flex items-center gap-1.5 group-hover:text-purple-700">
                      <Play className="h-3.5 w-3.5 fill-purple-600" /> Watch Lesson
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO PLAYER DIALOG */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-5xl lg:max-w-6xl w-[95vw] sm:w-[92vw] p-5 sm:p-7 rounded-3xl bg-white border-2 border-purple-100 shadow-2xl">
          {activeVideo && (
            <div className="space-y-3 sm:space-y-4">
              <DialogHeader className="pr-8">
                <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black font-jolly text-slate-900 tracking-tight">
                  {activeVideo.title}
                </DialogTitle>
                {activeVideo.description && (
                  <DialogDescription className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-4xl pt-0.5">
                    {activeVideo.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border-2 border-purple-100">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
