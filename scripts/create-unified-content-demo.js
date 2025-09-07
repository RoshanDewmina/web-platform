const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample MDX content for Lesson 1
const mdxLesson1 = `---
title: Introduction to Web Development
summary: Learn the fundamentals of web development including HTML, CSS, and JavaScript
estimatedMinutes: 15
tags: ["web-development", "html", "css", "javascript"]
level: beginner
coverImage: courses/web-dev/intro-cover.jpg
objectives:
  - Understand the basics of web development
  - Learn about HTML structure
  - Introduction to CSS styling
  - JavaScript fundamentals
---

# Introduction to Web Development

Welcome to the exciting world of web development! In this course, you'll learn how to build modern web applications from scratch.

<Callout variant="info" title="What you'll learn">
This course covers HTML, CSS, JavaScript, and modern frameworks like React and Next.js.
</Callout>

## What is Web Development?

Web development is the process of building and maintaining websites. It includes:

- **Frontend Development**: What users see and interact with
- **Backend Development**: Server-side logic and databases
- **Full-Stack Development**: Both frontend and backend

<Video provider="youtube" videoId="dQw4w9WgXcQ" title="Introduction to Web Development" />

## The Building Blocks

### HTML - The Structure

HTML (HyperText Markup Language) provides the structure of web pages.

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Web Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
  </body>
</html>
\`\`\`

### CSS - The Style

CSS (Cascading Style Sheets) makes your web pages look beautiful.

\`\`\`css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
}
\`\`\`

### JavaScript - The Behavior

JavaScript adds interactivity to your web pages.

\`\`\`javascript
function greetUser(name) {
  alert(\`Hello, \${name}! Welcome to web development.\`);
}

// Call the function
greetUser("Student");
\`\`\`

<Quiz questions={[
  {
    "id": "1",
    "type": "multiple_choice",
    "question": "What does HTML stand for?",
    "options": [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlink and Text Markup Language"
    ],
    "correctAnswer": "Hyper Text Markup Language",
    "explanation": "HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.",
    "points": 1
  },
  {
    "id": "2",
    "type": "true_false",
    "question": "CSS is used to add interactivity to web pages.",
    "correctAnswer": false,
    "explanation": "CSS is used for styling and layout. JavaScript is used to add interactivity to web pages.",
    "points": 1
  }
]} />

## Next Steps

In the next lesson, we'll dive deeper into HTML and create your first web page!
`;

// Sample MDX content for Lesson 2
const mdxLesson2 = `---
title: HTML Deep Dive
summary: Master HTML elements, attributes, and semantic markup
estimatedMinutes: 20
tags: ["html", "web-development", "semantic-html"]
level: beginner
coverImage: courses/web-dev/html-cover.jpg
prerequisites:
  - Basic understanding of web development
---

# HTML Deep Dive

HTML is the foundation of every web page. Let's explore its elements and best practices.

## Text Elements

HTML provides various elements for text content:

- \`<h1>\` to \`<h6>\` - Headings
- \`<p>\` - Paragraphs
- \`<strong>\` - Bold text
- \`<em>\` - Italic text
- \`<span>\` - Inline container

## Semantic HTML

Use semantic HTML for better accessibility and SEO:

- \`<header>\` - Page or section header
- \`<nav>\` - Navigation links
- \`<main>\` - Main content
- \`<article>\` - Self-contained content
- \`<footer>\` - Page or section footer

## Forms and Input

Forms are essential for user interaction:

\`\`\`html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Submit</button>
</form>
\`\`\`

<Callout variant="tip" title="Pro Tip">
Always use semantic HTML elements instead of generic div elements when possible. This improves accessibility and SEO.
</Callout>

## Practice Exercise

Try creating a simple HTML page with:
- A header with navigation
- A main content area with an article
- A footer with contact information
`;

