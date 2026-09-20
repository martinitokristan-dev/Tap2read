import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma Client instances in development (hot-reload issue)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// If in development and the cached instance does not have new models (e.g. contactReply), reset it
if (globalForPrisma.prisma && !(globalForPrisma.prisma as any).contactReply) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
