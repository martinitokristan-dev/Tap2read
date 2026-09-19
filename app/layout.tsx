import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Tap2Read | Interactive Learning Portal for Young Readers",
  description:
    "TAP2READ — your home for growing readers! TAP2READ is a fun and friendly website created especially for Grade 2 pupils to help develop their reading fluency through engaging reading materials, and repetitive reading resources. Like a home where learners feel safe to learn, practice, and grow, TAP2READ provides a welcoming space where every tap brings them closer to becoming more confident, accurate, and fluent readers. Here, reading is not just a skill to practice—it is an exciting journey filled with stories, words, discovery, and growth. Tap. Read. Learn. Grow!",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground" suppressHydrationWarning>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
