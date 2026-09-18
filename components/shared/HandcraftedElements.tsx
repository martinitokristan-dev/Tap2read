"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE 1: Paint-Stroke / Paint-Brush Edge Banner (For Section 1: Intro)
   Features dry-brush bristle frayed ends, white gouache stroke & pastel dabs.
───────────────────────────────────────────────────────────────────────────── */
export function PaintStrokeBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto my-auto ${className}`}>
      {/* Hand-painted Paint-Stroke Canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none -m-2 sm:-m-3.5"
      >
        <svg
          viewBox="0 0 1000 240"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="paint-stroke-shadow" x="-8%" y="-8%" width="116%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#0f172a" floodOpacity="0.06" />
            </filter>
            <filter id="paint-deckle" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Under-layer 1: Left warm sunshine yellow watercolor dab */}
          <ellipse
            cx="85"
            cy="120"
            rx="105"
            ry="75"
            fill="rgba(254, 240, 180, 0.6)"
            className="filter blur-md transform -rotate-3"
          />

          {/* Under-layer 2: Right soft sky-blue watercolor dab */}
          <ellipse
            cx="915"
            cy="115"
            rx="110"
            ry="80"
            fill="rgba(224, 242, 254, 0.65)"
            className="filter blur-md transform rotate-2"
          />

          {/* Main Layer: White Paint-Stroke with Feathered Bristle Ends */}
          <path
            d="
              M 48 24
              C 140 18, 280 26, 440 19
              C 600 24, 760 17, 880 23
              C 930 19, 955 23, 966 27
              C 982 36, 974 52, 988 72
              C 976 92, 992 112, 980 132
              C 994 152, 976 172, 990 192
              C 978 208, 986 222, 962 232
              C 860 228, 720 236, 560 230
              C 410 234, 260 227, 130 233
              C 75 230, 48 234, 38 228
              C 22 214, 30 194, 16 174
              C 28 154, 14 134, 26 114
              C 12 94, 26 74, 18 54
              C 28 38, 34 28, 48 24 Z
            "
            fill="#ffffff"
            fillOpacity="0.97"
            stroke="rgba(226, 232, 240, 0.85)"
            strokeWidth="1.5"
            filter="url(#paint-stroke-shadow)"
            style={{
              filter: "url(#paint-deckle) drop-shadow(0 6px 16px rgba(0,0,0,0.05))",
            }}
          />

          {/* Dry-brush bristle specks on outer edges */}
          <g fill="#94a3b8" opacity="0.35">
            <circle cx="12" cy="78" r="1.8" />
            <circle cx="8" cy="138" r="2.2" />
            <circle cx="14" cy="190" r="1.6" />
            <circle cx="988" cy="65" r="1.8" />
            <circle cx="994" cy="125" r="2.4" />
            <circle cx="986" cy="182" r="1.7" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 px-5 py-4 sm:px-8 sm:py-6 md:px-10 md:py-7">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE 2: Organic Blob Shape Banner (For Section 2: Choose What to Explore!)
   Features smooth, fluid, asymmetrical organic cloud/blob contours with soft glow.
───────────────────────────────────────────────────────────────────────────── */
export function OrganicBlobBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto my-auto ${className}`}>
      {/* Organic Blob SVG Canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none -m-3 sm:-m-4"
      >
        <svg
          viewBox="0 0 900 240"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="blob-shadow" x="-8%" y="-8%" width="116%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#8b5cf6" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Under-layer 1: Soft lavender fluid blob */}
          <path
            d="
              M 55 115
              C 45 45, 160 12, 330 22
              C 480 8, 630 18, 770 32
              C 875 48, 895 125, 860 175
              C 820 225, 715 210, 560 220
              C 400 228, 240 215, 125 205
              C 55 195, 65 155, 55 115 Z
            "
            fill="rgba(243, 232, 255, 0.7)"
            className="filter blur-md transform translate-y-1.5"
          />

          {/* Main Organic Blob Shape: Smooth white cut-out cloud */}
          <path
            d="
              M 50 110
              C 40 40, 150 10, 320 20
              C 470 6, 620 16, 760 30
              C 865 45, 885 120, 850 170
              C 810 220, 705 205, 550 215
              C 390 222, 230 210, 120 200
              C 50 190, 60 150, 50 110 Z
            "
            fill="#ffffff"
            fillOpacity="0.97"
            stroke="rgba(216, 180, 254, 0.7)"
            strokeWidth="2"
            filter="url(#blob-shadow)"
          />

          {/* Decorative Little Playful Cloudlets / Blobs */}
          <circle cx="35" cy="45" r="14" fill="rgba(243, 232, 255, 0.85)" stroke="rgba(216, 180, 254, 0.5)" strokeWidth="1.5" />
          <circle cx="865" cy="40" r="16" fill="rgba(254, 243, 199, 0.85)" stroke="rgba(252, 211, 77, 0.5)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-6 sm:px-10 sm:py-7 text-center">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE 3: Rough / Torn-Paper Effect Banner (For Section 3: Reading Materials)
   Features jagged torn paper fibers on top & bottom like a page torn from a book.
