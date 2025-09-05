-- AlterTable
ALTER TABLE "public"."Slide" ADD COLUMN     "background" JSONB,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "gridLayout" JSONB,
ADD COLUMN     "theme" JSONB,
ADD COLUMN     "transition" TEXT DEFAULT 'none';

-- CreateTable
CREATE TABLE "public"."EnhancedAsset" (
    "id" TEXT NOT NULL,
    "courseId" TEXT,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "sha256Hash" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "transcript" TEXT,
    "altText" TEXT,
    "tags" TEXT[],
    "folderId" TEXT,
    "embedding" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "EnhancedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssetFolder" (
    "id" TEXT NOT NULL,
    "courseId" TEXT,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AICommand" (
    "id" TEXT NOT NULL,
    "courseId" TEXT,
    "slideId" TEXT,
    "type" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "result" JSONB,
    "error" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "AICommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomComponent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "compiledCode" TEXT,
    "dependencies" TEXT[],
    "propSchema" JSONB NOT NULL,
    "defaultProps" JSONB NOT NULL,
    "defaultSize" JSONB NOT NULL,
    "minSize" JSONB NOT NULL,
    "maxSize" JSONB,
    "category" TEXT NOT NULL DEFAULT 'custom',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "completedSlides" INTEGER NOT NULL DEFAULT 0,
    "totalSlides" INTEGER NOT NULL DEFAULT 0,
    "progressSnapshot" JSONB,
    "deviceInfo" JSONB,
    "ipAddress" TEXT,

    CONSTRAINT "CourseSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SlideView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "slideId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "subModuleId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "scrollDepth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "exitReason" TEXT,

    CONSTRAINT "SlideView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InteractionEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "slideId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteractionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "averageSessionLength" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3),
    "firstAccessedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "totalInteractions" INTEGER NOT NULL DEFAULT 0,
    "quizAverageScore" DOUBLE PRECISION,
    "preferredTimeOfDay" TEXT,
    "mostActiveDay" TEXT,
    "strugglingTopics" JSONB[],
    "strongTopics" JSONB[],

    CONSTRAINT "CourseAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnhancedAsset_sha256Hash_key" ON "public"."EnhancedAsset"("sha256Hash");

-- CreateIndex
CREATE INDEX "EnhancedAsset_courseId_idx" ON "public"."EnhancedAsset"("courseId");

-- CreateIndex
CREATE INDEX "EnhancedAsset_sha256Hash_idx" ON "public"."EnhancedAsset"("sha256Hash");

-- CreateIndex
CREATE INDEX "EnhancedAsset_folderId_idx" ON "public"."EnhancedAsset"("folderId");

-- CreateIndex
CREATE INDEX "AssetFolder_courseId_idx" ON "public"."AssetFolder"("courseId");

-- CreateIndex
CREATE INDEX "AssetFolder_parentId_idx" ON "public"."AssetFolder"("parentId");

-- CreateIndex
CREATE INDEX "AICommand_courseId_idx" ON "public"."AICommand"("courseId");

-- CreateIndex
CREATE INDEX "AICommand_slideId_idx" ON "public"."AICommand"("slideId");

-- CreateIndex
CREATE INDEX "AICommand_type_idx" ON "public"."AICommand"("type");

-- CreateIndex
CREATE INDEX "AICommand_status_idx" ON "public"."AICommand"("status");

-- CreateIndex
CREATE INDEX "CustomComponent_createdBy_idx" ON "public"."CustomComponent"("createdBy");

-- CreateIndex
CREATE INDEX "CustomComponent_isPublic_idx" ON "public"."CustomComponent"("isPublic");

-- CreateIndex
CREATE INDEX "CustomComponent_category_idx" ON "public"."CustomComponent"("category");

-- CreateIndex
CREATE INDEX "CourseSession_userId_idx" ON "public"."CourseSession"("userId");

-- CreateIndex
CREATE INDEX "CourseSession_courseId_idx" ON "public"."CourseSession"("courseId");

-- CreateIndex
CREATE INDEX "CourseSession_startedAt_idx" ON "public"."CourseSession"("startedAt");

-- CreateIndex
CREATE INDEX "SlideView_userId_idx" ON "public"."SlideView"("userId");

-- CreateIndex
CREATE INDEX "SlideView_sessionId_idx" ON "public"."SlideView"("sessionId");

-- CreateIndex
CREATE INDEX "SlideView_slideId_idx" ON "public"."SlideView"("slideId");

-- CreateIndex
CREATE INDEX "SlideView_viewedAt_idx" ON "public"."SlideView"("viewedAt");

-- CreateIndex
CREATE INDEX "InteractionEvent_userId_idx" ON "public"."InteractionEvent"("userId");

-- CreateIndex
CREATE INDEX "InteractionEvent_sessionId_idx" ON "public"."InteractionEvent"("sessionId");

-- CreateIndex
CREATE INDEX "InteractionEvent_eventType_idx" ON "public"."InteractionEvent"("eventType");

-- CreateIndex
CREATE INDEX "InteractionEvent_timestamp_idx" ON "public"."InteractionEvent"("timestamp");

-- CreateIndex
CREATE INDEX "CourseAnalytics_userId_idx" ON "public"."CourseAnalytics"("userId");

-- CreateIndex
CREATE INDEX "CourseAnalytics_courseId_idx" ON "public"."CourseAnalytics"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseAnalytics_userId_courseId_key" ON "public"."CourseAnalytics"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."EnhancedAsset" ADD CONSTRAINT "EnhancedAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."AssetFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssetFolder" ADD CONSTRAINT "AssetFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."AssetFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseSession" ADD CONSTRAINT "CourseSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseSession" ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SlideView" ADD CONSTRAINT "SlideView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SlideView" ADD CONSTRAINT "SlideView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."CourseSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InteractionEvent" ADD CONSTRAINT "InteractionEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InteractionEvent" ADD CONSTRAINT "InteractionEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."CourseSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseAnalytics" ADD CONSTRAINT "CourseAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseAnalytics" ADD CONSTRAINT "CourseAnalytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
