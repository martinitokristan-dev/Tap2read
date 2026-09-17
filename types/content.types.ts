// ─── Content Types ────────────────────────────────────────────────────────────

export interface SightWord {
  id: number;
  word: string;
  imageUrl: string;
  displayOrder: number;
  createdAt: Date;
}

export interface ShortStory {
  id: number;
  title: string;
  coverImage: string;
  content: string;
  displayOrder: number;
  createdAt: Date;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  displayOrder: number;
  createdAt: Date;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  canvaLink: string;
  displayOrder: number;
  createdAt: Date;
}

export interface Researcher {
  id: number;
  fullName: string;
  role: string;
  photoUrl: string;
  description: string;
  displayOrder: number;
}

export interface ContactMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  message: string;
  sentAt: Date;
}

export interface StudentSession {
  id: number;
  fullName: string;
  sessionToken: string;
  createdAt: Date;
}

// ─── Content Counts ───────────────────────────────────────────────────────────

export interface ContentCounts {
  sightWords: number;
  shortStories: number;
  videos: number;
  activities: number;
}
