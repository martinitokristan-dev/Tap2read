/**
 * ensure-teacher.ts
 * Safe script that runs during production build to guarantee the default
 * teacher account exists. It does NOT delete any existing data.
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'teacher@tap2read.com';
  const existing = await prisma.teacher.findFirst({ where: { email } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('tap2read@teacher', 10);
    await prisma.teacher.create({
      data: {
        name: 'Teacher',
        email,
        password: hashedPassword,
      },
    });
    console.log('✅ Default teacher account created.');
  } else {
    console.log('✅ Teacher account already exists — skipping creation.');
  }
}

main()
  .catch((e) => {
    console.error('❌ ensure-teacher error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
