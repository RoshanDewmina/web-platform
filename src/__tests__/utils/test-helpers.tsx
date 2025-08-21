import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/theme-provider';

// Mock user data
export const mockUser = {
  id: 'test-user-123',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  imageUrl: 'https://example.com/avatar.jpg',
  publicMetadata: {
    role: 'student',
    bio: 'Test bio',
    level: 5,
    xp: 1250,
  },
};

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-123',
  email: 'admin@example.com',
  publicMetadata: {
    ...mockUser.publicMetadata,
    role: 'admin',
  },
};

// Mock course data
export const mockCourseData = {
  id: 'course-123',
  title: 'Test Course',
  description: 'Test course description',
  thumbnail: 'https://example.com/thumbnail.jpg',
  difficulty: 'BEGINNER',
  estimatedHours: 10,
  category: 'Technology',
  tags: ['test', 'course'],
  isPublished: true,
  modules: [
    {
      id: 'module-1',
      title: 'Module 1',
      description: 'First module',
      orderIndex: 0,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Lesson 1',
          description: 'First lesson',
          orderIndex: 0,
          xpReward: 10,
        },
      ],
    },
  ],
};

// Mock progress data
export const mockProgressData = {
  userId: 'test-user-123',
  courseId: 'course-123',
  lessonsCompleted: 5,
  totalLessons: 10,
  progress: 50,
  xpEarned: 250,
  currentStreak: 7,
};

// Mock achievement data
export const mockAchievements = [
  {
    id: 'ach-1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👟',
    category: 'PROGRESS',
    xpReward: 50,
    earned: true,
    earnedAt: new Date('2024-01-15'),
  },
  {
    id: 'ach-2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'STREAK',
    xpReward: 100,
    earned: false,
  },
];

// Custom render function with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Helper to mock API responses
export function mockApiResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
}

// Helper to wait for async operations
export async function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Helper to generate test IDs
export function generateTestId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to create mock file
export function createMockFile(
  name: string,
  size: number,
  type: string
): File {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

// Helper for form validation testing
export function fillForm(container: HTMLElement, formData: Record<string, string>) {
  Object.entries(formData).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

// Helper to mock localStorage
export class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Helper to mock WebSocket
export class WebSocketMock {
  url: string;
  readyState: number = WebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 0);
  }

  send(data: string): void {
    // Mock send
  }

  close(): void {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
}

// Helper to test error boundaries
export class ErrorBoundaryTestComponent extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error occurred</div>;
    }
    return this.props.children;
  }
}

// Helper to mock fetch
export function mockFetch(response: any) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as jest.Mock;
}

// Helper to test accessibility
export async function checkA11y(container: HTMLElement) {
  const axe = require('jest-axe');
  const results = await axe.axe(container);
  return results.violations;
}

// Helper to simulate network conditions
export function simulateSlowNetwork(delay: number = 1000) {
  const originalFetch = global.fetch;
  global.fetch = jest.fn((...args) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(originalFetch(...args));
      }, delay);
    });
  }) as jest.Mock;
}

// Helper to test drag and drop
export function simulateDragAndDrop(
  source: HTMLElement,
  target: HTMLElement
) {
  const dataTransfer = {
    dropEffect: '',
    effectAllowed: 'all',
    files: [],
    items: [],
    types: [],
    getData: jest.fn(),
    setData: jest.fn(),
    clearData: jest.fn(),
  };

  const dragStartEvent = new DragEvent('dragstart', {
    bubbles: true,
    cancelable: true,
    dataTransfer: dataTransfer as any,
  });

  const dropEvent = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer: dataTransfer as any,
  });

  source.dispatchEvent(dragStartEvent);
  target.dispatchEvent(dropEvent);
}

// Export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
