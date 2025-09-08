--
-- PostgreSQL database dump
--

\restrict Ni3OMyUkyOuuimcChTWKAlYxiaBQS0iY0EeY4FJWBn2v3VDifp09LHjNQraJO4P

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AchievementCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AchievementCategory" AS ENUM (
    'PROGRESS',
    'SKILL',
    'SOCIAL',
    'TIME',
    'STREAK',
    'SPECIAL'
);


ALTER TYPE public."AchievementCategory" OWNER TO postgres;

--
-- Name: ActivityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ActivityType" AS ENUM (
    'COURSE_ENROLLED',
    'LESSON_COMPLETED',
    'QUIZ_PASSED',
    'ACHIEVEMENT_EARNED',
    'STREAK_MILESTONE',
    'LEVEL_UP',
    'FRIEND_ADDED'
);


ALTER TYPE public."ActivityType" OWNER TO postgres;

--
-- Name: ApprovalStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ApprovalStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."ApprovalStatus" OWNER TO postgres;

--
-- Name: ContentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContentType" AS ENUM (
    'SLIDES',
    'MDX',
    'JSON_BLOCKS'
);


ALTER TYPE public."ContentType" OWNER TO postgres;

--
-- Name: Difficulty; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Difficulty" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'EXPERT'
);


ALTER TYPE public."Difficulty" OWNER TO postgres;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'PAUSED',
    'DROPPED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO postgres;

--
-- Name: FriendRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FriendRequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED'
);


ALTER TYPE public."FriendRequestStatus" OWNER TO postgres;

--
-- Name: GroupRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."GroupRole" AS ENUM (
    'ADMIN',
    'MODERATOR',
    'MEMBER'
);


ALTER TYPE public."GroupRole" OWNER TO postgres;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLE_CHOICE',
    'TRUE_FALSE',
    'FILL_BLANK',
    'DRAG_DROP',
    'SHORT_ANSWER'
);


ALTER TYPE public."QuestionType" OWNER TO postgres;

--
-- Name: VersionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VersionStatus" AS ENUM (
    'DRAFT',
    'PROPOSED',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."VersionStatus" OWNER TO postgres;

--
-- Name: Visibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Visibility" AS ENUM (
    'PUBLIC',
    'PRIVATE',
    'RESTRICTED'
);


ALTER TYPE public."Visibility" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AICommand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AICommand" (
    id text NOT NULL,
    "courseId" text,
    "slideId" text,
    type text NOT NULL,
    parameters jsonb NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    result jsonb,
    error text,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "executedAt" timestamp(3) without time zone
);


ALTER TABLE public."AICommand" OWNER TO postgres;

--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    category public."AchievementCategory" NOT NULL,
    requirement jsonb NOT NULL,
    "xpReward" integer DEFAULT 50 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO postgres;

--
-- Name: Activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Activity" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text,
    type public."ActivityType" NOT NULL,
    description text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Activity" OWNER TO postgres;

--
-- Name: ApprovalRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ApprovalRequest" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "versionId" text NOT NULL,
    status public."ApprovalStatus" DEFAULT 'PENDING'::public."ApprovalStatus" NOT NULL,
    "submittedBy" text,
    "reviewedBy" text,
    "reviewedAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ApprovalRequest" OWNER TO postgres;

--
-- Name: AssetFolder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AssetFolder" (
    id text NOT NULL,
    "courseId" text,
    name text NOT NULL,
    "parentId" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssetFolder" OWNER TO postgres;

--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "certificateUrl" text NOT NULL,
    "issuedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Certificate" OWNER TO postgres;

--
-- Name: ContentBlock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContentBlock" (
    id text NOT NULL,
    "slideId" text NOT NULL,
    type text NOT NULL,
    content jsonb NOT NULL,
    settings jsonb,
    "orderIndex" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ContentBlock" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    thumbnail text,
    difficulty public."Difficulty" DEFAULT 'BEGINNER'::public."Difficulty" NOT NULL,
    "estimatedHours" double precision NOT NULL,
    category text NOT NULL,
    tags text[],
    "isPublished" boolean DEFAULT false NOT NULL,
    visibility public."Visibility" DEFAULT 'PUBLIC'::public."Visibility" NOT NULL,
    "scheduledPublishAt" timestamp(3) without time zone,
    "accessControl" jsonb,
    "enrollmentLimit" integer,
    price double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: CourseAnalytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseAnalytics" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "totalSessions" integer DEFAULT 0 NOT NULL,
    "totalTimeSpent" integer DEFAULT 0 NOT NULL,
    "averageSessionLength" integer DEFAULT 0 NOT NULL,
    "completionRate" double precision DEFAULT 0 NOT NULL,
    "lastAccessedAt" timestamp(3) without time zone,
    "firstAccessedAt" timestamp(3) without time zone,
    "completedAt" timestamp(3) without time zone,
    "totalInteractions" integer DEFAULT 0 NOT NULL,
    "quizAverageScore" double precision,
    "preferredTimeOfDay" text,
    "mostActiveDay" text,
    "strugglingTopics" jsonb[],
    "strongTopics" jsonb[]
);


ALTER TABLE public."CourseAnalytics" OWNER TO postgres;

--
-- Name: CourseSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseSession" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endedAt" timestamp(3) without time zone,
    "totalDuration" integer DEFAULT 0 NOT NULL,
    "completedSlides" integer DEFAULT 0 NOT NULL,
    "totalSlides" integer DEFAULT 0 NOT NULL,
    "progressSnapshot" jsonb,
    "deviceInfo" jsonb,
    "ipAddress" text
);


ALTER TABLE public."CourseSession" OWNER TO postgres;

--
-- Name: CourseVersion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseVersion" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    version integer NOT NULL,
    label text,
    data jsonb NOT NULL,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."VersionStatus" DEFAULT 'DRAFT'::public."VersionStatus" NOT NULL
);


ALTER TABLE public."CourseVersion" OWNER TO postgres;

--
-- Name: CustomComponent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomComponent" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    code text NOT NULL,
    "compiledCode" text,
    dependencies text[],
    "propSchema" jsonb NOT NULL,
    "defaultProps" jsonb NOT NULL,
    "defaultSize" jsonb NOT NULL,
    "minSize" jsonb NOT NULL,
    "maxSize" jsonb,
    category text DEFAULT 'custom'::text NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    version integer DEFAULT 1 NOT NULL,
    "usageCount" integer DEFAULT 0 NOT NULL,
    rating double precision DEFAULT 0 NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CustomComponent" OWNER TO postgres;

--
-- Name: EnhancedAsset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EnhancedAsset" (
    id text NOT NULL,
    "courseId" text,
    filename text NOT NULL,
    "originalName" text NOT NULL,
    "mimeType" text NOT NULL,
    "fileSize" integer NOT NULL,
    url text NOT NULL,
    "thumbnailUrl" text,
    "sha256Hash" text NOT NULL,
    width integer,
    height integer,
    duration integer,
    transcript text,
    "altText" text,
    tags text[],
    "folderId" text,
    embedding double precision[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text
);


