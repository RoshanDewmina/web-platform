import { LayoutTemplate, GridElement } from "@/types/slide-builder";

// Predefined layout templates
export const slideTemplates: LayoutTemplate[] = [
  // Title Slides
  {
    id: "title-center",
    name: "Title Center",
    description: "Centered title slide",
    category: "title",
    elements: [
      {
        type: "title",
        x: 2,
        y: 4,
        w: 8,
        h: 2,
      },
      {
        type: "text",
        x: 2,
        y: 6,
        w: 8,
        h: 2,
      },
    ],
    defaultProps: {
      title: { 
        content: "Presentation Title", 
        level: 1, 
        align: "center",
        fontSize: 48 
      },
      text: { 
        content: "Subtitle or presenter name", 
        align: "center",
        fontSize: 24 
      },
    },
    tags: ["title", "intro", "cover"],
  },

  // Content Layouts
  {
    id: "title-content",
    name: "Title & Content",
    description: "Standard title with content below",
    category: "content",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 12,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Slide Title", level: 2 },
      text: { content: "• Point 1\n• Point 2\n• Point 3" },
    },
    tags: ["content", "standard"],
  },

  {
    id: "two-column",
    name: "Two Column",
    description: "Content split into two columns",
    category: "content",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 6,
        h: 9,
      },
      {
        type: "text",
        x: 6,
        y: 3,
        w: 6,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Two Column Layout", level: 2 },
      text: { content: "Left column content" },
    },
    tags: ["columns", "comparison"],
  },

  {
    id: "three-column",
    name: "Three Column",
    description: "Content split into three columns",
    category: "content",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 4,
        h: 9,
      },
      {
        type: "text",
        x: 4,
        y: 3,
        w: 4,
        h: 9,
      },
      {
        type: "text",
        x: 8,
        y: 3,
        w: 4,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Three Column Layout", level: 2 },
    },
    tags: ["columns", "comparison"],
  },

  // Media Layouts
  {
    id: "media-left",
    name: "Media Left",
    description: "Media on the left, content on the right",
    category: "media",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "image",
        x: 0,
        y: 3,
        w: 6,
        h: 9,
      },
      {
        type: "text",
        x: 6,
        y: 3,
        w: 6,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Media & Content", level: 2 },
      image: { alt: "Image placeholder" },
      text: { content: "Content describing the media" },
    },
    tags: ["media", "image", "split"],
  },

  {
    id: "media-right",
    name: "Media Right",
    description: "Content on the left, media on the right",
    category: "media",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 6,
        h: 9,
      },
      {
        type: "image",
        x: 6,
        y: 3,
        w: 6,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Content & Media", level: 2 },
      text: { content: "Content describing the media" },
      image: { alt: "Image placeholder" },
    },
    tags: ["media", "image", "split"],
  },

  {
    id: "full-media",
    name: "Full Media",
    description: "Full-screen media with overlay text",
    category: "media",
    elements: [
      {
        type: "image",
        x: 0,
        y: 0,
        w: 12,
        h: 12,
      },
      {
        type: "title",
        x: 1,
        y: 1,
        w: 10,
        h: 2,
      },
    ],
    defaultProps: {
      image: { alt: "Background image", fit: "cover" },
      title: { 
        content: "Overlay Title", 
        level: 1, 
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0.7)",
        align: "center"
      },
    },
    tags: ["media", "fullscreen", "hero"],
  },

  {
    id: "video-center",
    name: "Video Center",
    description: "Centered video with title",
    category: "media",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "video",
        x: 2,
        y: 3,
        w: 8,
        h: 8,
      },
    ],
    defaultProps: {
      title: { content: "Video Content", level: 2, align: "center" },
      video: { controls: true },
    },
    tags: ["media", "video"],
  },

  // Data Visualization Layouts
  {
    id: "chart-single",
    name: "Single Chart",
    description: "Large chart with title",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "chart",
        x: 1,
        y: 3,
        w: 10,
        h: 8,
      },
    ],
    defaultProps: {
      title: { content: "Data Visualization", level: 2 },
      chart: { chartType: "bar" },
    },
    tags: ["data", "chart", "visualization"],
  },

  {
    id: "chart-comparison",
    name: "Chart Comparison",
    description: "Two charts side by side",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "chart",
        x: 0,
        y: 3,
        w: 6,
        h: 8,
      },
      {
        type: "chart",
        x: 6,
        y: 3,
        w: 6,
        h: 8,
      },
    ],
    defaultProps: {
      title: { content: "Data Comparison", level: 2 },
    },
    tags: ["data", "chart", "comparison"],
  },

  // Code & Technical Layouts
  {
    id: "code-explanation",
    name: "Code with Explanation",
    description: "Code block with explanatory text",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "code",
        x: 0,
        y: 3,
        w: 7,
        h: 9,
      },
      {
        type: "text",
        x: 7,
        y: 3,
        w: 5,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Code Example", level: 2 },
      code: { 
        code: "// Your code here\nfunction example() {\n  return 'Hello World';\n}",
        language: "javascript"
      },
      text: { content: "Explanation of the code:\n\n• Point 1\n• Point 2" },
    },
    tags: ["code", "technical", "programming"],
  },

  // Quiz & Interactive Layouts
  {
    id: "quiz-single",
    name: "Single Quiz",
    description: "Interactive quiz slide",
    category: "quiz",
    elements: [
      {
        type: "quiz",
        x: 1,
        y: 1,
        w: 10,
        h: 10,
      },
    ],
    defaultProps: {
      quiz: {
        title: "Knowledge Check",
        questions: [
          {
            id: "q1",
            type: "multiple-choice",
            question: "Sample question?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A",
          },
        ],
      },
    },
    tags: ["quiz", "interactive", "assessment"],
  },

  {
    id: "quiz-with-content",
    name: "Quiz with Content",
    description: "Quiz alongside explanatory content",
    category: "quiz",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 5,
        h: 9,
      },
      {
        type: "quiz",
        x: 5,
        y: 3,
        w: 7,
        h: 9,
      },
    ],
    defaultProps: {
      title: { content: "Interactive Quiz", level: 2 },
      text: { content: "Instructions or context for the quiz" },
    },
    tags: ["quiz", "interactive", "mixed"],
  },

  // Special Layouts
  {
    id: "timeline",
    name: "Timeline",
    description: "Timeline layout with multiple points",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 3,
        h: 3,
      },
      {
        type: "text",
        x: 3,
        y: 3,
        w: 3,
        h: 3,
      },
      {
        type: "text",
        x: 6,
        y: 3,
        w: 3,
        h: 3,
      },
      {
        type: "text",
        x: 9,
        y: 3,
        w: 3,
        h: 3,
      },
    ],
    defaultProps: {
      title: { content: "Timeline", level: 2, align: "center" },
    },
    tags: ["timeline", "sequence", "process"],
  },

  {
    id: "grid-4",
    name: "4-Grid Layout",
    description: "Four equal sections",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "text",
        x: 0,
        y: 3,
        w: 6,
        h: 4,
      },
      {
        type: "text",
        x: 6,
        y: 3,
        w: 6,
        h: 4,
      },
      {
        type: "text",
        x: 0,
        y: 7,
        w: 6,
        h: 4,
      },
      {
        type: "text",
        x: 6,
        y: 7,
        w: 6,
        h: 4,
      },
    ],
    defaultProps: {
      title: { content: "Four Quadrants", level: 2, align: "center" },
    },
    tags: ["grid", "quadrants", "matrix"],
  },

  {
    id: "callout-highlight",
    name: "Callout Highlight",
    description: "Important message with callout",
    category: "custom",
    elements: [
      {
        type: "title",
        x: 0,
        y: 0,
        w: 12,
        h: 2,
      },
      {
        type: "callout",
        x: 2,
        y: 3,
        w: 8,
        h: 3,
      },
      {
        type: "text",
        x: 1,
        y: 7,
        w: 10,
        h: 4,
      },
    ],
    defaultProps: {
      title: { content: "Important Note", level: 2 },
      callout: { 
        type: "warning", 
        content: "Key point to remember" 
      },
      text: { content: "Supporting information and details" },
    },
    tags: ["callout", "highlight", "important"],
  },

  // Blank Templates
  {
    id: "blank",
    name: "Blank Slide",
    description: "Empty slide to start from scratch",
    category: "custom",
    elements: [],
    defaultProps: {},
    tags: ["blank", "empty", "custom"],
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): LayoutTemplate[] {
  return slideTemplates.filter(template => template.category === category);
}

// Helper function to get templates by tags
export function getTemplatesByTags(tags: string[]): LayoutTemplate[] {
  return slideTemplates.filter(template => 
    template.tags?.some(tag => tags.includes(tag))
  );
}

// Helper function to search templates
export function searchTemplates(query: string): LayoutTemplate[] {
  const lowerQuery = query.toLowerCase();
  return slideTemplates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Helper function to apply template with custom props
export function applyTemplateWithProps(
  template: LayoutTemplate,
  customProps?: Record<string, any>
): GridElement[] {
  return template.elements.map((element, index) => ({
    ...element,
    id: `element-${Date.now()}-${index}`,
    props: {
      ...template.defaultProps?.[element.type],
      ...customProps?.[element.type],
    },
  }));
}
