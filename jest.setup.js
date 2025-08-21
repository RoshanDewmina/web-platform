import "@testing-library/jest-dom";

// Mock environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test_pk_test";
process.env.CLERK_SECRET_KEY = "test_sk_test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  auth: jest.fn(() => Promise.resolve({ userId: "test-user-id" })),
  currentUser: jest.fn(() =>
    Promise.resolve({
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      emailAddress: "test@example.com",
    })
  ),
  useAuth: jest.fn(() => ({
    userId: "test-user-id",
    isLoaded: true,
    isSignedIn: true,
  })),
  useUser: jest.fn(() => ({
    user: {
      id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      primaryEmailAddress: {
        emailAddress: "test@example.com",
      },
    },
    isLoaded: true,
    isSignedIn: true,
  })),
  SignIn: jest.fn(() => null),
  SignUp: jest.fn(() => null),
  UserButton: jest.fn(() => null),
  ClerkProvider: ({ children }) => children,
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/test",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock TipTap editor
const mockEditor = {
  getHTML: jest.fn(() => "<p>Test content</p>"),
  chain: jest.fn().mockReturnThis(),
  focus: jest.fn().mockReturnThis(),
  toggleBold: jest.fn().mockReturnThis(),
  toggleItalic: jest.fn().mockReturnThis(),
  toggleCode: jest.fn().mockReturnThis(),
  toggleHighlight: jest.fn().mockReturnThis(),
  toggleHeading: jest.fn().mockReturnThis(),
  toggleBulletList: jest.fn().mockReturnThis(),
  toggleOrderedList: jest.fn().mockReturnThis(),
  toggleBlockquote: jest.fn().mockReturnThis(),
  setLink: jest.fn().mockReturnThis(),
  undo: jest.fn().mockReturnThis(),
  redo: jest.fn().mockReturnThis(),
  run: jest.fn().mockReturnThis(),
  can: jest.fn().mockReturnThis(),
  isActive: jest.fn(() => false),
};

jest.mock("@tiptap/react", () => ({
  useEditor: jest.fn(() => mockEditor),
  EditorContent: () => "EditorContent",
}));

jest.mock("@tiptap/starter-kit", () => ({
  default: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock("@tiptap/extension-text-style", () => ({
  default: {},
}));

jest.mock("@tiptap/extension-color", () => ({
  default: {},
}));

jest.mock("@tiptap/extension-highlight", () => ({
  default: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock("@tiptap/extension-link", () => ({
  default: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock("@tiptap/extension-image", () => ({
  default: {},
}));

jest.mock("@tiptap/extension-code-block-lowlight", () => ({
  default: {
    configure: jest.fn(() => ({})),
  },
}));

jest.mock("lowlight", () => ({
  common: {},
  createLowlight: jest.fn(() => ({})),
}));

// Mock Radix UI Context Menu
jest.mock("@radix-ui/react-context-menu", () => ({
  ContextMenu: ({ children }) => children,
  ContextMenuTrigger: ({ children }) => children,
  ContextMenuContent: ({ children }) => children,
  ContextMenuItem: ({ children }) => children,
  ContextMenuSeparator: () => null,
}));

// Mock Radix UI Collapsible
jest.mock("@radix-ui/react-collapsible", () => ({
  Collapsible: ({ children }) => children,
  CollapsibleTrigger: ({ children }) => children,
  CollapsibleContent: ({ children }) => children,
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
