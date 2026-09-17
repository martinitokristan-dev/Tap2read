"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { HeroSection } from "@/components/student/HeroSection";
import { MaterialsSection } from "@/components/student/MaterialsSection";
import { VideosSection } from "@/components/student/VideosSection";
import { ActivitiesSection } from "@/components/student/ActivitiesSection";
import { ResearchersSection } from "@/components/student/ResearchersSection";
import { ContactSection } from "@/components/student/ContactSection";
import { StudentAuthModal } from "@/components/shared/StudentAuthModal";

import { ScrollReveal } from "@/components/shared/ScrollReveal";

export default function StudentHomePage() {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Data states
  const [sightWords, setSightWords] = useState<any[]>([]);
  const [shortStories, setShortStories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [researchers, setResearchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure on page reload/mount we start at the Hero section if no specific anchor is requested
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }

    // Check if student has entered their name previously
    const savedName = localStorage.getItem("tap2read_student_name");
    if (savedName) {
      setStudentName(savedName);
    }

    // Fetch all public content from API
    async function loadContent() {
      try {
        const [swRes, ssRes, vidRes, actRes, resRes] = await Promise.all([
          fetch("/api/sightwords"),
          fetch("/api/shortstories"),
          fetch("/api/videos"),
          fetch("/api/activities"),
          fetch("/api/researchers"),
        ]);

        const [sw, ss, vid, act, res] = await Promise.all([
          swRes.json(),
          ssRes.json(),
          vidRes.json(),
          actRes.json(),
          resRes.json(),
        ]);

        if (sw?.data) setSightWords(sw.data);
        if (ss?.data) setShortStories(ss.data);
        if (vid?.data) setVideos(vid.data);
        if (act?.data) setActivities(act.data);
        if (res?.data) setResearchers(res.data);
      } catch (err) {
        console.error("Failed to load content:", err);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Global Student Navigation */}
      <Navbar
        studentName={studentName}
        onOpenNameModal={() => setAuthModalOpen(true)}
      />

      <main className="flex-1 bg-[url('/images/bg-pattern.png')] bg-repeat bg-[length:380px]">
        {/* Screen 1 (Hero), Screen 2 (Get Started), Screen 3 (Action Hub) */}
        <HeroSection
          studentName={studentName}
          onStudentRegister={(name) => setStudentName(name)}
        />

        {/* Materials Section: Sight Words & Short Stories */}
        <MaterialsSection
          sightWords={sightWords}
          shortStories={shortStories}
        />

        {/* Videos Section: Up to 5 Reading Lessons */}
        <VideosSection videos={videos} />

        {/* Activities Section: Up to 5 Canva Activities */}
        <ActivitiesSection activities={activities} />

        {/* Researchers Section: All 6 Team Members */}
        <ResearchersSection researchers={researchers} />

        {/* Contact Section: Message Us */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Optional Name Entry Modal triggered from Navbar */}
      <StudentAuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={(name) => setStudentName(name)}
      />
    </div>
  );
}