───────────────────────────────────────────────────────────────────────────── */
export function TornPaperBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto my-auto ${className}`}>
      {/* Torn-Paper SVG Canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none -m-2 sm:-m-3"
      >
        <svg
          viewBox="0 0 950 240"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="torn-paper-shadow" x="-6%" y="-6%" width="112%" height="116%">
              <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#0284c7" floodOpacity="0.08" />
            </filter>
            <filter id="torn-fiber" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Under-layer: Sky blue shadow page offset */}
          <path
            d="
              M 22 26
              L 65 20 L 110 27 L 160 21 L 210 28 L 260 22 L 310 28 L 360 21 L 410 27 L 460 20 L 510 27 L 560 22 L 610 28 L 660 21 L 710 27 L 760 21 L 810 28 L 860 22 L 910 27 L 932 23
              L 936 218
              L 890 223 L 840 217 L 790 224 L 740 218 L 690 224 L 640 217 L 590 223 L 540 217 L 490 224 L 440 218 L 390 224 L 340 217 L 290 223 L 240 217 L 190 224 L 140 218 L 90 224 L 45 218 L 18 223
              Z
            "
            fill="rgba(224, 242, 254, 0.8)"
            className="filter blur-xs transform translate-x-1 translate-y-1.5"
          />

          {/* Main Torn Paper Strip: Realistic serrated/deckled top & bottom tears */}
          <path
            d="
              M 20 22
              L 65 16 L 110 23 L 160 17 L 210 24 L 260 18 L 310 24 L 360 17 L 410 23 L 460 16 L 510 23 L 560 18 L 610 24 L 660 17 L 710 23 L 760 17 L 810 24 L 860 18 L 910 23 L 930 19
              L 934 214
              L 890 219 L 840 213 L 790 220 L 740 214 L 690 220 L 640 213 L 590 219 L 540 213 L 490 220 L 440 214 L 390 220 L 340 213 L 290 219 L 240 213 L 190 220 L 140 214 L 90 220 L 45 214 L 16 219
              Z
            "
            fill="#ffffff"
            fillOpacity="0.98"
            stroke="rgba(186, 230, 253, 0.9)"
            strokeWidth="1.5"
            filter="url(#torn-paper-shadow)"
            style={{
              filter: "url(#torn-fiber) drop-shadow(0 4px 12px rgba(0,0,0,0.06))",
            }}
          />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-6 sm:px-10 sm:py-7 text-center">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE 4: Hand-Painted / Watercolor Border Banner (For Section 4: Videos)
   Features visible painted brush strokes, watercolor corner blooms & paint frame.
───────────────────────────────────────────────────────────────────────────── */
export function HandPaintedBorderBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto my-auto ${className}`}>
      {/* Hand-painted Watercolor Border Canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none -m-3 sm:-m-4"
      >
        <svg
          viewBox="0 0 920 240"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <filter id="handpaint-shadow" x="-8%" y="-8%" width="116%" height="120%">
              <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#7c3aed" floodOpacity="0.07" />
            </filter>
            <filter id="brush-wobble" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>

          {/* Soft Watercolor Corner Blooms */}
          <circle cx="45" cy="40" r="38" fill="rgba(243, 232, 255, 0.7)" className="filter blur-md" />
          <circle cx="875" cy="40" r="35" fill="rgba(254, 226, 226, 0.6)" className="filter blur-md" />
          <circle cx="50" cy="200" r="35" fill="rgba(224, 242, 254, 0.65)" className="filter blur-md" />
          <circle cx="870" cy="195" r="40" fill="rgba(243, 232, 255, 0.7)" className="filter blur-md" />

          {/* Main White Canvas Body */}
          <rect
            x="24"
            y="18"
            width="872"
            height="204"
            rx="28"
            ry="28"
            fill="#ffffff"
            fillOpacity="0.97"
            filter="url(#handpaint-shadow)"
          />

          {/* Hand-painted Brush-Stroke Outer Border Line (Double painted stroke) */}
          <rect
            x="24"
            y="18"
            width="872"
            height="204"
            rx="28"
            ry="28"
            fill="none"
            stroke="rgba(192, 132, 252, 0.75)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="400 12 300 8 250 10"
            style={{ filter: "url(#brush-wobble)" }}
          />

          {/* Inner Accent Paint Line */}
          <rect
            x="32"
            y="26"
            width="856"
            height="188"
            rx="22"
            ry="22"
            fill="none"
            stroke="rgba(233, 213, 255, 0.9)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
        </svg>
      </div>

      <div className="relative z-10 px-6 py-6 sm:px-10 sm:py-7 text-center">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE 5: Handcrafted Scrapbook-Style Banner (For Section 5: Activities)
   Features craft paper styling, stitched dashed border & corner washi tape tabs.
