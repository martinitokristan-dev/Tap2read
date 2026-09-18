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

  // ─── 3. Seed Researchers (Fixed 6-member team, always required) ────────────
  await prisma.researcher.deleteMany({});
  const researchersData = [
    {
      id: 1,
      fullName: 'Bobis, Samantha',
      role: 'Content Lead & Reading Pedagogy',
      photoUrl: '',
      description: 'Passionate about early childhood reading development, curriculum localization, and foundational literacy pedagogy.',
      displayOrder: 1,
    },
    {
      id: 2,
      fullName: 'Cabaral, Joshua',
      role: 'Technical Lead & Software Architecture',
      photoUrl: '',
      description: 'Specializes in multimedia learning systems, full-stack digital architectures, and accessible user experiences for young learners.',
      displayOrder: 2,
    },
    {
      id: 3,
      fullName: 'Capa, Jasmine',
      role: 'Curriculum Designer & Instructional Media',
      photoUrl: '',
      description: 'Focuses on elementary reading strategies, story-based learning interventions, and visual literacy aids.',
      displayOrder: 3,
    },
    {
      id: 4,
      fullName: 'Curato, Kesiya Jean',
      role: 'Evaluation Specialist & Data Analytics',
      photoUrl: '',
      description: 'Dedicated to assessing reading comprehension outcomes, digital engagement metrics, and interactive learning efficacy.',
      displayOrder: 4,
    },
    {
      id: 5,
      fullName: 'Margate, Czarina Kate',
      role: 'Activity Developer & Creative Director',
      photoUrl: '',
      description: 'Creates interactive Canva learning worksheets, gamified reading puzzles, and engaging creative exercises tailored for children.',
      displayOrder: 5,
    },
    {
      id: 6,
      fullName: 'Piñon, Jhonabelle',
      role: 'Instructional Designer & Student Experience',
      photoUrl: '',
      description: 'Designs intuitive reading journeys, scaffolded literacy pathways, and supportive classroom implementation frameworks.',
      displayOrder: 6,
    },
  ];
  for (const res of researchersData) {
    await prisma.researcher.create({ data: res });
  }
  console.log('✅ 6 Researchers seeded');

  console.log('🎉 Clean database setup complete! Teacher account + Researchers exist.');

}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
