const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });
    
    console.log(`\n📋 Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkId}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('\n💡 To sync your Clerk user, run:');
      console.log('   1. Log in to the app');
      console.log('   2. The system will auto-sync your user');
      console.log('   OR');
      console.log('   3. Use: node scripts/sync-current-user.js <clerk-id> <email>');
    }
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
