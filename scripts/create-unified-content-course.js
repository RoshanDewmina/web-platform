const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUnifiedContentCourse() {
  try {
    console.log('🌟 Creating Unified Content Course...\n');

    // Create the course
    const course = await prisma.course.create({
      data: {
        title: 'Modern Web Development with Next.js',
        description: 'Learn to build full-stack applications with Next.js, TypeScript, and modern web technologies',
        category: 'Web Development',
        difficulty: 'INTERMEDIATE',
        estimatedHours: 30,
        tags: ['nextjs', 'react', 'typescript', 'fullstack'],
        isPublished: true,
        visibility: 'PUBLIC',
        thumbnail: '/api/placeholder/400/200',
        modules: {
          create: [
            {
              title: 'Getting Started with Next.js',
              description: 'Introduction to Next.js and its core concepts',
              orderIndex: 0,
              lessons: {
                create: [
                  {
                    title: 'Introduction to Next.js',
                    description: 'Learn what Next.js is and why it\'s powerful',
                    orderIndex: 0,
                    duration: 15,
                    xpReward: 20,
                    contentType: 'MDX',
                    mdxContent: `---
title: Introduction to Next.js
summary: Learn what Next.js is and why it's the future of React development
estimatedMinutes: 15
tags: ["nextjs", "react", "introduction"]
level: intermediate
---

# Introduction to Next.js

Welcome to the world of **Next.js**! 🚀

<Callout type="info">
Next.js is a React framework that gives you the best developer experience with all the features you need for production.
</Callout>

## What is Next.js?

Next.js is a full-stack React framework that provides:

- **Server-Side Rendering (SSR)** for better SEO and performance
- **Static Site Generation (SSG)** for blazing-fast static sites
- **API Routes** to build your backend alongside your frontend
- **File-based Routing** for intuitive page creation
- **Built-in CSS Support** with CSS Modules and CSS-in-JS
- **TypeScript Support** out of the box

<Video provider="youtube" videoId="Sklc_fQBmcs" title="Next.js in 100 Seconds" />

## Why Choose Next.js?

1. **Performance First**: Automatic code splitting, image optimization, and more
2. **SEO Friendly**: Server-side rendering ensures search engines can crawl your content
3. **Developer Experience**: Hot reloading, error handling, and great tooling
4. **Production Ready**: Used by Netflix, TikTok, Hulu, and more

<Quiz questions={[
  {
    id: "q1",
    type: "multiple-choice",
    question: "What rendering methods does Next.js support?",
    options: [
      "Only Client-Side Rendering",
      "Only Server-Side Rendering",
      "SSR, SSG, and CSR",
      "Only Static Generation"
    ],
    correctAnswer: 2,
    explanation: "Next.js supports Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR)!"
  }
]} />

## Getting Started

To create a new Next.js application, run:

<CodeBlock language="bash">
npx create-next-app@latest my-app
cd my-app
npm run dev
</CodeBlock>

Visit \`http://localhost:3000\` to see your app! 🎉`,
                    content: {},
                    contentMetadata: {
                      wordCount: 250,
                      hasQuiz: true,
                      hasVideo: true,
                      hasCode: true
                    },
                  },
                  {
                    title: 'Pages and Routing',
                    description: 'Understanding Next.js routing system',
                    orderIndex: 1,
                    duration: 20,
                    xpReward: 25,
                    contentType: 'JSON_BLOCKS',
                    jsonBlocks: {
                      metadata: {
                        title: 'Pages and Routing in Next.js',
                        summary: 'Learn how routing works in Next.js applications',
                        estimatedMinutes: 20,
                        tags: ['routing', 'pages', 'navigation'],
                        level: 'intermediate'
                      },
                      blocks: [
                        {
                          id: 'b1',
                          type: 'heading',
                          level: 1,
                          text: 'Pages and Routing in Next.js'
                        },
                        {
                          id: 'b2',
                          type: 'paragraph',
                          text: 'Next.js has a file-based routing system. Every file in the `pages` directory becomes a route automatically!'
                        },
                        {
                          id: 'b3',
                          type: 'callout',
                          variant: 'tip',
                          title: 'App Router vs Pages Router',
                          content: 'Next.js 13+ introduced the App Router with enhanced features. We\'ll focus on the modern App Router approach.'
                        },
                        {
                          id: 'b4',
                          type: 'heading',
                          level: 2,
                          text: 'Basic Routing'
                        },
                        {
                          id: 'b5',
                          type: 'code',
                          language: 'typescript',
                          code: `// app/page.tsx - maps to /
export default function HomePage() {
  return <h1>Welcome Home!</h1>
}

// app/about/page.tsx - maps to /about
export default function AboutPage() {
  return <h1>About Us</h1>
}

// app/blog/[slug]/page.tsx - maps to /blog/:slug
export default function BlogPost({ params }) {
  return <h1>Blog: {params.slug}</h1>
}`,
                          filename: 'routing-examples.tsx'
                        },
                        {
                          id: 'b6',
                          type: 'heading',
                          level: 2,
                          text: 'Dynamic Routes'
                        },
                        {
                          id: 'b7',
                          type: 'list',
                          ordered: false,
                          items: [
                            '`[param]` - single dynamic segment',
                            '`[...params]` - catch all segments',
                            '`[[...params]]` - optional catch all'
                          ]
                        },
                        {
                          id: 'b8',
                          type: 'image',
                          src: '/api/placeholder/600/400',
                          alt: 'Next.js Routing Diagram',
                          caption: 'Visual representation of Next.js routing'
                        },
                        {
                          id: 'b9',
                          type: 'quiz',
                          questions: [
                            {
                              id: 'q1',
                              type: 'multiple-choice',
                              question: 'What file would you create for the route /products/123?',
                              options: [
                                'app/products/123/page.tsx',
                                'app/products/[id]/page.tsx',
                                'app/products.tsx',
                                'pages/products/[id].tsx'
                              ],
                              correctAnswer: 1,
                              explanation: 'Dynamic routes use square brackets, so [id] would match any value like 123'
                            }
                          ]
                        }
                      ]
                    },
                    content: {},
                    contentMetadata: {
                      blockCount: 9,
                      hasQuiz: true,
                      hasCode: true,
                      hasImages: true
                    },
                  },
                  {
                    title: 'Components and Props',
                    description: 'Building reusable components in Next.js',
                    orderIndex: 2,
                    duration: 25,
                    xpReward: 30,
                    contentType: 'SLIDES',
                    content: { type: 'tutorial' },
                    slides: {
                      create: [
                        {
                          title: 'React Components in Next.js',
                          orderIndex: 0,
                          notes: 'Introduction to components',
                          blocks: {
                            create: [
                              {
                                type: 'heading',
                                content: { text: 'React Components in Next.js' },
                                orderIndex: 0,
                              },
                              {
                                type: 'text',
                                content: { text: 'Next.js uses React components. Let\'s learn how to create and use them effectively.' },
                                orderIndex: 1,
                              },
                              {
                                type: 'code',
                                content: {
                                  language: 'typescript',
                                  code: `// components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  );
}`
                                },
                                orderIndex: 2,
                              }
                            ]
                          }
                        },
                        {
                          title: 'Server vs Client Components',
                          orderIndex: 1,
                          notes: 'Understanding the component model',
                          blocks: {
                            create: [
                              {
                                type: 'heading',
                                content: { text: 'Server vs Client Components' },
                                orderIndex: 0,
                              },
                              {
                                type: 'text',
                                content: { text: 'Next.js 13+ introduces React Server Components by default. Use "use client" directive for client-side interactivity.' },
                                orderIndex: 1,
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ],
              },
            },
            {
              title: 'Advanced Next.js Features',
              description: 'Deep dive into advanced features',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    title: 'API Routes and Backend',
                    description: 'Building APIs with Next.js',
                    orderIndex: 0,
                    duration: 30,
                    xpReward: 35,
                    contentType: 'MDX',
                    mdxContent: `---
title: API Routes and Backend
summary: Learn how to build APIs and backend functionality in Next.js
estimatedMinutes: 30
tags: ["api", "backend", "routes"]
level: intermediate
---

# API Routes in Next.js

Next.js allows you to build your **API endpoints** alongside your frontend code! 🔥

## Creating API Routes

API routes live in the \`app/api\` directory:

<CodeBlock language="typescript" filename="app/api/hello/route.ts">
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from Next.js API!' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Process the data
  return NextResponse.json({ received: body });
}
</CodeBlock>

<Callout type="warning">
Remember: API routes are server-side only and cannot be used in client components directly.
</Callout>

## Real-World Example

Let's build a simple task API:

<Tabs>
  <TabPanel label="GET Handler">
    <CodeBlock language="typescript">
    export async function GET() {
      const tasks = await db.task.findMany();
      return NextResponse.json(tasks);
    }
    </CodeBlock>
  </TabPanel>
  <TabPanel label="POST Handler">
    <CodeBlock language="typescript">
    export async function POST(request: Request) {
      const { title, completed } = await request.json();
      const task = await db.task.create({
        data: { title, completed }
      });
      return NextResponse.json(task);
    }
    </CodeBlock>
  </TabPanel>
</Tabs>

Try it yourself! Build a simple API endpoint and test it with Postman or Thunder Client.`,
                    content: {},
                    contentMetadata: {
                      hasCode: true,
                      hasTabs: true,
                      wordCount: 200
                    },
                  }
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`✅ Created course: ${course.title} (ID: ${course.id})\n`);

    // Fetch the course with all relations to get lesson IDs
    const fullCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Create some quizzes for the course
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: fullCourse.modules[0].lessons[0].id,
        title: 'Next.js Basics Quiz',
        description: 'Test your knowledge of Next.js fundamentals',
        passingScore: 70,
        maxAttempts: 3,
        questions: {
          create: [
            {
              type: 'MULTIPLE_CHOICE',
              question: 'What company created Next.js?',
              options: ['Facebook', 'Google', 'Vercel', 'Microsoft'],
              correctAnswer: { answer: 'Vercel' },
              points: 10,
              orderIndex: 0,
            },
            {
              type: 'TRUE_FALSE',
              question: 'Next.js supports both static and server-side rendering.',
              correctAnswer: { answer: true },
              points: 10,
              orderIndex: 1,
            },
          ],
        },
      },
    });

    console.log(`✅ Created quiz: ${quiz.title}\n`);
    
    console.log('🎉 Unified content course created successfully!');
    console.log(`\n📚 Course Details:`);
    console.log(`   Title: ${fullCourse.title}`);
    console.log(`   ID: ${fullCourse.id}`);
    console.log(`   Modules: ${fullCourse.modules.length}`);
    console.log(`   Total Lessons: ${fullCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)}`);
    console.log(`\n🔗 Visit http://localhost:3000/learn to enroll and test!`);

  } catch (error) {
    console.error('❌ Error creating course:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createUnifiedContentCourse();