// Sample JSON blocks for Lesson 3
const jsonLesson3 = {
  metadata: {
    title: "CSS Styling and Layout",
    summary: "Learn CSS fundamentals, flexbox, grid, and responsive design",
    estimatedMinutes: 25,
    tags: ["css", "styling", "layout", "responsive-design"],
    level: "intermediate",
    coverImage: "courses/web-dev/css-cover.jpg",
    objectives: [
      "Master CSS selectors and properties",
      "Understand the box model",
      "Learn flexbox and grid layouts",
      "Create responsive designs"
    ]
  },
  blocks: [
    {
      type: "heading",
      level: 1,
      text: "CSS Styling and Layout"
    },
    {
      type: "paragraph",
      text: "CSS is what makes the web beautiful. Let's explore modern CSS techniques for creating stunning layouts."
    },
    {
      type: "image",
      src: "courses/web-dev/css-box-model.png",
      alt: "CSS Box Model Diagram",
      caption: "The CSS Box Model: Content, Padding, Border, and Margin"
    },
    {
      type: "heading",
      level: 2,
      text: "CSS Selectors"
    },
    {
      type: "code",
      language: "css",
      code: `/* Element Selector */
p {
  color: #333;
}

/* Class Selector */
.highlight {
  background-color: yellow;
}

/* ID Selector */
#header {
  font-size: 24px;
}

/* Attribute Selector */
input[type="text"] {
  border: 1px solid #ccc;
}

/* Pseudo-class Selector */
a:hover {
  color: blue;
}`,
      filename: "selectors.css"
    },
    {
      type: "callout",
      variant: "warning",
      title: "Specificity Matters",
      content: "ID selectors have higher specificity than class selectors, which have higher specificity than element selectors. Be careful not to create overly specific selectors that are hard to override."
    },
    {
      type: "heading",
      level: 2,
      text: "Flexbox Layout"
    },
    {
      type: "paragraph",
      text: "Flexbox is a powerful layout system for creating flexible, responsive layouts:"
    },
    {
      type: "code",
      language: "css",
      code: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 300px; /* grow, shrink, basis */
  margin: 10px;
}`,
      showLineNumbers: true
    },
    {
      type: "heading",
      level: 2,
      text: "CSS Grid"
    },
    {
      type: "paragraph",
      text: "CSS Grid is perfect for two-dimensional layouts:"
    },
    {
      type: "code",
      language: "css",
      code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}`,
      showLineNumbers: true,
      highlightLines: [3]
    },
    {
      type: "quiz",
      questions: [
        {
          id: "1",
          type: "multiple_choice",
          question: "Which CSS property controls the space between the content and the border?",
          options: ["margin", "padding", "spacing", "gap"],
          correctAnswer: "padding",
          explanation: "Padding is the space between the content and the border. Margin is the space outside the border.",
          points: 1
        },
        {
          id: "2",
          type: "short_answer",
          question: "What CSS property makes an element a flex container?",
          correctAnswer: "display: flex",
          points: 1
        }
      ],
      passingScore: 70,
      showFeedback: true
    },
    {
      type: "heading",
      level: 2,
      text: "Responsive Design"
    },
    {
      type: "columns",
      columns: [
        [
          {
            type: "heading",
            level: 3,
            text: "Mobile First"
          },
          {
            type: "code",
            language: "css",
            code: `/* Base styles for mobile */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}`
          }
        ],
        [
          {
            type: "heading",
            level: 3,
            text: "Desktop First"
          },
          {
            type: "code",
            language: "css",
            code: `/* Base styles for desktop */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Mobile styles */
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 10px;
  }
}`
          }
        ]
      ],
      gap: 4,
      responsive: true
    }
  ]
};

