const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncCurrentUser() {
  const clerkId = process.argv[2];
  const email = process.argv[3];
  const username = process.argv[4];
  
  if (!clerkId || !email) {
    console.error('Usage: node scripts/sync-current-user.js <clerkId> <email> [username]');
    console.error('\nTo get your Clerk ID:');
    console.error('1. Open browser DevTools (F12) while logged in');
    console.error('2. Go to Console');
    console.error('3. Type: Clerk.user');
    console.error('4. Copy the "id" field');
    console.error('\nExample: node scripts/sync-current-user.js user_2abc123 test@example.com testuser');
    process.exit(1);
  }

  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        username: username || email.split('@')[0],
      },
      create: {
        clerkId,
        email,
        username: username || email.split('@')[0],
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        learningMinutes: 0,
      },
    });

    console.log('✅ User synced successfully!');
    console.log('User details:', {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
    });
    
    console.log('\n🎉 You can now enroll in courses!');
  } catch (error) {
    console.error('❌ Error syncing user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncCurrentUser();