───────────────────────────────────────────────────────────────────────────── */
export function ScrapbookCraftBanner({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto my-auto bg-[#fffdf9]/95 backdrop-blur-sm border-2 border-amber-200/90 shadow-lg shadow-amber-900/5 rounded-3xl p-6 sm:p-8 md:p-9 ${className}`}
      style={{
        borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
      }}
    >
      {/* Top-Left Diagonal Washi Tape Tab */}
      <div
        aria-hidden="true"
        className="absolute -top-3 -left-3 w-16 h-5.5 bg-amber-200/90 border border-dashed border-amber-300 rounded-xs shadow-xs transform -rotate-12 pointer-events-none select-none z-20"
      />

      {/* Top-Right Diagonal Washi Tape Tab */}
      <div
        aria-hidden="true"
        className="absolute -top-3 -right-3 w-16 h-5.5 bg-orange-200/90 border border-dashed border-orange-300 rounded-xs shadow-xs transform rotate-12 pointer-events-none select-none z-20"
      />

      {/* Inner Hand-stitched Dashed Border */}
      <div
        aria-hidden="true"
        className="absolute inset-2 sm:inset-3 border-2 border-dashed border-amber-300/70 pointer-events-none select-none rounded-2xl"
      />

      {/* Content */}
      <div className="relative z-10 text-center">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared Handcrafted Doodles & Accents
───────────────────────────────────────────────────────────────────────────── */
export function DoodleStar({
  className = "",
  size = 18,
  color = "#f59e0b",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`inline-block select-none pointer-events-none ${className}`}
    >
      <path d="M12 2 Q12.5 9.5 20 12 Q12.5 14.5 12 22 Q11.5 14.5 4 12 Q11.5 9.5 12 2 Z" />
    </svg>
  );
}

export function DoodleSparkle({
  className = "",
  size = 16,
  color = "#38bdf8",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      className={`inline-block select-none pointer-events-none ${className}`}
    >
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  );
}

export function BrushSquiggle({
  className = "",
  color = "#38bdf8",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 16"
      fill="none"
      className={`w-full h-3 overflow-visible pointer-events-none select-none ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M 3 10 Q 25 3, 50 10 T 100 8 T 155 11"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