// Sample JSON blocks for Lesson 4
const jsonLesson4 = {
  metadata: {
    title: "JavaScript Fundamentals",
    summary: "Master JavaScript basics, functions, DOM manipulation, and ES6+ features",
    estimatedMinutes: 30,
    tags: ["javascript", "programming", "es6", "dom"],
    level: "intermediate",
    coverImage: "courses/web-dev/js-cover.jpg"
  },
  blocks: [
    {
      type: "heading",
      level: 1,
      text: "JavaScript Fundamentals"
    },
    {
      type: "paragraph",
      text: "JavaScript brings your web pages to life. Let's explore the core concepts and modern features."
    },
    {
      type: "video",
      provider: "youtube",
      videoId: "W6NZfCO5SIk",
      title: "JavaScript in 100 Seconds"
    },
    {
      type: "heading",
      level: 2,
      text: "Variables and Data Types"
    },
    {
      type: "code",
      language: "javascript",
      code: `// Modern variable declarations
const PI = 3.14159; // Constants can't be reassigned
let count = 0;      // Variables that can change
var oldWay = true;  // Avoid using var

// Data types
const string = "Hello World";
const number = 42;
const boolean = true;
const array = [1, 2, 3, 4, 5];
const object = { name: "John", age: 30 };
const nothing = null;
const notDefined = undefined;`,
      runnable: true
    },
    {
      type: "heading",
      level: 2,
      text: "Functions"
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Function Declaration",
          content: [
            {
              type: "code",
              language: "javascript",
              code: `// Traditional function
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`
            }
          ]
        },
        {
          label: "Arrow Functions",
          content: [
            {
              type: "code",
              language: "javascript",
              code: `// Arrow function
const greet = (name) => {
  return \`Hello, \${name}!\`;
};

// Short syntax for single expressions
const greetShort = name => \`Hello, \${name}!\`;

console.log(greetShort("World"));`
            }
          ]
        }
      ],
      defaultTab: 0
    },
    {
      type: "heading",
      level: 2,
      text: "DOM Manipulation"
    },
    {
      type: "code",
      language: "javascript",
      code: `// Select elements
const button = document.querySelector('#myButton');
const allDivs = document.querySelectorAll('div');

// Add event listener
button.addEventListener('click', () => {
  // Create new element
  const newDiv = document.createElement('div');
  newDiv.textContent = 'New content!';
  newDiv.classList.add('highlight');
  
  // Append to body
  document.body.appendChild(newDiv);
});

// Modify existing elements
allDivs.forEach(div => {
  div.style.backgroundColor = '#f0f0f0';
});`,
      filename: "dom-manipulation.js"
    },
    {
      type: "callout",
      variant: "tip",
      title: "Modern JavaScript",
      content: "Always use const for values that won't change and let for values that will. Avoid var as it has confusing scoping rules."
    },
    {
      type: "heading",
      level: 2,
      text: "Array Methods"
    },
    {
      type: "table",
      headers: ["Method", "Description", "Example"],
      rows: [
        ["map()", "Transform each element", "arr.map(x => x * 2)"],
        ["filter()", "Keep elements that pass test", "arr.filter(x => x > 5)"],
        ["reduce()", "Reduce to single value", "arr.reduce((sum, x) => sum + x, 0)"],
        ["find()", "Find first matching element", "arr.find(x => x.id === 1)"],
        ["forEach()", "Execute function for each", "arr.forEach(x => console.log(x))"]
      ],
      responsive: true,
      sortable: true
    },
    {
      type: "quiz",
      questions: [
        {
          id: "1",
          type: "multiple_choice",
          question: "Which array method returns a new array with transformed elements?",
          options: ["forEach()", "map()", "filter()", "find()"],
          correctAnswer: "map()",
          explanation: "map() creates a new array by transforming each element with the provided function.",
          points: 1
        },
        {
          id: "2",
          type: "true_false",
          question: "Arrow functions have their own 'this' binding.",
          correctAnswer: false,
          explanation: "Arrow functions inherit 'this' from their enclosing scope, unlike regular functions.",
          points: 1
        }
      ],
      passingScore: 80,
      randomizeQuestions: true
    }
  ]
};

// Mixed content for Lesson 5 - using existing slide format
const slideLesson5 = {
  title: "Building Your First Web App",
  description: "Put it all together to create a complete web application",
  slides: [
    {
      title: "Project Overview",
      template: "title-content",
      blocks: [
        {
          type: "title",
          content: { content: "Building a Todo App", level: 1 }
        },
        {
          type: "text",
          content: { content: "Let's combine HTML, CSS, and JavaScript to build a functional todo application!" }
        },
        {
          type: "image",
          content: { src: "courses/web-dev/todo-app-preview.png", alt: "Todo App Preview" }
        }
      ]
    },
    {
      title: "HTML Structure",
      template: "code-explanation",
      blocks: [
        {
          type: "text",
          content: { content: "First, let's create the HTML structure:" }
        },
        {
          type: "code",
          content: {
            language: "html",
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Todo App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>My Todo List</h1>
        <form id="todo-form">
            <input type="text" id="todo-input" placeholder="Add a new task...">
            <button type="submit">Add</button>
        </form>
        <ul id="todo-list"></ul>
    </div>
    <script src="app.js"></script>
</body>
</html>`
          }
        }
      ]
    },
    {
      title: "Styling with CSS",
      template: "split-content",
      blocks: [
        {
          type: "code",
          content: {
            language: "css",
            code: `.container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

#todo-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#todo-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background: white;
    margin-bottom: 5px;
    border-radius: 5px;
}`
          }
        }
      ]
    },
    {
      title: "JavaScript Functionality",
      template: "interactive",
      blocks: [
        {
          type: "quiz",
          content: {
            questions: [
              {
                type: "multiple_choice",
                question: "What event should we listen for on the form?",
                options: ["click", "submit", "change", "load"],
                correctAnswer: 1,
                explanation: "The submit event is fired when a form is submitted."
              }
            ]
          }
        },
        {
          type: "code",
          content: {
            language: "javascript",
            code: `const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = input.value.trim();
    if (text === '') return;
    
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = \`
        <input type="checkbox">
        <span>\${text}</span>
        <button onclick="this.parentElement.remove()">Delete</button>
    \`;
    
    list.appendChild(li);
    input.value = '';
});`
          }
        }
      ]
    },
    {
      title: "Congratulations!",
      template: "celebration",
      blocks: [
        {
          type: "title",
          content: { content: "🎉 Course Complete!", level: 1 }
        },
        {
          type: "text",
          content: { content: "You've learned the fundamentals of web development!" }
        },
        {
          type: "list",
          content: {
            items: [
              "✅ HTML structure and semantic markup",
              "✅ CSS styling and responsive design",
              "✅ JavaScript programming and DOM manipulation",
              "✅ Building a complete web application"
            ]
          }
        }
      ]
    }
  ]
};

