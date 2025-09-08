const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestUser() {
  const clerkId = process.argv[2];
  const email = process.argv[3];
  
  if (!clerkId || !email) {
    console.error('Usage: node scripts/create-test-user.js <clerkId> <email>');
    console.error('Example: node scripts/create-test-user.js user_2abc123 test@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
      },
      create: {
        clerkId,
        email,
        username: email.split('@')[0],
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        learningMinutes: 0,
      },
    });

    console.log('✅ User created/updated successfully:', user);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
