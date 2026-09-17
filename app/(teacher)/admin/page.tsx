"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  Video,
  Palette,
  Users,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    sightWords: 0,
    shortStories: 0,
    videos: 0,
    activities: 0,
    researchers: 6,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (json?.data) {
          setCounts({
            sightWords: json.data.sightWords ?? 0,
            shortStories: json.data.shortStories ?? 0,
            videos: json.data.videos ?? 0,
            activities: json.data.activities ?? 0,
            researchers: json.data.researchers ?? 6,
            messages: json.data.messages ?? 0,
          });
        }
      } catch (err) {
        console.error("Error loading dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const stats = [
    {
      title: "Sight Words",
      current: counts.sightWords,
      max: 5,
      href: "/admin/sightwords",
      icon: BookOpen,
      description: "Vocabulary words with visual illustrations",
    },
    {
      title: "Short Stories",
      current: counts.shortStories,
      max: 5,
      href: "/admin/shortstories",
      icon: BookMarked,
      description: "Reading stories with cover photos",
    },
    {
      title: "Educational Videos",
      current: counts.videos,
      max: 5,
      href: "/admin/videos",
      icon: Video,
      description: "Uploaded video lessons via Cloudinary",
    },
    {
      title: "Canva Activities",
      current: counts.activities,
      max: 5,
      href: "/admin/activities",
      icon: Palette,
      description: "Interactive learning worksheets & links",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Monitor curriculum material limits and review student inquiries.
        </p>
      </div>

      {/* 4 Primary Content Cards with Limit Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const percent = Math.min((stat.current / stat.max) * 100, 100);
          const isMaxed = stat.current >= stat.max;

          return (
            <Card key={stat.title} className="border-border rounded-lg p-5 bg-card shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-md bg-secondary text-foreground flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <Badge variant={isMaxed ? "destructive" : "outline"} className="text-[10px]">
                    {stat.current} / {stat.max} limit
                  </Badge>
                </div>

                <h2 className="text-sm font-semibold text-foreground mb-0.5">{stat.title}</h2>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{stat.description}</p>
                <div className="space-y-1.5 mb-5">
                  <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span>Uploaded</span>
                    <span>{stat.current} of {stat.max}</span>
                  </div>
                  <Progress value={percent} className="h-1.5" />
                </div>
              </div>

              <Link href={stat.href}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs"
                >
                  <span>Manage {stat.title}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Secondary Quick Links (Researchers & Messages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border rounded-lg p-5 bg-card shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-md bg-secondary text-foreground flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Researcher Profiles</h2>
              <p className="text-xs text-muted-foreground">6 pre-seeded researcher profiles</p>
            </div>
          </div>
          <Link href="/admin/researchers">
            <Button size="sm" variant="outline" className="text-xs">
              Edit Profiles
            </Button>
          </Link>
        </Card>

        <Card className="border-border rounded-lg p-5 bg-card shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-md bg-secondary text-foreground flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Inquiries & Messages</h2>
              <p className="text-xs text-muted-foreground">
                {counts.messages} contact submissions
              </p>
            </div>
          </div>
          <Link href="/admin/messages">
            <Button size="sm" variant="outline" className="text-xs">
              View Messages ({counts.messages})
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
