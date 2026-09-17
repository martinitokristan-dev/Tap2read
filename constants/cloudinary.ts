// Cloudinary folder names and upload configuration
export const CLOUDINARY_FOLDERS = {
  SIGHT_WORDS: 'tap2read/sight_words',
  SHORT_STORIES: 'tap2read/short_stories',
  VIDEOS: 'tap2read/videos',
  ACTIVITIES: 'tap2read/activities',
  RESEARCHERS: 'tap2read/researchers',
} as const;

export const CLOUDINARY_ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
export const CLOUDINARY_ALLOWED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
export const CLOUDINARY_MAX_IMAGE_SIZE_MB = 10;
export const CLOUDINARY_MAX_VIDEO_SIZE_MB = 100;
