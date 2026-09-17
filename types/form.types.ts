// ─── Form Input Types ─────────────────────────────────────────────────────────

export interface StudentRegistrationForm {
  fullName: string;
}

export interface TeacherLoginForm {
  email: string;
  password: string;
}

export interface SightWordForm {
  word: string;
  imageUrl: string;
}

export interface ShortStoryForm {
  title: string;
  coverImage: string;
  content: string;
}

export interface VideoForm {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface ActivityForm {
  title: string;
  description: string;
  imageUrl: string;
  canvaLink: string;
}

export interface ResearcherForm {
  fullName: string;
  role: string;
  photoUrl: string;
  description: string;
}

export interface ContactForm {
  senderName: string;
  senderEmail: string;
  message: string;
}

// ─── Field Validation Error Map ───────────────────────────────────────────────

export type FormErrors<T> = Partial<Record<keyof T, string>>;