ALTER TABLE public."EnhancedAsset" OWNER TO postgres;

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollment" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ACTIVE'::public."EnrollmentStatus" NOT NULL,
    progress double precision DEFAULT 0 NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."Enrollment" OWNER TO postgres;

--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FriendRequest" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    status public."FriendRequestStatus" DEFAULT 'PENDING'::public."FriendRequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO postgres;

--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friendship" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "friendId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Friendship" OWNER TO postgres;

--
-- Name: InteractionEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InteractionEvent" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "sessionId" text NOT NULL,
    "slideId" text,
    "eventType" text NOT NULL,
    "eventName" text NOT NULL,
    "eventData" jsonb NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InteractionEvent" OWNER TO postgres;

--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    "moduleId" text NOT NULL,
    title text NOT NULL,
    description text,
    content jsonb NOT NULL,
    "videoUrl" text,
    duration integer,
    "orderIndex" integer NOT NULL,
    "xpReward" integer DEFAULT 10 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    assets jsonb[],
    "contentMetadata" jsonb,
    "contentType" public."ContentType" DEFAULT 'SLIDES'::public."ContentType" NOT NULL,
    "coverImage" text,
    "jsonBlocks" jsonb,
    "mdxContent" text
);


ALTER TABLE public."Lesson" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "groupId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Module" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    description text,
    "orderIndex" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Module" OWNER TO postgres;

--
-- Name: Progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Progress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "timeSpent" integer DEFAULT 0 NOT NULL,
    "lastAccessedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Progress" OWNER TO postgres;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Question" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    type public."QuestionType" NOT NULL,
    question text NOT NULL,
    options jsonb,
    "correctAnswer" jsonb NOT NULL,
    explanation text,
    points integer DEFAULT 1 NOT NULL,
    "orderIndex" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Question" OWNER TO postgres;

--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quiz" (
    id text NOT NULL,
    "lessonId" text,
    title text NOT NULL,
    description text,
    "passingScore" double precision DEFAULT 70 NOT NULL,
    "maxAttempts" integer DEFAULT 3 NOT NULL,
    "timeLimit" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Quiz" OWNER TO postgres;

--
-- Name: QuizAttempt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizAttempt" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizId" text NOT NULL,
    score double precision NOT NULL,
    answers jsonb NOT NULL,
    "completedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timeSpent" integer
);


ALTER TABLE public."QuizAttempt" OWNER TO postgres;

--
-- Name: Slide; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Slide" (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    title text NOT NULL,
    notes text,
    template text,
    "orderIndex" integer NOT NULL,
    "gridLayout" jsonb,
    theme jsonb,
    transition text DEFAULT 'none'::text,
    duration integer,
    background jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Slide" OWNER TO postgres;

--
-- Name: SlideView; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SlideView" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "sessionId" text NOT NULL,
    "slideId" text NOT NULL,
    "moduleId" text NOT NULL,
    "subModuleId" text NOT NULL,
    "viewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timeSpent" integer DEFAULT 0 NOT NULL,
    "scrollDepth" double precision DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "exitReason" text
);


ALTER TABLE public."SlideView" OWNER TO postgres;

--
-- Name: StudyGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudyGroup" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "maxMembers" integer DEFAULT 10 NOT NULL,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudyGroup" OWNER TO postgres;

--
-- Name: StudyGroupMember; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StudyGroupMember" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "groupId" text NOT NULL,
    role public."GroupRole" DEFAULT 'MEMBER'::public."GroupRole" NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StudyGroupMember" OWNER TO postgres;

--
-- Name: Template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Template" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "previewImage" text,
    category text NOT NULL,
    "blockStructure" jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Template" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "clerkId" text NOT NULL,
    email text NOT NULL,
    username text,
    bio text,
    "avatarUrl" text,
    xp integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    "currentStreak" integer DEFAULT 0 NOT NULL,
    "longestStreak" integer DEFAULT 0 NOT NULL,
    "lastActivityDate" timestamp(3) without time zone,
    "learningMinutes" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserAchievement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserAchievement" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL,
    "earnedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserAchievement" OWNER TO postgres;

--
-- Data for Name: AICommand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AICommand" (id, "courseId", "slideId", type, parameters, status, result, error, "userId", "createdAt", "executedAt") FROM stdin;
\.


