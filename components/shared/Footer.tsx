import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ReadText } from "@/components/shared/ReadText";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#16a34a] to-[#dc2626] text-white shadow-xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold font-jolly text-foreground text-base">
                Tap<span className="text-blue-600">2</span><ReadText uppercase />
              </p>
              <p className="text-xs text-muted-foreground">
                Early reading platform & literacy learning resources
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground font-medium">
            <a href="#materials" className="hover:text-foreground transition-colors">
              Materials
            </a>
            <a href="#videos" className="hover:text-foreground transition-colors">
              Videos
            </a>
            <a href="#activities" className="hover:text-foreground transition-colors">
              Activities
            </a>
            <a href="#researchers" className="hover:text-foreground transition-colors">
              Researchers
            </a>
            <Link href="/admin" className="hover:text-foreground transition-colors">
              Teacher Login
            </Link>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Tap2Read. All rights reserved.</p>
          <p>
            Educational and literacy research project.
          </p>
        </div>
      </div>
    </footer>
  );
}
