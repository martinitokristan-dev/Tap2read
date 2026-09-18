import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Tap2Read...');

  // ─── 1. Teacher (1 Teacher Only) ───────────────────────────────────────────
  await prisma.teacher.deleteMany({});
  const hashedPassword = await bcrypt.hash('tap2read@teacher', 10);
  const teacher = await prisma.teacher.create({
    data: {
      name: 'Teacher',
      email: 'teacher@tap2read.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Teacher created → email: teacher@tap2read.com | password: tap2read@teacher');

  // ─── 2. Clean/Wipe all materials, activities, videos, and student data ─────
  await prisma.sightWord.deleteMany({});
  console.log('🧹 Sight Words cleared (0 items)');

  await prisma.shortStory.deleteMany({});
  console.log('🧹 Short Stories cleared (0 items)');

  await prisma.video.deleteMany({});
  console.log('🧹 Educational Videos cleared (0 items)');

  await prisma.activity.deleteMany({});
  console.log('🧹 Canva Activities cleared (0 items)');

  await prisma.studentSession.deleteMany({});
  console.log('🧹 Student Sessions cleared (0 items)');

  await prisma.contactMessage.deleteMany({});
  console.log('🧹 Contact Messages cleared (0 items)');

  console.log('🎉 Clean database setup complete! Only teacher account exists.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
