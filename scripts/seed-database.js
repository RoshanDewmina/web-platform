const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Create some courses
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Web Development Fundamentals',
          description: 'Learn the basics of web development including HTML, CSS, and JavaScript',
          category: 'Web Development',
          difficulty: 'BEGINNER',
          estimatedHours: 20,
          tags: ['html', 'css', 'javascript', 'web'],
          isPublished: true,
          visibility: 'PUBLIC',
          modules: {
            create: [
              {
                title: 'Introduction to HTML',
                description: 'Learn the building blocks of web pages',
                orderIndex: 0,
                lessons: {
                  create: [
                    {
                      title: 'What is HTML?',
                      description: 'Understanding the HyperText Markup Language',
                      orderIndex: 0,
                      duration: 15,
                      xpReward: 10,
                      content: { type: 'introduction' },
                      contentType: 'SLIDES',
                    },
                    {
                      title: 'HTML Elements and Tags',
                      description: 'Learn about HTML elements and how to use them',
                      orderIndex: 1,
                      duration: 20,
                      xpReward: 15,
                      content: { type: 'tutorial' },
                      contentType: 'SLIDES',
                    },
                  ],
                },
              },
              {
                title: 'CSS Styling',
                description: 'Make your web pages beautiful with CSS',
                orderIndex: 1,
                lessons: {
                  create: [
                    {
                      title: 'Introduction to CSS',
                      description: 'Understanding Cascading Style Sheets',
                      orderIndex: 0,
                      duration: 20,
                      xpReward: 15,
                      content: { type: 'introduction' },
                      contentType: 'SLIDES',
                    },
                  ],
                },
              },
            ],
          },
        },
      }),
      prisma.course.create({
        data: {
          title: 'React.js Mastery',
          description: 'Master React.js and build modern web applications',
          category: 'Web Development',
          difficulty: 'INTERMEDIATE',
          estimatedHours: 40,
          tags: ['react', 'javascript', 'frontend', 'spa'],
          isPublished: true,
          visibility: 'PUBLIC',
          modules: {
            create: [
              {
                title: 'React Basics',
                description: 'Get started with React',
                orderIndex: 0,
                lessons: {
                  create: [
                    {
                      title: 'Introduction to React',
                      description: 'What is React and why use it?',
                      orderIndex: 0,
                      duration: 30,
                      xpReward: 20,
                      content: { type: 'introduction' },
                      contentType: 'SLIDES',
                    },
                    {
                      title: 'Components and Props',
                      description: 'Building blocks of React applications',
                      orderIndex: 1,
                      duration: 45,
                      xpReward: 25,
                      content: { type: 'tutorial' },
                      contentType: 'SLIDES',
                    },
                  ],
                },
              },
            ],
          },
        },
      }),
      prisma.course.create({
        data: {
          title: 'Renewable Energy in Ontario',
          description: 'Explore renewable energy sources and sustainability in Ontario',
          category: 'Energy & Sustainability',
          difficulty: 'BEGINNER',
          estimatedHours: 15,
          tags: ['renewable', 'energy', 'sustainability', 'ontario'],
          isPublished: true,
          visibility: 'PUBLIC',
          modules: {
            create: [
              {
                title: 'Introduction to Renewable Energy',
                description: 'Understanding renewable energy sources',
                orderIndex: 0,
                lessons: {
                  create: [
                    {
                      title: 'What is Renewable Energy?',
                      description: 'Overview of renewable energy sources',
                      orderIndex: 0,
                      duration: 25,
                      xpReward: 15,
                      content: { type: 'introduction' },
                      contentType: 'SLIDES',
                    },
                  ],
                },
              },
            ],
          },
        },
      }),
    ]);

    console.log(`✅ Created ${courses.length} courses with modules and lessons\n`);

    // Create some achievements
    const achievements = await Promise.all([
      prisma.achievement.create({
        data: {
          name: 'First Steps',
          description: 'Complete your first lesson',
          icon: '👟',
          category: 'PROGRESS',
          requirement: { type: 'lessons_completed', count: 1 },
          xpReward: 50,
        },
      }),
      prisma.achievement.create({
        data: {
          name: 'Quick Learner',
          description: 'Complete 5 lessons',
          icon: '⚡',
          category: 'PROGRESS',
          requirement: { type: 'lessons_completed', count: 5 },
          xpReward: 100,
        },
      }),
      prisma.achievement.create({
        data: {
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: '🔥',
          category: 'STREAK',
          requirement: { type: 'streak_days', count: 7 },
          xpReward: 150,
        },
      }),
    ]);

    console.log(`✅ Created ${achievements.length} achievements\n`);

    // Create some templates
    const templates = await Promise.all([
      prisma.template.create({
        data: {
          name: 'Title Slide',
          description: 'A simple title slide with heading and subtitle',
          category: 'intro',
          blockStructure: {
            blocks: [
              {
                type: 'heading',
                content: { text: 'Title Here' },
                position: { x: 0, y: 0, w: 12, h: 2 },
              },
              {
                type: 'text',
                content: { text: 'Subtitle here' },
                position: { x: 0, y: 2, w: 12, h: 1 },
              },
            ],
          },
        },
      }),
      prisma.template.create({
        data: {
          name: 'Two Column Layout',
          description: 'Content split into two columns',
          category: 'content',
          blockStructure: {
            blocks: [
              {
                type: 'text',
                content: { text: 'Left column content' },
                position: { x: 0, y: 0, w: 6, h: 4 },
              },
              {
                type: 'text',
                content: { text: 'Right column content' },
                position: { x: 6, y: 0, w: 6, h: 4 },
              },
            ],
          },
        },
      }),
    ]);

    console.log(`✅ Created ${templates.length} slide templates\n`);

    console.log('🎉 Database seeded successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