--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Achievement" (id, name, description, icon, category, requirement, "xpReward", "createdAt") FROM stdin;
\.


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Activity" (id, "userId", "lessonId", type, description, metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: ApprovalRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ApprovalRequest" (id, "courseId", "versionId", status, "submittedBy", "reviewedBy", "reviewedAt", notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: AssetFolder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AssetFolder" (id, "courseId", name, "parentId", description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Certificate" (id, "userId", "courseId", "certificateUrl", "issuedAt") FROM stdin;
\.


--
-- Data for Name: ContentBlock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContentBlock" (id, "slideId", type, content, settings, "orderIndex", "createdAt", "updatedAt") FROM stdin;
cmf9rttsz0007nx3apfpzg2yz	cmf9rttsw0006nx3az5dv8snl	TEXT	{"text": "Welcome to Introduction to Web Development", "align": "center", "style": "heading1"}	\N	0	2025-09-07 14:11:22.02	2025-09-07 14:11:22.02
cmf9rttsz0008nx3ay2d4xa6l	cmf9rttsw0006nx3az5dv8snl	TEXT	{"text": "Learn the fundamentals of modern web development including HTML, CSS, and JavaScript", "align": "center", "style": "paragraph"}	\N	1	2025-09-07 14:11:22.02	2025-09-07 14:11:22.02
cmf9rttsz0009nx3a0ctobawn	cmf9rttsw0006nx3az5dv8snl	TEXT	{"text": "🎯 Ready to begin? Click \\"Next\\" to start learning!", "align": "center", "style": "paragraph"}	\N	2	2025-09-07 14:11:22.02	2025-09-07 14:11:22.02
cmf9ru90t0007nx4854zz0rrr	cmf9ru90q0006nx48kfz1afdk	TEXT	{"text": "Welcome to Python Programming Fundamentals", "align": "center", "style": "heading1"}	\N	0	2025-09-07 14:11:41.741	2025-09-07 14:11:41.741
cmf9ru90t0008nx48vl50ut4q	cmf9ru90q0006nx48kfz1afdk	TEXT	{"text": "Master Python basics with hands-on examples and practical projects", "align": "center", "style": "paragraph"}	\N	1	2025-09-07 14:11:41.741	2025-09-07 14:11:41.741
cmf9ru90t0009nx48efo6p0ih	cmf9ru90q0006nx48kfz1afdk	TEXT	{"text": "🎯 Ready to begin? Click \\"Next\\" to start learning!", "align": "center", "style": "paragraph"}	\N	2	2025-09-07 14:11:41.741	2025-09-07 14:11:41.741
cmf9zry3h000jnssd02qkffwb	cmf9zry3d000hnssdnk86130b	title	{"level": 1, "content": "Building a Todo App"}	\N	0	2025-09-07 17:53:51.197	2025-09-07 17:53:51.197
cmf9zry3k000lnssdjrznlba0	cmf9zry3d000hnssdnk86130b	text	{"content": "Let's combine HTML, CSS, and JavaScript to build a functional todo application!"}	\N	1	2025-09-07 17:53:51.2	2025-09-07 17:53:51.2
cmf9zry3n000nnssds490ejla	cmf9zry3d000hnssdnk86130b	image	{"alt": "Todo App Preview", "src": "courses/web-dev/todo-app-preview.png"}	\N	2	2025-09-07 17:53:51.203	2025-09-07 17:53:51.203
cmf9zry3r000rnssdc3lcl6jo	cmf9zry3p000pnssd2wrld1co	text	{"content": "First, let's create the HTML structure:"}	\N	0	2025-09-07 17:53:51.208	2025-09-07 17:53:51.208
cmf9zry3t000tnssd7pypmjea	cmf9zry3p000pnssd2wrld1co	code	{"code": "<!DOCTYPE html>\\n<html lang=\\"en\\">\\n<head>\\n    <meta charset=\\"UTF-8\\">\\n    <title>Todo App</title>\\n    <link rel=\\"stylesheet\\" href=\\"style.css\\">\\n</head>\\n<body>\\n    <div class=\\"container\\">\\n        <h1>My Todo List</h1>\\n        <form id=\\"todo-form\\">\\n            <input type=\\"text\\" id=\\"todo-input\\" placeholder=\\"Add a new task...\\">\\n            <button type=\\"submit\\">Add</button>\\n        </form>\\n        <ul id=\\"todo-list\\"></ul>\\n    </div>\\n    <script src=\\"app.js\\"></script>\\n</body>\\n</html>", "language": "html"}	\N	1	2025-09-07 17:53:51.21	2025-09-07 17:53:51.21
cmf9zry3z000xnssdvkpo3gkw	cmf9zry3x000vnssdj7lzk88e	code	{"code": ".container {\\n    max-width: 500px;\\n    margin: 50px auto;\\n    padding: 20px;\\n    background: #f5f5f5;\\n    border-radius: 10px;\\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\\n}\\n\\n#todo-form {\\n    display: flex;\\n    gap: 10px;\\n    margin-bottom: 20px;\\n}\\n\\n#todo-input {\\n    flex: 1;\\n    padding: 10px;\\n    border: 1px solid #ddd;\\n    border-radius: 5px;\\n}\\n\\nbutton {\\n    background: #007bff;\\n    color: white;\\n    border: none;\\n    padding: 10px 20px;\\n    border-radius: 5px;\\n    cursor: pointer;\\n}\\n\\n.todo-item {\\n    display: flex;\\n    align-items: center;\\n    padding: 10px;\\n    background: white;\\n    margin-bottom: 5px;\\n    border-radius: 5px;\\n}", "language": "css"}	\N	0	2025-09-07 17:53:51.215	2025-09-07 17:53:51.215
cmf9zry430011nssdkrsyeps8	cmf9zry41000znssd9o5hjbel	quiz	{"questions": [{"type": "multiple_choice", "options": ["click", "submit", "change", "load"], "question": "What event should we listen for on the form?", "explanation": "The submit event is fired when a form is submitted.", "correctAnswer": 1}]}	\N	0	2025-09-07 17:53:51.22	2025-09-07 17:53:51.22
cmf9zry460013nssd6m6ua9s7	cmf9zry41000znssd9o5hjbel	code	{"code": "const form = document.getElementById('todo-form');\\nconst input = document.getElementById('todo-input');\\nconst list = document.getElementById('todo-list');\\n\\nform.addEventListener('submit', (e) => {\\n    e.preventDefault();\\n    \\n    const text = input.value.trim();\\n    if (text === '') return;\\n    \\n    const li = document.createElement('li');\\n    li.className = 'todo-item';\\n    li.innerHTML = `\\n        <input type=\\"checkbox\\">\\n        <span>${text}</span>\\n        <button onclick=\\"this.parentElement.remove()\\">Delete</button>\\n    `;\\n    \\n    list.appendChild(li);\\n    input.value = '';\\n});", "language": "javascript"}	\N	1	2025-09-07 17:53:51.223	2025-09-07 17:53:51.223
cmf9zry4b0017nssdbdqm07p6	cmf9zry480015nssd8udfmqde	title	{"level": 1, "content": "🎉 Course Complete!"}	\N	0	2025-09-07 17:53:51.227	2025-09-07 17:53:51.227
cmf9zry4d0019nssdf7jbbaxd	cmf9zry480015nssd8udfmqde	text	{"content": "You've learned the fundamentals of web development!"}	\N	1	2025-09-07 17:53:51.23	2025-09-07 17:53:51.23
cmf9zry4h001bnssd6yybjc16	cmf9zry480015nssd8udfmqde	list	{"items": ["✅ HTML structure and semantic markup", "✅ CSS styling and responsive design", "✅ JavaScript programming and DOM manipulation", "✅ Building a complete web application"]}	\N	2	2025-09-07 17:53:51.233	2025-09-07 17:53:51.233
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, description, thumbnail, difficulty, "estimatedHours", category, tags, "isPublished", visibility, "scheduledPublishAt", "accessControl", "enrollmentLimit", price, "createdAt", "updatedAt") FROM stdin;
cmf9rttsh0000nx3asnxnz8z3	Introduction to Web Development	Learn the fundamentals of modern web development including HTML, CSS, and JavaScript	\N	BEGINNER	5	General	{introduction,to,web,development}	t	PUBLIC	\N	\N	\N	0	2025-09-07 14:11:22.002	2025-09-07 14:11:22.002
cmf9ru90g0000nx485z71i8st	Python Programming Fundamentals	Master Python basics with hands-on examples and practical projects	\N	BEGINNER	5	General	{python,programming,fundamentals}	t	PUBLIC	\N	\N	\N	0	2025-09-07 14:11:41.728	2025-09-07 14:11:41.728
cmf9zry2l0001nssd4v26gce0	Complete Web Development Fundamentals	Learn HTML, CSS, JavaScript, and build your first web application	courses/web-dev/course-thumbnail.jpg	BEGINNER	2.5	Web Development	{html,css,javascript,web-development,frontend}	t	PUBLIC	\N	\N	\N	0	2025-09-07 17:53:51.165	2025-09-07 17:53:51.165
\.


--
-- Data for Name: CourseAnalytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseAnalytics" (id, "userId", "courseId", "totalSessions", "totalTimeSpent", "averageSessionLength", "completionRate", "lastAccessedAt", "firstAccessedAt", "completedAt", "totalInteractions", "quizAverageScore", "preferredTimeOfDay", "mostActiveDay", "strugglingTopics", "strongTopics") FROM stdin;
\.


--
-- Data for Name: CourseSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseSession" (id, "userId", "courseId", "startedAt", "endedAt", "totalDuration", "completedSlides", "totalSlides", "progressSnapshot", "deviceInfo", "ipAddress") FROM stdin;
\.


