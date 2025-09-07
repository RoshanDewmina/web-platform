-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('SLIDES', 'MDX', 'JSON_BLOCKS');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'SLIDES',
ADD COLUMN     "mdxContent" TEXT,
ADD COLUMN     "jsonBlocks" JSONB,
ADD COLUMN     "contentMetadata" JSONB,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "assets" JSONB[];

-- Add index for content type queries
CREATE INDEX "Lesson_contentType_idx" ON "Lesson"("contentType");
