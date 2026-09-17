// All app route paths as constants — prevents typos and magic strings
export const ROUTES = {
  // Public
  LANDING: '/',
  HOME: '/home',
  MATERIALS: '/materials',
  SIGHT_WORD: (id: number) => `/materials/sightwords/${id}`,
  SHORT_STORY: (id: number) => `/materials/shortstories/${id}`,
  VIDEOS: '/videos',
  ACTIVITIES: '/activities',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MATERIALS: '/admin/materials',
  ADMIN_VIDEOS: '/admin/videos',
  ADMIN_ACTIVITIES: '/admin/activities',
  ADMIN_RESEARCHERS: '/admin/researchers',
  ADMIN_MESSAGES: '/admin/messages',

  // API
  API: {
    STUDENT_REGISTER: '/api/student/register',
    SIGHT_WORDS: '/api/sightwords',
    SIGHT_WORD: (id: number) => `/api/sightwords/${id}`,
    SHORT_STORIES: '/api/shortstories',
    SHORT_STORY: (id: number) => `/api/shortstories/${id}`,
    VIDEOS: '/api/videos',
    VIDEO: (id: number) => `/api/videos/${id}`,
    ACTIVITIES: '/api/activities',
    ACTIVITY: (id: number) => `/api/activities/${id}`,
    RESEARCHERS: '/api/researchers',
    RESEARCHER: (id: number) => `/api/researchers/${id}`,
    CONTACT: '/api/contact',
    CLOUDINARY_SIGN: '/api/cloudinary/sign',
  },
} as const;
