import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Tap2Read...');

  // ─── 1. Teacher (1 Teacher Only, No Superadmin) ───────────────────────────
  await prisma.teacher.deleteMany({});
  const hashedPassword = await bcrypt.hash('tap2read@teacher', 10);
  const teacher = await prisma.teacher.create({
    data: {
      name: 'Teacher',
      email: 'teacher@tap2read.com',
      password: hashedPassword,
    },
  });
  console.log('✅ 1 Teacher created → email: teacher@tap2read.com | password: tap2read@teacher');

  // ─── 2. Sight Words (Max 5 items) ─────────────────────────────────────────
  await prisma.sightWord.deleteMany({});
  const sightWordsData = [
    {
      word: 'Apple',
      imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
      displayOrder: 1,
    },
    {
      word: 'Butterfly',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80',
      displayOrder: 2,
    },
    {
      word: 'Elephant',
      imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
      displayOrder: 3,
    },
    {
      word: 'Rainbow',
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      displayOrder: 4,
    },
    {
      word: 'Sunflower',
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80',
      displayOrder: 5,
    },
  ];

  for (const sw of sightWordsData) {
    await prisma.sightWord.create({ data: sw });
  }
  console.log(`✅ ${sightWordsData.length} Sight Words seeded`);

  // ─── 3. Short Stories (Max 5 items) ───────────────────────────────────────
  await prisma.shortStory.deleteMany({});
  const shortStoriesData = [
    {
      title: 'The Little Red Hen',
      coverImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
      displayOrder: 1,
      content: `Once upon a time, in a cozy little farmyard, lived a hardworking Little Red Hen. One bright morning, she found some grains of wheat lying on the soil.

"Who will help me plant these seeds?" asked the Little Red Hen.
"Not I," barked the lazy dog.
"Not I," purred the sleepy cat.
"Not I," quacked the cheerful duck.

"Then I will do it myself," said the Little Red Hen. And she did. She planted the seeds, watered them each day, and watched them grow into tall, golden stalks of wheat.

When the wheat was ready, she harvested the grains and ground them into soft white flour. She baked a warm, crusty loaf of bread that filled the farm with a wonderful aroma.

"Who will help me eat this fresh bread?" asked the hen.
"I will!" barked the dog.
"I will!" meowed the cat.
"I will!" quacked the duck.

"No," smiled the Little Red Hen gently. "I did the planting, watering, and baking. But if you promise to work together with me next time, I will gladly share."

The animals learned the value of helping each other, and from that day onward, they always worked as a happy team.`,
    },
    {
      title: 'The Brave Lion and the Mouse',
      coverImage: 'https://images.unsplash.com/photo-1614027164847-1b28caa1407c?w=600&auto=format&fit=crop&q=80',
      displayOrder: 2,
      content: `In the heart of the sunny savannah, Leo the great lion lay dozing beneath a leafy acacia tree. A curious little mouse named Pip was scurrying through the tall grass and accidentally ran across Leo's warm paw.

Leo woke with a rumble and placed his huge paw over Pip. "How dare you disturb my peaceful slumber, tiny mouse?" roared Leo.

"Please forgive me, King Leo!" pleaded Pip, trembling. "Spare my life, and I promise that one day I might be able to help you in return!"

Leo laughed heartily. "A tiny creature like you help the mighty king of the jungle? That is hilarious!" Yet, finding Pip's bravery endearing, Leo lifted his paw and let him run free.

A few days later, hunters laid a strong rope trap in the forest. Leo stepped right into it and was hoisted high in the air, tightly bound. He let out a desperate roar that echoed across the valley.

Pip recognized Leo's roar and dashed to the rescue. Using his sharp little teeth, Pip chewed through the thick ropes one by one until the net snapped open. Leo tumbled safely to the ground.

"You saved my life, little friend," Leo said with deep respect. "I see now that kindness is never wasted, and even the smallest friend can be a true hero."`,
    },
    {
      title: 'The Star That Wanted to Dance',
      coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
      displayOrder: 3,
      content: `High in the deep velvet night sky twinkled Twila, a little silver star with an extraordinary dream. While the other stars remained perfectly still in their constellations, Twila loved watching children dance around campfires on Earth.

"I wish I could spin and twirl across the heavens!" Twila whispered to the wise silver Moon.

"Every star has its own special light," the Moon replied softly. "When your heart is filled with joy, your light will dance naturally."

One breezy evening, a celestial wind composed of stardust swept across the galaxies. Twila closed her eyes, listened to the gentle rhythm of the night, and leaped! She spun in graceful circles, leaving a glittering trail of gold, violet, and sky-blue sparks.

Down below, two siblings looked out their bedroom window in wonder. "Look, a shooting star is dancing!" they cried with big smiles, making wishes on her dazzling light.

Twila felt a warm, comforting glow in her heart. She realized that by daring to follow her joy, she brought happiness to dreamers miles away.`,
    },
    {
      title: 'The Magic Treehouse Adventure',
      coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
      displayOrder: 4,
      content: `At the edge of Greenleaf Forest stood an ancient oak tree with sturdy branches that reached toward the clouds. Built high in its sheltering boughs was a wooden treehouse crafted by siblings Maya and Toby.

One sunny Saturday, Maya carried up a stack of colorful illustrated books. As soon as Toby opened a book about ocean wonders, the floorboards began to glow with a gentle sea-green sparkle!

A soft ocean breeze blew through the windows. Outside, the grass turned into calm turquoise waters, and playful dolphins leaped through the air right past the balcony railing!

"Welcome, young readers!" called an emerald sea turtle swimming by. "Every page you read transports you to exciting realms of discovery!"

Maya and Toby read about coral reefs, ancient pyramid mysteries, and flying cloud islands. With every chapter they turned, their treehouse took them on an unforgettable journey of imagination and knowledge. When dusk arrived, they closed the book and returned safely to their backyard, excited for tomorrow's reading journey.`,
    },
    {
      title: 'Sunny the Helpful Turtle',
      coverImage: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&auto=format&fit=crop&q=80',
      displayOrder: 5,
      content: `Deep beneath the blue waters of Coral Bay lived Sunny, a small sea turtle with a shell polished smooth by ocean currents. Sunny was known as the slowest swimmer on the reef, but he had the most patient and caring heart.

Whenever the energetic fish swam by in a rush, Sunny took time to greet the anemone crabs, check on the baby seahorses, and clean stray kelp from the corals.

One afternoon, a sudden undersea current swept a young dolphin named Finn into a deep, unfamiliar cavern. The swift fish were too frightened of the dark caves to swim inside, but Sunny knew every quiet corner and tunnel of the reef.

"Stay close behind me, Finn," Sunny said warmly. With calm, steady paddle strokes, Sunny led Finn through the winding coral passageway, using bioluminescent jellyfish to light their way.

Soon they emerged into the warm sunlight where Finn's family was waiting. Everyone cheered for Sunny, proving that patience, courage, and a helpful spirit will always guide the way.`,
    },
  ];

  for (const story of shortStoriesData) {
    await prisma.shortStory.create({ data: story });
  }
  console.log(`✅ ${shortStoriesData.length} Short Stories seeded`);

  // ─── 4. Educational Videos (Max 5 items) ───────────────────────────────────
  await prisma.video.deleteMany({});
  const videosData = [
    {
      title: 'Phonics Letter Sounds: Learn A to Z',
      description: 'An interactive phonics adventure helping early learners master letter-sound associations, mouth shapes, and phonemic blending.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      displayOrder: 1,
    },
    {
      title: 'Sight Words Sing-Along with Animated Friends',
      description: 'Catchy melodies and rhythmic repetition designed to help kindergarten and grade 1 readers memorize common high-frequency words effortlessly.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
      displayOrder: 2,
    },
    {
      title: 'Story Comprehension & Picture Clues',
      description: 'Learn how to observe illustrations, identify character emotions, and predict story endings using visual context clues.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      displayOrder: 3,
    },
    {
      title: 'Vowel Sounds & Easy Word Families',
      description: 'Explore the magic of short and long vowel sounds with rhyming word families: -at, -en, -ig, -op, and -ug with engaging examples.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      displayOrder: 4,
    },
    {
      title: 'Interactive Storytime: Reading with Expression',
      description: 'Discover how using punctuation clues, voice modulation, and dramatic pauses brings storybook characters to life.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      displayOrder: 5,
    },
  ];

  for (const video of videosData) {
    await prisma.video.create({ data: video });
  }
  console.log(`✅ ${videosData.length} Educational Videos seeded`);

  // ─── 5. Canva Activities (Max 5 items) ─────────────────────────────────────
  await prisma.activity.deleteMany({});
  const activitiesData = [
    {
      title: 'Sight Words Matching Bingo',
      description: 'A colorful, printable bingo card activity where students match sight words with corresponding pictures to reinforce word recognition.',
      imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
      canvaLink: 'https://www.canva.com/templates/EAFAkZf11y8-sight-word-bingo-flashcards/',
      displayOrder: 1,
    },
    {
      title: 'Color, Trace & Read Worksheet',
      description: 'Multi-sensory worksheet combining handwriting trace practice, phonics pronunciation drills, and creative coloring for early readers.',
      imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
      canvaLink: 'https://www.canva.com/templates/EAF-pW82sck-handwriting-tracing-activity/',
      displayOrder: 2,
    },
    {
      title: 'Story Sequence Cut-and-Paste',
      description: 'Hands-on sequencing activity where children arrange illustrated story scenes into Beginning, Middle, and End order.',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      canvaLink: 'https://www.canva.com/templates/EAF9qP2B6d4-story-sequencing-cards/',
      displayOrder: 3,
    },
    {
      title: 'Rhyme Time Word Wheels',
      description: 'Interactive printable spin wheel helping children blend onset consonants with word family rimes to discover new vocabulary words.',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
      canvaLink: 'https://www.canva.com/templates/EAF8lK0m19w-rhyming-word-wheels/',
      displayOrder: 4,
    },
    {
      title: 'Alphabet & Phonics Scavenger Hunt',
      description: 'An exciting classroom or home scavenger hunt checklist that encourages children to discover everyday objects starting with target letters.',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      canvaLink: 'https://www.canva.com/templates/EAF7nH3w5Qe-phonics-scavenger-hunt/',
      displayOrder: 5,
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.create({ data: act });
  }
  console.log(`✅ ${activitiesData.length} Canva Activities seeded`);

  // ─── 6. Researchers (All 6 Team Members) ──────────────────────────────────
  await prisma.researcher.deleteMany({});
  const researchersData = [
    {
      id: 1,
      fullName: 'Bobis, Samantha',
      role: 'Content Lead & Reading Pedagogy',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      description: 'Passionate about early childhood reading development, curriculum localization, and foundational literacy pedagogy.',
      displayOrder: 1,
    },
    {
      id: 2,
      fullName: 'Cabaral, Joshua',
      role: 'Technical Lead & Software Architecture',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      description: 'Specializes in multimedia learning systems, full-stack digital architectures, and accessible user experiences for young learners.',
      displayOrder: 2,
    },
    {
      id: 3,
      fullName: 'Capa, Jasmine',
      role: 'Curriculum Designer & Instructional Media',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      description: 'Focuses on elementary reading strategies, story-based learning interventions, and visual literacy aids.',
      displayOrder: 3,
    },
    {
      id: 4,
      fullName: 'Curato, Kesiya Jean',
      role: 'Evaluation Specialist & Data Analytics',
      photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
      description: 'Dedicated to assessing reading comprehension outcomes, digital engagement metrics, and interactive learning efficacy.',
      displayOrder: 4,
    },
    {
      id: 5,
      fullName: 'Margate, Czarina Kate',
      role: 'Activity Developer & Creative Director',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      description: 'Creates interactive Canva learning worksheets, gamified reading puzzles, and engaging creative exercises tailored for children.',
      displayOrder: 5,
    },
    {
      id: 6,
      fullName: 'Piñon, Jhonabelle',
      role: 'Instructional Designer & Student Experience',
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      description: 'Designs intuitive reading journeys, scaffolded literacy pathways, and supportive classroom implementation frameworks.',
      displayOrder: 6,
    },
  ];

  for (const res of researchersData) {
    await prisma.researcher.create({ data: res });
  }
  console.log(`✅ ${researchersData.length} Researchers seeded`);

  // ─── 7. Student Sessions ──────────────────────────────────────────────────
  await prisma.studentSession.deleteMany({});
  const studentSessionsData = [
    { fullName: 'Liam Garcia', sessionToken: uuidv4() },
    { fullName: 'Emma Santos', sessionToken: uuidv4() },
    { fullName: 'Noah Reyes', sessionToken: uuidv4() },
    { fullName: 'Sophia Mendoza', sessionToken: uuidv4() },
    { fullName: 'Lucas Bautista', sessionToken: uuidv4() },
  ];

  for (const session of studentSessionsData) {
    await prisma.studentSession.create({ data: session });
  }
  console.log(`✅ ${studentSessionsData.length} Student Sessions seeded`);

  // ─── 8. Contact Messages ──────────────────────────────────────────────────
  await prisma.contactMessage.deleteMany({});
  const contactMessagesData = [
    {
      senderName: 'Maria Santos',
      senderEmail: 'maria.santos@gmail.com',
      message: 'Good day! My Grade 1 daughter loves reading the short stories on Tap2Read every evening. Are there upcoming printable worksheets we can practice with at home?',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      senderName: 'Teacher Grace Fernandez',
      senderEmail: 'grace.fernandez@school.edu.ph',
      message: 'Hello Tap2Read team! We tested the sight words module in our classroom reading corner today and the students were so engaged! Thank you for developing this wonderful tool.',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    },
    {
      senderName: 'Carlos Dizon',
      senderEmail: 'carlos.dizon@gmail.com',
      message: 'Thank you for this wonderful resource. The educational videos with phonics drills are very helpful for beginner readers who need audio visual guidance.',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
      senderName: 'Principal Elena Ramos',
      senderEmail: 'elena.ramos@deped.gov.ph',
      message: 'Greetings to the research team. We would like to commend your research initiative on multimedia reading tools. Is there an orientation session available for elementary teachers?',
      sentAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
  ];

  for (const msg of contactMessagesData) {
    await prisma.contactMessage.create({ data: msg });
  }
  console.log(`✅ ${contactMessagesData.length} Contact Messages seeded`);

  console.log('🎉 Seeding complete! All entities have rich sample data.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
