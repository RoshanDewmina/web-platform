// Mock TipTap editor for testing
export const mockEditor = {
  getHTML: jest.fn(() => "<p>Test content</p>"),
  chain: jest.fn(() => mockEditor),
  focus: jest.fn(() => mockEditor),
  toggleBold: jest.fn(() => mockEditor),
  toggleItalic: jest.fn(() => mockEditor),
  toggleCode: jest.fn(() => mockEditor),
  toggleHighlight: jest.fn(() => mockEditor),
  toggleHeading: jest.fn(() => mockEditor),
  toggleBulletList: jest.fn(() => mockEditor),
  toggleOrderedList: jest.fn(() => mockEditor),
  toggleBlockquote: jest.fn(() => mockEditor),
  setLink: jest.fn(() => mockEditor),
  undo: jest.fn(() => mockEditor),
  redo: jest.fn(() => mockEditor),
  run: jest.fn(() => mockEditor),
  can: jest.fn(() => mockEditor),
  isActive: jest.fn(() => false),
};

jest.mock("@tiptap/react", () => ({
  useEditor: jest.fn(() => mockEditor),
  EditorContent: jest.fn(({ editor }) => <div>Editor Content</div>),
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