--
-- Data for Name: CourseVersion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseVersion" (id, "courseId", version, label, data, "createdBy", "createdAt", status) FROM stdin;
\.


--
-- Data for Name: CustomComponent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomComponent" (id, name, description, code, "compiledCode", dependencies, "propSchema", "defaultProps", "defaultSize", "minSize", "maxSize", category, "isPublic", tags, version, "usageCount", rating, "isVerified", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EnhancedAsset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EnhancedAsset" (id, "courseId", filename, "originalName", "mimeType", "fileSize", url, "thumbnailUrl", "sha256Hash", width, height, duration, transcript, "altText", tags, "folderId", embedding, "createdAt", "updatedAt", "createdBy") FROM stdin;
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollment" (id, "userId", "courseId", status, progress, "enrolledAt", "completedAt") FROM stdin;
cmf9zry4j001dnssddgcyhvv4	cmf9zry2g0000nssd7n9s59nx	cmf9zry2l0001nssd4v26gce0	ACTIVE	0	2025-09-07 17:53:51.236	\N
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FriendRequest" (id, "senderId", "receiverId", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friendship" (id, "userId", "friendId", "createdAt") FROM stdin;
\.


--
-- Data for Name: InteractionEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InteractionEvent" (id, "userId", "sessionId", "slideId", "eventType", "eventName", "eventData", "timestamp") FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lesson" (id, "moduleId", title, description, content, "videoUrl", duration, "orderIndex", "xpReward", "createdAt", "updatedAt", assets, "contentMetadata", "contentType", "coverImage", "jsonBlocks", "mdxContent") FROM stdin;
cmf9rttsr0004nx3auhbptxrp	cmf9rttsn0002nx3aavg3dy4t	Welcome to the Course	Get started with your learning journey	{"objectives": ["Understand the course structure", "Get familiar with the platform", "Start your learning journey"], "introduction": "Welcome to Introduction to Web Development!"}	\N	10	0	10	2025-09-07 14:11:22.011	2025-09-07 14:11:22.011	\N	\N	SLIDES	\N	\N	\N
cmf9ru90n0004nx48tty66p35	cmf9ru90j0002nx487gqo5hbg	Welcome to the Course	Get started with your learning journey	{"objectives": ["Understand the course structure", "Get familiar with the platform", "Start your learning journey"], "introduction": "Welcome to Python Programming Fundamentals!"}	\N	10	0	10	2025-09-07 14:11:41.736	2025-09-07 14:11:41.736	\N	\N	SLIDES	\N	\N	\N
cmf9zry2w0007nssdcfa9u7zk	cmf9zry2p0003nssd98ai27lz	Introduction to Web Development	Learn the fundamentals of web development	{}	\N	15	0	50	2025-09-07 17:53:51.177	2025-09-07 17:53:51.177	\N	\N	MDX	\N	\N	---\ntitle: Introduction to Web Development\nsummary: Learn the fundamentals of web development including HTML, CSS, and JavaScript\nestimatedMinutes: 15\ntags: ["web-development", "html", "css", "javascript"]\nlevel: beginner\ncoverImage: courses/web-dev/intro-cover.jpg\nobjectives:\n  - Understand the basics of web development\n  - Learn about HTML structure\n  - Introduction to CSS styling\n  - JavaScript fundamentals\n---\n\n# Introduction to Web Development\n\nWelcome to the exciting world of web development! In this course, you'll learn how to build modern web applications from scratch.\n\n<Callout variant="info" title="What you'll learn">\nThis course covers HTML, CSS, JavaScript, and modern frameworks like React and Next.js.\n</Callout>\n\n## What is Web Development?\n\nWeb development is the process of building and maintaining websites. It includes:\n\n- **Frontend Development**: What users see and interact with\n- **Backend Development**: Server-side logic and databases\n- **Full-Stack Development**: Both frontend and backend\n\n<Video provider="youtube" videoId="dQw4w9WgXcQ" title="Introduction to Web Development" />\n\n## The Building Blocks\n\n### HTML - The Structure\n\nHTML (HyperText Markup Language) provides the structure of web pages.\n\n```html\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Web Page</title>\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n  </body>\n</html>\n```\n\n### CSS - The Style\n\nCSS (Cascading Style Sheets) makes your web pages look beautiful.\n\n```css\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}\n```\n\n### JavaScript - The Behavior\n\nJavaScript adds interactivity to your web pages.\n\n```javascript\nfunction greetUser(name) {\n  alert(`Hello, ${name}! Welcome to web development.`);\n}\n\n// Call the function\ngreetUser("Student");\n```\n\n<Quiz questions={[\n  {\n    "id": "1",\n    "type": "multiple_choice",\n    "question": "What does HTML stand for?",\n    "options": [\n      "Hyper Text Markup Language",\n      "High Tech Modern Language",\n      "Home Tool Markup Language",\n      "Hyperlink and Text Markup Language"\n    ],\n    "correctAnswer": "Hyper Text Markup Language",\n    "explanation": "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.",\n    "points": 1\n  },\n  {\n    "id": "2",\n    "type": "true_false",\n    "question": "CSS is used to add interactivity to web pages.",\n    "correctAnswer": false,\n    "explanation": "CSS is used for styling and layout. JavaScript is used to add interactivity to web pages.",\n    "points": 1\n  }\n]} />\n\n## Next Steps\n\nIn the next lesson, we'll dive deeper into HTML and create your first web page!\n
cmf9zry300009nssdg041a0o8	cmf9zry2p0003nssd98ai27lz	HTML Deep Dive	Master HTML elements and semantic markup	{}	\N	20	1	75	2025-09-07 17:53:51.18	2025-09-07 17:53:51.18	\N	\N	MDX	\N	\N	---\ntitle: HTML Deep Dive\nsummary: Master HTML elements, attributes, and semantic markup\nestimatedMinutes: 20\ntags: ["html", "web-development", "semantic-html"]\nlevel: beginner\ncoverImage: courses/web-dev/html-cover.jpg\nprerequisites:\n  - Basic understanding of web development\n---\n\n# HTML Deep Dive\n\nHTML is the foundation of every web page. Let's explore its elements and best practices.\n\n## Text Elements\n\nHTML provides various elements for text content:\n\n- `<h1>` to `<h6>` - Headings\n- `<p>` - Paragraphs\n- `<strong>` - Bold text\n- `<em>` - Italic text\n- `<span>` - Inline container\n\n## Semantic HTML\n\nUse semantic HTML for better accessibility and SEO:\n\n- `<header>` - Page or section header\n- `<nav>` - Navigation links\n- `<main>` - Main content\n- `<article>` - Self-contained content\n- `<footer>` - Page or section footer\n\n## Forms and Input\n\nForms are essential for user interaction:\n\n```html\n<form action="/submit" method="POST">\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name" required>\n  \n  <label for="email">Email:</label>\n  <input type="email" id="email" name="email" required>\n  \n  <button type="submit">Submit</button>\n</form>\n```\n\n<Callout variant="tip" title="Pro Tip">\nAlways use semantic HTML elements instead of generic div elements when possible. This improves accessibility and SEO.\n</Callout>\n\n## Practice Exercise\n\nTry creating a simple HTML page with:\n- A header with navigation\n- A main content area with an article\n- A footer with contact information\n
cmf9zry33000bnssdnpcwle3z	cmf9zry2t0005nssdyvpmlfjy	CSS Styling and Layout	Learn CSS fundamentals and modern layout techniques	{}	\N	25	0	100	2025-09-07 17:53:51.183	2025-09-07 17:53:51.183	\N	{"tags": ["css", "styling", "layout", "responsive-design"], "level": "intermediate", "title": "CSS Styling and Layout", "summary": "Learn CSS fundamentals, flexbox, grid, and responsive design", "coverImage": "courses/web-dev/css-cover.jpg", "objectives": ["Master CSS selectors and properties", "Understand the box model", "Learn flexbox and grid layouts", "Create responsive designs"], "estimatedMinutes": 25}	JSON_BLOCKS	\N	{"blocks": [{"text": "CSS Styling and Layout", "type": "heading", "level": 1}, {"text": "CSS is what makes the web beautiful. Let's explore modern CSS techniques for creating stunning layouts.", "type": "paragraph"}, {"alt": "CSS Box Model Diagram", "src": "courses/web-dev/css-box-model.png", "type": "image", "caption": "The CSS Box Model: Content, Padding, Border, and Margin"}, {"text": "CSS Selectors", "type": "heading", "level": 2}, {"code": "/* Element Selector */\\np {\\n  color: #333;\\n}\\n\\n/* Class Selector */\\n.highlight {\\n  background-color: yellow;\\n}\\n\\n/* ID Selector */\\n#header {\\n  font-size: 24px;\\n}\\n\\n/* Attribute Selector */\\ninput[type=\\"text\\"] {\\n  border: 1px solid #ccc;\\n}\\n\\n/* Pseudo-class Selector */\\na:hover {\\n  color: blue;\\n}", "type": "code", "filename": "selectors.css", "language": "css"}, {"type": "callout", "title": "Specificity Matters", "content": "ID selectors have higher specificity than class selectors, which have higher specificity than element selectors. Be careful not to create overly specific selectors that are hard to override.", "variant": "warning"}, {"text": "Flexbox Layout", "type": "heading", "level": 2}, {"text": "Flexbox is a powerful layout system for creating flexible, responsive layouts:", "type": "paragraph"}, {"code": ".container {\\n  display: flex;\\n  justify-content: space-between;\\n  align-items: center;\\n  flex-wrap: wrap;\\n}\\n\\n.item {\\n  flex: 1 1 300px; /* grow, shrink, basis */\\n  margin: 10px;\\n}", "type": "code", "language": "css", "showLineNumbers": true}, {"text": "CSS Grid", "type": "heading", "level": 2}, {"text": "CSS Grid is perfect for two-dimensional layouts:", "type": "paragraph"}, {"code": ".grid-container {\\n  display: grid;\\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\\n  gap: 20px;\\n}\\n\\n.grid-item {\\n  background: #f0f0f0;\\n  padding: 20px;\\n  border-radius: 8px;\\n}", "type": "code", "language": "css", "highlightLines": [3], "showLineNumbers": true}, {"type": "quiz", "questions": [{"id": "1", "type": "multiple_choice", "points": 1, "options": ["margin", "padding", "spacing", "gap"], "question": "Which CSS property controls the space between the content and the border?", "explanation": "Padding is the space between the content and the border. Margin is the space outside the border.", "correctAnswer": "padding"}, {"id": "2", "type": "short_answer", "points": 1, "question": "What CSS property makes an element a flex container?", "correctAnswer": "display: flex"}], "passingScore": 70, "showFeedback": true}, {"text": "Responsive Design", "type": "heading", "level": 2}, {"gap": 4, "type": "columns", "columns": [[{"text": "Mobile First", "type": "heading", "level": 3}, {"code": "/* Base styles for mobile */\\n.container {\\n  width: 100%;\\n  padding: 10px;\\n}\\n\\n/* Tablet and up */\\n@media (min-width: 768px) {\\n  .container {\\n    max-width: 750px;\\n    margin: 0 auto;\\n  }\\n}", "type": "code", "language": "css"}], [{"text": "Desktop First", "type": "heading", "level": 3}, {"code": "/* Base styles for desktop */\\n.container {\\n  max-width: 1200px;\\n  margin: 0 auto;\\n}\\n\\n/* Mobile styles */\\n@media (max-width: 767px) {\\n  .container {\\n    width: 100%;\\n    padding: 10px;\\n  }\\n}", "type": "code", "language": "css"}]], "responsive": true}], "metadata": {"tags": ["css", "styling", "layout", "responsive-design"], "level": "intermediate", "title": "CSS Styling and Layout", "summary": "Learn CSS fundamentals, flexbox, grid, and responsive design", "coverImage": "courses/web-dev/css-cover.jpg", "objectives": ["Master CSS selectors and properties", "Understand the box model", "Learn flexbox and grid layouts", "Create responsive designs"], "estimatedMinutes": 25}}	\N
cmf9zry37000dnssdu9mwvu7u	cmf9zry2t0005nssdyvpmlfjy	JavaScript Fundamentals	Master JavaScript basics and DOM manipulation	{}	\N	30	1	100	2025-09-07 17:53:51.187	2025-09-07 17:53:51.187	\N	{"tags": ["javascript", "programming", "es6", "dom"], "level": "intermediate", "title": "JavaScript Fundamentals", "summary": "Master JavaScript basics, functions, DOM manipulation, and ES6+ features", "coverImage": "courses/web-dev/js-cover.jpg", "estimatedMinutes": 30}	JSON_BLOCKS	\N	{"blocks": [{"text": "JavaScript Fundamentals", "type": "heading", "level": 1}, {"text": "JavaScript brings your web pages to life. Let's explore the core concepts and modern features.", "type": "paragraph"}, {"type": "video", "title": "JavaScript in 100 Seconds", "videoId": "W6NZfCO5SIk", "provider": "youtube"}, {"text": "Variables and Data Types", "type": "heading", "level": 2}, {"code": "// Modern variable declarations\\nconst PI = 3.14159; // Constants can't be reassigned\\nlet count = 0;      // Variables that can change\\nvar oldWay = true;  // Avoid using var\\n\\n// Data types\\nconst string = \\"Hello World\\";\\nconst number = 42;\\nconst boolean = true;\\nconst array = [1, 2, 3, 4, 5];\\nconst object = { name: \\"John\\", age: 30 };\\nconst nothing = null;\\nconst notDefined = undefined;", "type": "code", "language": "javascript", "runnable": true}, {"text": "Functions", "type": "heading", "level": 2}, {"tabs": [{"label": "Function Declaration", "content": [{"code": "// Traditional function\\nfunction greet(name) {\\n  return `Hello, ${name}!`;\\n}\\n\\nconsole.log(greet(\\"World\\"));", "type": "code", "language": "javascript"}]}, {"label": "Arrow Functions", "content": [{"code": "// Arrow function\\nconst greet = (name) => {\\n  return `Hello, ${name}!`;\\n};\\n\\n// Short syntax for single expressions\\nconst greetShort = name => `Hello, ${name}!`;\\n\\nconsole.log(greetShort(\\"World\\"));", "type": "code", "language": "javascript"}]}], "type": "tabs", "defaultTab": 0}, {"text": "DOM Manipulation", "type": "heading", "level": 2}, {"code": "// Select elements\\nconst button = document.querySelector('#myButton');\\nconst allDivs = document.querySelectorAll('div');\\n\\n// Add event listener\\nbutton.addEventListener('click', () => {\\n  // Create new element\\n  const newDiv = document.createElement('div');\\n  newDiv.textContent = 'New content!';\\n  newDiv.classList.add('highlight');\\n  \\n  // Append to body\\n  document.body.appendChild(newDiv);\\n});\\n\\n// Modify existing elements\\nallDivs.forEach(div => {\\n  div.style.backgroundColor = '#f0f0f0';\\n});", "type": "code", "filename": "dom-manipulation.js", "language": "javascript"}, {"type": "callout", "title": "Modern JavaScript", "content": "Always use const for values that won't change and let for values that will. Avoid var as it has confusing scoping rules.", "variant": "tip"}, {"text": "Array Methods", "type": "heading", "level": 2}, {"rows": [["map()", "Transform each element", "arr.map(x => x * 2)"], ["filter()", "Keep elements that pass test", "arr.filter(x => x > 5)"], ["reduce()", "Reduce to single value", "arr.reduce((sum, x) => sum + x, 0)"], ["find()", "Find first matching element", "arr.find(x => x.id === 1)"], ["forEach()", "Execute function for each", "arr.forEach(x => console.log(x))"]], "type": "table", "headers": ["Method", "Description", "Example"], "sortable": true, "responsive": true}, {"type": "quiz", "questions": [{"id": "1", "type": "multiple_choice", "points": 1, "options": ["forEach()", "map()", "filter()", "find()"], "question": "Which array method returns a new array with transformed elements?", "explanation": "map() creates a new array by transforming each element with the provided function.", "correctAnswer": "map()"}, {"id": "2", "type": "true_false", "points": 1, "question": "Arrow functions have their own 'this' binding.", "explanation": "Arrow functions inherit 'this' from their enclosing scope, unlike regular functions.", "correctAnswer": false}], "passingScore": 80, "randomizeQuestions": true}], "metadata": {"tags": ["javascript", "programming", "es6", "dom"], "level": "intermediate", "title": "JavaScript Fundamentals", "summary": "Master JavaScript basics, functions, DOM manipulation, and ES6+ features", "coverImage": "courses/web-dev/js-cover.jpg", "estimatedMinutes": 30}}	\N
cmf9zry3b000fnssdludquigw	cmf9zry2t0005nssdyvpmlfjy	Building Your First Web App	Put it all together to create a todo application	{}	\N	20	2	150	2025-09-07 17:53:51.191	2025-09-07 17:53:51.191	\N	\N	SLIDES	\N	\N	\N
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "userId", "groupId", content, "createdAt") FROM stdin;
\.


