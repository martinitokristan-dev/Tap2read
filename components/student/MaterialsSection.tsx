"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Eye, BookOpenCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadText } from "@/components/shared/ReadText";

interface SightWord {
  id: string | number;
  word: string;
  imageUrl: string;
}

interface ShortStory {
  id: string | number;
  title: string;
  content: string;
  coverImage?: string | null;
}

interface MaterialsSectionProps {
  sightWords: SightWord[];
  shortStories: ShortStory[];
}

export function MaterialsSection({
  sightWords,
  shortStories,
}: MaterialsSectionProps) {
  return (
    <section id="materials" className="scroll-mt-16 sm:scroll-mt-20 py-20 md:py-28 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          {/* Book Clip-art badge */}
          <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-lg border-2 border-sky-200 mb-4 bg-sky-50 hover:scale-105 transition-transform">
            <img
              src="/images/clipart/book-clipart.jpg"
              alt="Story Book Clip-art"
              className="w-full h-full object-cover"
            />
          </div>

          <Badge
            variant="outline"
            className="mb-3 font-bold font-jolly text-xs sm:text-sm bg-sky-100/80 text-sky-800 border-sky-200 px-3.5 py-1 rounded-full shadow-xs"
          >
            📚 Core Reading Curriculum
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-jolly text-slate-900 tracking-tight mb-3">
            <ReadText />ing <span className="jolly-gradient-text">Materials</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-800 font-medium max-w-xl mx-auto">
            Tap on sight words to see colorful visual flashcards, or open up short stories to read exciting adventures!
          </p>
        </div>

        <Tabs defaultValue="sightwords" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="grid grid-cols-2 w-full max-w-md h-13 p-1.5 bg-sky-100/70 border border-sky-200 rounded-2xl shadow-inner">
              <TabsTrigger
                value="sightwords"
                className="font-jolly text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all"
              >
                🔤 Sight Words ({sightWords.length}/5)
              </TabsTrigger>
              <TabsTrigger
                value="shortstories"
                className="font-jolly text-xs sm:text-sm font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md transition-all"
              >
                📖 Short Stories ({shortStories.length}/5)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SIGHT WORDS TAB */}
          <TabsContent value="sightwords" className="mt-0">
            {sightWords.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-border">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No sight words available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Words will appear here once published by the teacher.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
                {sightWords.map((item) => (
                  <Link
                    key={item.id}
                    href={`/sightwords/${item.id}`}
                    className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-xs sm:max-w-sm block group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-3xl"
                  >
                    <Card className="aspect-square overflow-hidden border-2 border-sky-200 group-hover:border-blue-500 bg-white shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 rounded-3xl flex flex-col justify-between">
                      <div className="relative flex-1 w-full bg-sky-50 overflow-hidden border-b border-sky-100 flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.word || "Sight word card"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4 sm:p-5 text-center bg-gradient-to-b from-white to-sky-50/60 shrink-0">
                        {item.word ? (
                          <p className="text-2xl sm:text-3xl font-black font-jolly text-slate-900 group-hover:text-blue-600 transition-colors capitalize tracking-wide">
                            {item.word}
                          </p>
                        ) : (
                          <p className="text-lg sm:text-xl font-bold font-jolly text-slate-700 group-hover:text-blue-600 transition-colors">
                            Picture Card
                          </p>
                        )}
                        <span className="text-xs sm:text-sm font-bold text-sky-600 uppercase tracking-wider block mt-1">
                          ⭐ Flashcard
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* SHORT STORIES TAB */}
          <TabsContent value="shortstories" className="mt-0">
            {shortStories.length === 0 ? (
              <div className="text-center py-16 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                <BookOpenCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-base font-bold font-jolly text-foreground">No short stories available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stories will appear here once published by the teacher.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {shortStories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="block group focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-3xl h-full"
                  >
                    <Card className="overflow-hidden border-2 border-purple-100 group-hover:border-purple-500 bg-white shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 rounded-3xl flex flex-col h-full">
                      {story.coverImage && (
                        <div className="relative aspect-video w-full bg-purple-50 overflow-hidden border-b border-purple-100">
                          <img
                            src={story.coverImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px] font-bold font-jolly">
                              📖 Storybook
                            </Badge>
                          </div>
                          <h3 className="text-lg font-black font-jolly text-slate-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                            {story.content?.trim() || "Illustrated reading story. Tap to open full page!"}
                          </p>
                        </div>
                        <div className="pt-4 flex items-center border-t border-purple-100 mt-4">
                          <span className="text-xs sm:text-sm font-bold font-jolly text-purple-600 flex items-center gap-1.5 group-hover:text-purple-700">
                            <Eye className="h-4 w-4" /> <ReadText /> Story
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
