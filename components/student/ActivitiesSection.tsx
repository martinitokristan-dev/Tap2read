"use client";

import React from "react";
import { ExternalLink, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ScrapbookCraftBanner,
  DoodleStar,
  DoodleSparkle,
  BrushSquiggle,
} from "@/components/shared/HandcraftedElements";

interface ActivityItem {
  id: string | number;
  title: string;
  description?: string | null;
  canvaUrl?: string;
  canvaLink?: string;
  thumbnailUrl?: string | null;
  imageUrl?: string | null;
}

interface ActivitiesSectionProps {
  activities: ActivityItem[];
}

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <section id="activities" className="scroll-mt-16 sm:scroll-mt-20 py-20 md:py-28 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        {/* Photo 5: Handcrafted Header Block */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          {/* Activity Clip-art icon with background removed */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <img
                src="/images/clipart/activity-clipart.png"
                alt="Activities Clip-art"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Section 5: Handcrafted Scrapbook-Style Banner */}
          <ScrapbookCraftBanner className="max-w-2xl">
            <div className="text-center relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DoodleSparkle size={16} color="#f59e0b" />
                <Badge
                  variant="outline"
                  className="font-bold font-jolly text-xs sm:text-sm bg-amber-50/90 text-amber-800 border-amber-200 px-3.5 py-1 rounded-full shadow-xs"
                >
                  🎨 Fun Reading Games & Tasks
                </Badge>
                <DoodleStar size={16} color="#ef4444" />
              </div>

              <div className="relative inline-block mb-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-jolly text-slate-900 tracking-tight">
                  Canva Learning <span className="jolly-gradient-text">Activities</span>
                </h2>
                <BrushSquiggle color="#f59e0b" className="mt-0.5 opacity-80" />
              </div>

              <p className="text-sm sm:text-base text-slate-700 font-medium font-sans max-w-lg mx-auto leading-relaxed">
                Hands-on worksheets, creative phonic puzzles, and interactive reading games crafted on Canva!
              </p>
            </div>
          </ScrapbookCraftBanner>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-16 bg-white/80 rounded-3xl border-2 border-dashed border-amber-200 shadow-sm">
            <Palette className="h-10 w-10 text-amber-400 mx-auto mb-2" />
            <p className="text-base font-bold font-jolly text-slate-800">No activities available yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Fun reading activities will appear here once published by your teacher!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activities.map((act) => {
              const imageSrc = act.imageUrl || act.thumbnailUrl;
              const canvaHref = act.canvaLink || act.canvaUrl || "#";

              return (
                <Card
                  key={act.id}
                  className="group overflow-hidden border-2 border-amber-100 hover:border-amber-400 transition-all duration-300 rounded-3xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col"
                >
                  {imageSrc ? (
                    <div className="relative aspect-video w-full bg-amber-50 overflow-hidden border-b border-amber-100">
                      <img
                        src={imageSrc}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-amber-50 flex items-center justify-center text-amber-400 border-b border-amber-100">
                      <Palette className="h-10 w-10" />
                    </div>
                  )}

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] font-bold font-jolly">
                          🎨 Canva Activity
                        </Badge>
                      </div>
                      <h3 className="text-lg font-black font-jolly text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {act.title}
                      </h3>
                      {act.description && (
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium mb-4">
                          {act.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-amber-100 mt-3">
                      <a
                        href={canvaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block"
                      >
                        <Button
                          size="default"
                          className="w-full gap-2 text-sm font-bold font-jolly rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                        >
                          Open in Canva
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
