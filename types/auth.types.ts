import { DefaultSession } from 'next-auth';

// Extend NextAuth session to include teacher id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

export interface TeacherCredentials {
  email: string;
  password: string;
}