--
-- Data for Name: Module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Module" (id, "courseId", title, description, "orderIndex", "createdAt", "updatedAt") FROM stdin;
cmf9rttsn0002nx3aavg3dy4t	cmf9rttsh0000nx3asnxnz8z3	Getting Started	Introduction to Introduction to Web Development	0	2025-09-07 14:11:22.007	2025-09-07 14:11:22.007
cmf9ru90j0002nx487gqo5hbg	cmf9ru90g0000nx485z71i8st	Getting Started	Introduction to Python Programming Fundamentals	0	2025-09-07 14:11:41.732	2025-09-07 14:11:41.732
cmf9zry2p0003nssd98ai27lz	cmf9zry2l0001nssd4v26gce0	Getting Started	Introduction to web development and HTML	0	2025-09-07 17:53:51.169	2025-09-07 17:53:51.169
cmf9zry2t0005nssdyvpmlfjy	cmf9zry2l0001nssd4v26gce0	Styling and Interactivity	CSS, JavaScript, and building your first app	1	2025-09-07 17:53:51.173	2025-09-07 17:53:51.173
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Progress" (id, "userId", "lessonId", completed, "completedAt", "timeSpent", "lastAccessedAt") FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Question" (id, "quizId", type, question, options, "correctAnswer", explanation, points, "orderIndex", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quiz" (id, "lessonId", title, description, "passingScore", "maxAttempts", "timeLimit", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: QuizAttempt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizAttempt" (id, "userId", "quizId", score, answers, "completedAt", "timeSpent") FROM stdin;
\.


--
-- Data for Name: Slide; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Slide" (id, "lessonId", title, notes, template, "orderIndex", "gridLayout", theme, transition, duration, background, "createdAt", "updatedAt") FROM stdin;
cmf9rttsw0006nx3az5dv8snl	cmf9rttsr0004nx3auhbptxrp	Welcome!	Introduction slide for the course	standard	0	\N	\N	none	\N	\N	2025-09-07 14:11:22.016	2025-09-07 14:11:22.016
cmf9ru90q0006nx48kfz1afdk	cmf9ru90n0004nx48tty66p35	Welcome!	Introduction slide for the course	standard	0	\N	\N	none	\N	\N	2025-09-07 14:11:41.738	2025-09-07 14:11:41.738
cmf9zry3d000hnssdnk86130b	cmf9zry3b000fnssdludquigw	Project Overview	\N	title-content	0	\N	\N	none	\N	\N	2025-09-07 17:53:51.194	2025-09-07 17:53:51.194
cmf9zry3p000pnssd2wrld1co	cmf9zry3b000fnssdludquigw	HTML Structure	\N	code-explanation	1	\N	\N	none	\N	\N	2025-09-07 17:53:51.205	2025-09-07 17:53:51.205
cmf9zry3x000vnssdj7lzk88e	cmf9zry3b000fnssdludquigw	Styling with CSS	\N	split-content	2	\N	\N	none	\N	\N	2025-09-07 17:53:51.213	2025-09-07 17:53:51.213
cmf9zry41000znssd9o5hjbel	cmf9zry3b000fnssdludquigw	JavaScript Functionality	\N	interactive	3	\N	\N	none	\N	\N	2025-09-07 17:53:51.217	2025-09-07 17:53:51.217
cmf9zry480015nssd8udfmqde	cmf9zry3b000fnssdludquigw	Congratulations!	\N	celebration	4	\N	\N	none	\N	\N	2025-09-07 17:53:51.225	2025-09-07 17:53:51.225
\.


--
-- Data for Name: SlideView; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SlideView" (id, "userId", "sessionId", "slideId", "moduleId", "subModuleId", "viewedAt", "timeSpent", "scrollDepth", completed, "exitReason") FROM stdin;
\.


--
-- Data for Name: StudyGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudyGroup" (id, name, description, "maxMembers", "isPublic", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudyGroupMember; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StudyGroupMember" (id, "userId", "groupId", role, "joinedAt") FROM stdin;
\.


--
-- Data for Name: Template; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Template" (id, name, description, "previewImage", category, "blockStructure", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "clerkId", email, username, bio, "avatarUrl", xp, level, "currentStreak", "longestStreak", "lastActivityDate", "learningMinutes", "createdAt", "updatedAt") FROM stdin;
cmf9zry2g0000nssd7n9s59nx	demo_1757267631159	demo@coursekit.com	democoursekit	Demo user for testing the unified content system	\N	0	1	0	0	\N	0	2025-09-07 17:53:51.16	2025-09-07 17:53:51.16
\.


--
-- Data for Name: UserAchievement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserAchievement" (id, "userId", "achievementId", "earnedAt") FROM stdin;
\.


--
-- Name: AICommand AICommand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AICommand"
    ADD CONSTRAINT "AICommand_pkey" PRIMARY KEY (id);


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: ApprovalRequest ApprovalRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY (id);


--
-- Name: AssetFolder AssetFolder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetFolder"
    ADD CONSTRAINT "AssetFolder_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: ContentBlock ContentBlock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentBlock"
    ADD CONSTRAINT "ContentBlock_pkey" PRIMARY KEY (id);


--
-- Name: CourseAnalytics CourseAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseAnalytics"
    ADD CONSTRAINT "CourseAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: CourseSession CourseSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSession"
    ADD CONSTRAINT "CourseSession_pkey" PRIMARY KEY (id);


--
-- Name: CourseVersion CourseVersion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseVersion"
    ADD CONSTRAINT "CourseVersion_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: CustomComponent CustomComponent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomComponent"
    ADD CONSTRAINT "CustomComponent_pkey" PRIMARY KEY (id);


--
-- Name: EnhancedAsset EnhancedAsset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EnhancedAsset"
    ADD CONSTRAINT "EnhancedAsset_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY (id);


--
-- Name: InteractionEvent InteractionEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionEvent"
    ADD CONSTRAINT "InteractionEvent_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Module Module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: QuizAttempt QuizAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY (id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- Name: SlideView SlideView_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SlideView"
    ADD CONSTRAINT "SlideView_pkey" PRIMARY KEY (id);


--
-- Name: Slide Slide_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Slide"
    ADD CONSTRAINT "Slide_pkey" PRIMARY KEY (id);


--
-- Name: StudyGroupMember StudyGroupMember_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyGroupMember"
    ADD CONSTRAINT "StudyGroupMember_pkey" PRIMARY KEY (id);


--
-- Name: StudyGroup StudyGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyGroup"
    ADD CONSTRAINT "StudyGroup_pkey" PRIMARY KEY (id);


--
-- Name: Template Template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Template"
    ADD CONSTRAINT "Template_pkey" PRIMARY KEY (id);


--
-- Name: UserAchievement UserAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: AICommand_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AICommand_courseId_idx" ON public."AICommand" USING btree ("courseId");


--
-- Name: AICommand_slideId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AICommand_slideId_idx" ON public."AICommand" USING btree ("slideId");


--
-- Name: AICommand_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AICommand_status_idx" ON public."AICommand" USING btree (status);


--
-- Name: AICommand_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AICommand_type_idx" ON public."AICommand" USING btree (type);


--
-- Name: Achievement_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Achievement_category_idx" ON public."Achievement" USING btree (category);


--
-- Name: Activity_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Activity_createdAt_idx" ON public."Activity" USING btree ("createdAt");


--
-- Name: Activity_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Activity_userId_idx" ON public."Activity" USING btree ("userId");


--
-- Name: ApprovalRequest_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ApprovalRequest_courseId_idx" ON public."ApprovalRequest" USING btree ("courseId");


--
-- Name: ApprovalRequest_versionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ApprovalRequest_versionId_idx" ON public."ApprovalRequest" USING btree ("versionId");


--
-- Name: AssetFolder_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AssetFolder_courseId_idx" ON public."AssetFolder" USING btree ("courseId");


--
-- Name: AssetFolder_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AssetFolder_parentId_idx" ON public."AssetFolder" USING btree ("parentId");


--
-- Name: Certificate_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_courseId_idx" ON public."Certificate" USING btree ("courseId");


--
-- Name: Certificate_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON public."Certificate" USING btree ("userId", "courseId");


--
-- Name: Certificate_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_userId_idx" ON public."Certificate" USING btree ("userId");


--
-- Name: ContentBlock_slideId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContentBlock_slideId_idx" ON public."ContentBlock" USING btree ("slideId");


--
-- Name: CourseAnalytics_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseAnalytics_courseId_idx" ON public."CourseAnalytics" USING btree ("courseId");


--
-- Name: CourseAnalytics_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CourseAnalytics_userId_courseId_key" ON public."CourseAnalytics" USING btree ("userId", "courseId");


--
-- Name: CourseAnalytics_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseAnalytics_userId_idx" ON public."CourseAnalytics" USING btree ("userId");


--
-- Name: CourseSession_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseSession_courseId_idx" ON public."CourseSession" USING btree ("courseId");


--
-- Name: CourseSession_startedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseSession_startedAt_idx" ON public."CourseSession" USING btree ("startedAt");


--
-- Name: CourseSession_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseSession_userId_idx" ON public."CourseSession" USING btree ("userId");


--
-- Name: CourseVersion_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseVersion_courseId_idx" ON public."CourseVersion" USING btree ("courseId");


--
-- Name: CourseVersion_courseId_version_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CourseVersion_courseId_version_key" ON public."CourseVersion" USING btree ("courseId", version);


--
-- Name: Course_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Course_category_idx" ON public."Course" USING btree (category);


--
-- Name: Course_isPublished_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Course_isPublished_idx" ON public."Course" USING btree ("isPublished");


--
-- Name: CustomComponent_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomComponent_category_idx" ON public."CustomComponent" USING btree (category);


--
-- Name: CustomComponent_createdBy_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomComponent_createdBy_idx" ON public."CustomComponent" USING btree ("createdBy");


--
-- Name: CustomComponent_isPublic_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CustomComponent_isPublic_idx" ON public."CustomComponent" USING btree ("isPublic");


--
-- Name: EnhancedAsset_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EnhancedAsset_courseId_idx" ON public."EnhancedAsset" USING btree ("courseId");


--
-- Name: EnhancedAsset_folderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EnhancedAsset_folderId_idx" ON public."EnhancedAsset" USING btree ("folderId");


--
-- Name: EnhancedAsset_sha256Hash_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EnhancedAsset_sha256Hash_idx" ON public."EnhancedAsset" USING btree ("sha256Hash");


--
-- Name: EnhancedAsset_sha256Hash_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EnhancedAsset_sha256Hash_key" ON public."EnhancedAsset" USING btree ("sha256Hash");


--
-- Name: Enrollment_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_courseId_idx" ON public."Enrollment" USING btree ("courseId");


--
-- Name: Enrollment_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON public."Enrollment" USING btree ("userId", "courseId");


--
-- Name: Enrollment_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_userId_idx" ON public."Enrollment" USING btree ("userId");


--
-- Name: FriendRequest_receiverId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FriendRequest_receiverId_idx" ON public."FriendRequest" USING btree ("receiverId");


--
-- Name: FriendRequest_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "FriendRequest_senderId_idx" ON public."FriendRequest" USING btree ("senderId");


--
-- Name: FriendRequest_senderId_receiverId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON public."FriendRequest" USING btree ("senderId", "receiverId");


--
-- Name: Friendship_friendId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Friendship_friendId_idx" ON public."Friendship" USING btree ("friendId");


--
-- Name: Friendship_userId_friendId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Friendship_userId_friendId_key" ON public."Friendship" USING btree ("userId", "friendId");


--
-- Name: Friendship_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Friendship_userId_idx" ON public."Friendship" USING btree ("userId");


--
-- Name: InteractionEvent_eventType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InteractionEvent_eventType_idx" ON public."InteractionEvent" USING btree ("eventType");


--
-- Name: InteractionEvent_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InteractionEvent_sessionId_idx" ON public."InteractionEvent" USING btree ("sessionId");


--
-- Name: InteractionEvent_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InteractionEvent_timestamp_idx" ON public."InteractionEvent" USING btree ("timestamp");


--
-- Name: InteractionEvent_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InteractionEvent_userId_idx" ON public."InteractionEvent" USING btree ("userId");


--
-- Name: Lesson_contentType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lesson_contentType_idx" ON public."Lesson" USING btree ("contentType");


--
-- Name: Lesson_moduleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lesson_moduleId_idx" ON public."Lesson" USING btree ("moduleId");


--
-- Name: Message_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_createdAt_idx" ON public."Message" USING btree ("createdAt");


--
-- Name: Message_groupId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_groupId_idx" ON public."Message" USING btree ("groupId");


--
-- Name: Module_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Module_courseId_idx" ON public."Module" USING btree ("courseId");


--
-- Name: Progress_lessonId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Progress_lessonId_idx" ON public."Progress" USING btree ("lessonId");


--
-- Name: Progress_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Progress_userId_idx" ON public."Progress" USING btree ("userId");


--
-- Name: Progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Progress_userId_lessonId_key" ON public."Progress" USING btree ("userId", "lessonId");


--
-- Name: Question_quizId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Question_quizId_idx" ON public."Question" USING btree ("quizId");


--
-- Name: QuizAttempt_quizId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuizAttempt_quizId_idx" ON public."QuizAttempt" USING btree ("quizId");


--
-- Name: QuizAttempt_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuizAttempt_userId_idx" ON public."QuizAttempt" USING btree ("userId");


--
-- Name: Quiz_lessonId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quiz_lessonId_idx" ON public."Quiz" USING btree ("lessonId");


--
-- Name: SlideView_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SlideView_sessionId_idx" ON public."SlideView" USING btree ("sessionId");


--
-- Name: SlideView_slideId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SlideView_slideId_idx" ON public."SlideView" USING btree ("slideId");


--
-- Name: SlideView_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SlideView_userId_idx" ON public."SlideView" USING btree ("userId");


--
-- Name: SlideView_viewedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SlideView_viewedAt_idx" ON public."SlideView" USING btree ("viewedAt");


--
-- Name: Slide_lessonId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Slide_lessonId_idx" ON public."Slide" USING btree ("lessonId");


--
-- Name: StudyGroupMember_groupId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyGroupMember_groupId_idx" ON public."StudyGroupMember" USING btree ("groupId");


--
-- Name: StudyGroupMember_userId_groupId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StudyGroupMember_userId_groupId_key" ON public."StudyGroupMember" USING btree ("userId", "groupId");


--
-- Name: StudyGroupMember_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "StudyGroupMember_userId_idx" ON public."StudyGroupMember" USING btree ("userId");


--
-- Name: Template_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Template_category_idx" ON public."Template" USING btree (category);


--
-- Name: UserAchievement_achievementId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserAchievement_achievementId_idx" ON public."UserAchievement" USING btree ("achievementId");


--
-- Name: UserAchievement_userId_achievementId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON public."UserAchievement" USING btree ("userId", "achievementId");


--
-- Name: UserAchievement_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UserAchievement_userId_idx" ON public."UserAchievement" USING btree ("userId");


--
-- Name: User_clerkId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_clerkId_idx" ON public."User" USING btree ("clerkId");


--
-- Name: User_clerkId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_clerkId_key" ON public."User" USING btree ("clerkId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_username_idx" ON public."User" USING btree (username);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Activity Activity_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Activity Activity_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Activity"
    ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ApprovalRequest ApprovalRequest_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ApprovalRequest ApprovalRequest_versionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ApprovalRequest"
    ADD CONSTRAINT "ApprovalRequest_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES public."CourseVersion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssetFolder AssetFolder_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AssetFolder"
    ADD CONSTRAINT "AssetFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."AssetFolder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ContentBlock ContentBlock_slideId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContentBlock"
    ADD CONSTRAINT "ContentBlock_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES public."Slide"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseAnalytics CourseAnalytics_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseAnalytics"
    ADD CONSTRAINT "CourseAnalytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseAnalytics CourseAnalytics_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseAnalytics"
    ADD CONSTRAINT "CourseAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseSession CourseSession_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSession"
    ADD CONSTRAINT "CourseSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseSession CourseSession_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseSession"
    ADD CONSTRAINT "CourseSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseVersion CourseVersion_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseVersion"
    ADD CONSTRAINT "CourseVersion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EnhancedAsset EnhancedAsset_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EnhancedAsset"
    ADD CONSTRAINT "EnhancedAsset_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."AssetFolder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Enrollment Enrollment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Friendship Friendship_friendId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Friendship Friendship_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InteractionEvent InteractionEvent_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionEvent"
    ADD CONSTRAINT "InteractionEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."CourseSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InteractionEvent InteractionEvent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InteractionEvent"
    ADD CONSTRAINT "InteractionEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Lesson Lesson_moduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES public."Module"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."StudyGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Module Module_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Question Question_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAttempt QuizAttempt_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAttempt QuizAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quiz Quiz_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SlideView SlideView_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SlideView"
    ADD CONSTRAINT "SlideView_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."CourseSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SlideView SlideView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SlideView"
    ADD CONSTRAINT "SlideView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Slide Slide_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Slide"
    ADD CONSTRAINT "Slide_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroupMember StudyGroupMember_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyGroupMember"
    ADD CONSTRAINT "StudyGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."StudyGroup"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudyGroupMember StudyGroupMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StudyGroupMember"
    ADD CONSTRAINT "StudyGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_achievementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES public."Achievement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserAchievement UserAchievement_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAchievement"
    ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Ni3OMyUkyOuuimcChTWKAlYxiaBQS0iY0EeY4FJWBn2v3VDifp09LHjNQraJO4P

