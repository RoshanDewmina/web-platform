const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEnrollment() {
  const userEmail = process.argv[2];
  const courseId = process.argv[3];
  
  if (!userEmail) {
    console.error('Usage: node scripts/test-enrollment.js <user-email> [course-id]');
    process.exit(1);
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      console.error('❌ User not found with email:', userEmail);
      process.exit(1);
    }
    
    console.log('✅ Found user:', { id: user.id, email: user.email });
    
    // Get a course if not specified
    let targetCourseId = courseId;
    if (!targetCourseId) {
      const course = await prisma.course.findFirst({
        where: { isPublished: true },
      });
      
      if (!course) {
        console.error('❌ No published courses found');
        process.exit(1);
      }
      
      targetCourseId = course.id;
      console.log('✅ Using course:', course.title);
    }
    
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: targetCourseId,
        },
      },
    });
    
    if (existingEnrollment) {
      console.log('⚠️  Already enrolled in this course');
      return;
    }
    
    // Try to enroll
    console.log('\n📝 Attempting enrollment...');
    
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: targetCourseId,
        status: 'ACTIVE',
        progress: 0,
      },
    });
    
    console.log('✅ Enrollment created:', enrollment);
    
    // Create progress records
    const modules = await prisma.module.findMany({
      where: { courseId: targetCourseId },
      include: { lessons: true },
    });
    
    let progressCount = 0;
    for (const module of modules) {
      for (const lesson of module.lessons) {
        try {
          await prisma.progress.create({
            data: {
              userId: user.id,
              lessonId: lesson.id,
              completed: false,
              timeSpent: 0,
            },
          });
          progressCount++;
        } catch (err) {
          console.warn('⚠️  Progress record may already exist for lesson:', lesson.id);
        }
      }
    }
    
    console.log(`✅ Created ${progressCount} progress records`);
    console.log('\n🎉 Enrollment successful!');
    
  } catch (error) {
    console.error('\n❌ Error during enrollment:', error);
    console.error('\nError details:', {
      name: error.name,
      message: error.message,
      code: error.code,
    });
  } finally {
    await prisma.$disconnect();
  }
}

testEnrollment();
