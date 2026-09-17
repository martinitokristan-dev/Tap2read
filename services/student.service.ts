import { v4 as uuidv4 } from 'uuid';
import { studentRepository } from '@/repositories/student.repository';

export const studentService = {
  async register(fullName: string) {
    const trimmed = fullName.trim();
    if (!trimmed) throw new Error('Full name is required');

    const sessionToken = uuidv4();
    const session = await studentRepository.create(trimmed, sessionToken);
    return session;
  },

  async validateSession(sessionToken: string) {
    if (!sessionToken) return null;
    return studentRepository.findByToken(sessionToken);
  },

  async getTotalRegistrations() {
    return studentRepository.count();
  },
};
