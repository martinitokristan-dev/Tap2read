import React from "react";

interface ReadTextProps {
  className?: string;
  uppercase?: boolean;
}

/**
 * READ letters styled with black text (slate-900) to match MATERIALS and VIDEOS
 */
export function ReadText({ className = "", uppercase = false }: ReadTextProps) {
  const r = uppercase ? "R" : "R";
  const e = uppercase ? "E" : "e";
  const a = uppercase ? "A" : "a";
  const d = uppercase ? "D" : "d";

  return (
    <span className={`inline-flex font-black tracking-tight text-slate-900 ${className}`}>
      <span>{r}</span>
      <span>{e}</span>
      <span>{a}</span>
      <span>{d}</span>
    </span>
  );
}

export function Tap2ReadText({ className = "", uppercase = false }: ReadTextProps) {
  return (
    <span className={`inline-flex items-center font-black font-jolly tracking-tight ${className}`}>
      <span className="text-slate-900">Tap</span>
      <span className="text-blue-600">2</span>
      <ReadText uppercase={uppercase} />
    </span>
  );
}