async function createDemoCourse() {
  try {
    console.log('🚀 Creating demo course...');

    // Check if demo user exists, if not create one
    let user = await prisma.user.findFirst({
      where: { email: 'demo@coursekit.com' }
    });

    if (!user) {
      console.log('📝 Creating demo user...');
      user = await prisma.user.create({
        data: {
          clerkId: 'demo_' + Date.now(),
          email: 'demo@coursekit.com',
          username: 'democoursekit',
          bio: 'Demo user for testing the unified content system',
          xp: 0,
          level: 1,
        }
      });
      console.log('✅ Created demo user');
    }

    console.log(`✅ Using user: ${user.email}`);

    // Create course
    const course = await prisma.course.create({
      data: {
        title: 'Complete Web Development Fundamentals',
        description: 'Learn HTML, CSS, JavaScript, and build your first web application',
        thumbnail: 'courses/web-dev/course-thumbnail.jpg',
        difficulty: 'BEGINNER',
        estimatedHours: 2.5,
        category: 'Web Development',
        tags: ['html', 'css', 'javascript', 'web-development', 'frontend'],
        isPublished: true,
        visibility: 'PUBLIC',
      }
    });
    console.log('✅ Created course:', course.title);

    // Create modules
    const module1 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: 'Getting Started',
        description: 'Introduction to web development and HTML',
        orderIndex: 0,
      }
    });

    const module2 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: 'Styling and Interactivity',
        description: 'CSS, JavaScript, and building your first app',
        orderIndex: 1,
      }
    });

    console.log('✅ Created modules');

    // Create Lesson 1 - MDX
    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development',
        content: {},
        contentType: 'MDX',
        mdxContent: mdxLesson1,
        duration: 15,
        orderIndex: 0,
        xpReward: 50,
      }
    });
    console.log('✅ Created Lesson 1 (MDX)');

    // Create Lesson 2 - MDX
    await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: 'HTML Deep Dive',
        description: 'Master HTML elements and semantic markup',
        content: {},
        contentType: 'MDX',
        mdxContent: mdxLesson2,
        duration: 20,
        orderIndex: 1,
        xpReward: 75,
      }
    });
    console.log('✅ Created Lesson 2 (MDX)');

    // Create Lesson 3 - JSON Blocks
    await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        title: 'CSS Styling and Layout',
        description: 'Learn CSS fundamentals and modern layout techniques',
        content: {},
        contentType: 'JSON_BLOCKS',
        jsonBlocks: jsonLesson3,
        contentMetadata: jsonLesson3.metadata,
        duration: 25,
        orderIndex: 0,
        xpReward: 100,
      }
    });
    console.log('✅ Created Lesson 3 (JSON Blocks)');

    // Create Lesson 4 - JSON Blocks
    await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        title: 'JavaScript Fundamentals',
        description: 'Master JavaScript basics and DOM manipulation',
        content: {},
        contentType: 'JSON_BLOCKS',
        jsonBlocks: jsonLesson4,
        contentMetadata: jsonLesson4.metadata,
        duration: 30,
        orderIndex: 1,
        xpReward: 100,
      }
    });
    console.log('✅ Created Lesson 4 (JSON Blocks)');

    // Create Lesson 5 - Traditional Slides
    const lesson5 = await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        title: 'Building Your First Web App',
        description: 'Put it all together to create a todo application',
        content: {},
        contentType: 'SLIDES',
        duration: 20,
        orderIndex: 2,
        xpReward: 150,
      }
    });

    // Create slides for Lesson 5
    for (let i = 0; i < slideLesson5.slides.length; i++) {
      const slideData = slideLesson5.slides[i];
      const slide = await prisma.slide.create({
        data: {
          lessonId: lesson5.id,
          title: slideData.title,
          template: slideData.template,
          orderIndex: i,
        }
      });

      // Create blocks for each slide
      for (let j = 0; j < slideData.blocks.length; j++) {
        const blockData = slideData.blocks[j];
        await prisma.contentBlock.create({
          data: {
            slideId: slide.id,
            type: blockData.type,
            content: blockData.content,
            orderIndex: j,
          }
        });
      }
    }
    console.log('✅ Created Lesson 5 (Slides)');

    console.log('\n🎉 Demo course created successfully!');
    console.log(`📚 Course ID: ${course.id}`);
    console.log(`🔗 View at: http://localhost:3000/learn/course/${course.id}`);
    
    // Create enrollment for the user
    try {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE',
        }
      });
      console.log('✅ Enrolled user in course');
    } catch (error) {
      console.log('ℹ️  User may already be enrolled');
    }

  } catch (error) {
    console.error('❌ Error creating demo course:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoCourse();