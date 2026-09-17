import { prisma } from '@/lib/prisma';

export const studentRepository = {
  create(fullName: string, sessionToken: string) {
    return prisma.studentSession.create({
      data: { fullName, sessionToken },
    });
  },

  findByToken(sessionToken: string) {
    return prisma.studentSession.findUnique({ where: { sessionToken } });
  },

  count() {
    return prisma.studentSession.count();
  },
};
