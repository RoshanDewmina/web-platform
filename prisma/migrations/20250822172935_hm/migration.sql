-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "public"."VersionStatus" AS ENUM ('DRAFT', 'PROPOSED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'DRAG_DROP', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "public"."EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'DROPPED');

-- CreateEnum
CREATE TYPE "public"."AchievementCategory" AS ENUM ('PROGRESS', 'SKILL', 'SOCIAL', 'TIME', 'STREAK', 'SPECIAL');

-- CreateEnum
CREATE TYPE "public"."FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('COURSE_ENROLLED', 'LESSON_COMPLETED', 'QUIZ_PASSED', 'ACHIEVEMENT_EARNED', 'STREAK_MILESTONE', 'LEVEL_UP', 'FRIEND_ADDED');

-- CreateEnum
CREATE TYPE "public"."GroupRole" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "learningMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "estimatedHours" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "scheduledPublishAt" TIMESTAMP(3),
    "accessControl" JSONB,
    "enrollmentLimit" INTEGER,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Module" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "videoUrl" TEXT,
    "duration" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Slide" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "template" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContentBlock" (
    "id" TEXT NOT NULL,
    "slideId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "settings" JSONB,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "previewImage" TEXT,
    "category" TEXT NOT NULL,
    "blockStructure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passingScore" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "timeLimit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "type" "public"."QuestionType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" JSONB NOT NULL,
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" "public"."EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" "public"."AchievementCategory" NOT NULL,
    "requirement" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FriendRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Friendship" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudyGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxMembers" INTEGER NOT NULL DEFAULT 10,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudyGroupMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "role" "public"."GroupRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudyGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseVersion" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."VersionStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "CourseVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApprovalRequest" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "status" "public"."ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "submittedBy" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "public"."User"("clerkId");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "Course_category_idx" ON "public"."Course"("category");

-- CreateIndex
CREATE INDEX "Course_isPublished_idx" ON "public"."Course"("isPublished");

-- CreateIndex
CREATE INDEX "Module_courseId_idx" ON "public"."Module"("courseId");

-- CreateIndex
CREATE INDEX "Lesson_moduleId_idx" ON "public"."Lesson"("moduleId");

-- CreateIndex
CREATE INDEX "Slide_lessonId_idx" ON "public"."Slide"("lessonId");

-- CreateIndex
CREATE INDEX "ContentBlock_slideId_idx" ON "public"."ContentBlock"("slideId");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "public"."Template"("category");

-- CreateIndex
CREATE INDEX "Quiz_lessonId_idx" ON "public"."Quiz"("lessonId");

-- CreateIndex
CREATE INDEX "Question_quizId_idx" ON "public"."Question"("quizId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "public"."QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "public"."QuizAttempt"("quizId");

-- CreateIndex
CREATE INDEX "Enrollment_userId_idx" ON "public"."Enrollment"("userId");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "public"."Enrollment"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "public"."Enrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "Progress_userId_idx" ON "public"."Progress"("userId");

-- CreateIndex
CREATE INDEX "Progress_lessonId_idx" ON "public"."Progress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON "public"."Progress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "public"."Achievement"("category");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "public"."UserAchievement"("userId");

-- CreateIndex
CREATE INDEX "UserAchievement_achievementId_idx" ON "public"."UserAchievement"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "public"."UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "FriendRequest_senderId_idx" ON "public"."FriendRequest"("senderId");

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_idx" ON "public"."FriendRequest"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "public"."FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Friendship_userId_idx" ON "public"."Friendship"("userId");

-- CreateIndex
CREATE INDEX "Friendship_friendId_idx" ON "public"."Friendship"("friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON "public"."Friendship"("userId", "friendId");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "public"."Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "public"."Activity"("createdAt");

-- CreateIndex
CREATE INDEX "StudyGroupMember_userId_idx" ON "public"."StudyGroupMember"("userId");

-- CreateIndex
CREATE INDEX "StudyGroupMember_groupId_idx" ON "public"."StudyGroupMember"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroupMember_userId_groupId_key" ON "public"."StudyGroupMember"("userId", "groupId");

-- CreateIndex
CREATE INDEX "Message_groupId_idx" ON "public"."Message"("groupId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt");

-- CreateIndex
CREATE INDEX "Certificate_userId_idx" ON "public"."Certificate"("userId");

-- CreateIndex
CREATE INDEX "Certificate_courseId_idx" ON "public"."Certificate"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "public"."Certificate"("userId", "courseId");

-- CreateIndex
CREATE INDEX "CourseVersion_courseId_idx" ON "public"."CourseVersion"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseVersion_courseId_version_key" ON "public"."CourseVersion"("courseId", "version");

-- CreateIndex
CREATE INDEX "ApprovalRequest_courseId_idx" ON "public"."ApprovalRequest"("courseId");

-- CreateIndex
CREATE INDEX "ApprovalRequest_versionId_idx" ON "public"."ApprovalRequest"("versionId");

-- AddForeignKey
ALTER TABLE "public"."Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Slide" ADD CONSTRAINT "Slide_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContentBlock" ADD CONSTRAINT "ContentBlock_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "public"."Slide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Progress" ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudyGroupMember" ADD CONSTRAINT "StudyGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudyGroupMember" ADD CONSTRAINT "StudyGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."StudyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseVersion" ADD CONSTRAINT "CourseVersion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "public"."CourseVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
