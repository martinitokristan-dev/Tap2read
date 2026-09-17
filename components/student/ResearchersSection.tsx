"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ResearcherItem {
  id: string | number;
  fullName?: string;
  name?: string;
  role?: string | null;
  description?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  imageUrl?: string | null;
}

interface ResearchersSectionProps {
  researchers: ResearcherItem[];
}

export function ResearchersSection({ researchers }: ResearchersSectionProps) {
  const defaultResearchers: ResearcherItem[] = [
    { id: 1, fullName: "Bobis, Samantha", role: "Researcher & Content Lead", description: "Passionate about early childhood reading development and literacy pedagogy." },
    { id: 2, fullName: "Cabaral, Joshua", role: "Researcher & Technical Lead", description: "Focused on multimedia learning systems and digital accessibility for students." },
    { id: 3, fullName: "Capa, Jasmine", role: "Researcher & Curriculum Designer", description: "Specializing in elementary reading strategies and student engagement." },
    { id: 4, fullName: "Curato, Kesiya Jean", role: "Researcher & Evaluation Specialist", description: "Dedicated to assessing reading comprehension and interactive learning impact." },
    { id: 5, fullName: "Margate, Czarina Kate", role: "Researcher & Activity Developer", description: "Creates interactive Canva learning materials tailored for young minds." },
    { id: 6, fullName: "Piñon, Jhonabelle", role: "Researcher & Instructional Designer", description: "Designing intuitive reading journeys and story-based learning workflows." },
  ];

  const displayList = researchers && researchers.length > 0 ? researchers : defaultResearchers;

  const getInitials = (name?: string) => {
    if (!name) return "R";
    const parts = name.split(/[\s,]+/).filter(Boolean);
    if (parts.length === 0) return "R";
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  };

  return (
    <section id="researchers" className="scroll-mt-16 sm:scroll-mt-20 py-16 md:py-24 bg-transparent border-t border-amber-200/40">
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-3">
            Research Team
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
            The Researchers
          </h2>
          <p className="text-sm text-slate-800 font-medium">
            The research team behind Tap2Read, supporting digital literacy and foundational reading skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayList.map((person) => {
            const displayName = person.fullName || person.name || "Researcher";
            const displayRole = person.role || "Researcher";
            const displayBio = person.description || person.bio || "";
            const displayPhoto = person.photoUrl || person.imageUrl || "";

            return (
              <Card
                key={person.id}
                className="border-border hover:border-foreground/30 transition-all rounded-lg bg-card p-5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar className="h-11 w-11 shrink-0 rounded-md border border-border">
                    {displayPhoto ? (
                      <AvatarImage src={displayPhoto} alt={displayName} />
                    ) : null}
                    <AvatarFallback className="bg-secondary text-foreground font-semibold text-xs rounded-md">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {displayName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <GraduationCap className="h-3 w-3" />
                      {displayRole}
                    </p>
                  </div>
                </div>

                {displayBio && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border font-medium">
                    {displayBio}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
