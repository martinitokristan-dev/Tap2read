/**
 * Video Utilities for Tap2Read
 * Provides YouTube ID extraction, child-safe privacy-enhanced embeds,
 * and automatic HD thumbnail generation.
 */

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.trim().match(regExp);
  return match && match[1] ? match[1] : null;
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  if (!id) return url;
  // Use youtube-nocookie with student-friendly, distraction-free parameters
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Resolves the visual thumbnail for a given video URL and stored thumbnail URL.
 * Automatically discards stale Unsplash placeholders and derives dynamic thumbnails:
 * - YouTube: HD YouTube thumbnail
 * - Cloudinary: video frame snapshot (.jpg)
 * - Custom thumbnail: used if valid and not an Unsplash placeholder
 * - Direct MP4 / fallback: null (renders native video frame with #t=0.5)
 */
export function resolveVideoThumbnail(videoUrl: string, storedThumbnailUrl?: string | null): string | null {
  if (storedThumbnailUrl && !storedThumbnailUrl.includes("unsplash.com") && storedThumbnailUrl.trim() !== "") {
    return storedThumbnailUrl;
  }
  if (isYouTubeUrl(videoUrl)) {
    return getYouTubeThumbnail(videoUrl);
  }
  if (videoUrl && videoUrl.includes("cloudinary.com")) {
    return videoUrl.replace(/\.[^/.]+$/, ".jpg");
  }
  return null;
}

