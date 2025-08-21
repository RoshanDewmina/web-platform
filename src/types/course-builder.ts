export type ContentBlockType = 
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'quiz'
  | 'code'
  | 'iframe'
  | 'file'
  | 'divider'
  | 'callout'
  | 'columns';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: any;
  settings: {
    width?: 'full' | 'half' | 'third';
    alignment?: 'left' | 'center' | 'right';
    padding?: string;
    background?: string;
    [key: string]: any;
  };
  order: number;
}

export interface Slide {
  id: string;
  title: string;
  blocks: ContentBlock[];
  notes?: string;
  template?: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  slides: Slide[];
  duration?: number;
  xpReward?: number;
  order: number;
  settings: {
    locked?: boolean;
    prerequisites?: string[];
  };
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  unlockConditions?: {
    type: 'sequential' | 'xp' | 'date';
    value?: any;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  banner?: string;
  modules: Module[];
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    duration: number;
    objectives: string[];
    prerequisites: string[];
    tags: string[];
    category: string;
  };
  settings: {
    status: 'draft' | 'published' | 'archived';
    visibility: 'public' | 'private' | 'restricted';
    enrollmentLimit?: number;
    price?: number;
    publishDate?: Date;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview?: string;
  category: 'title' | 'content' | 'quiz' | 'comparison' | 'custom';
  blocks: Omit<ContentBlock, 'id'>[];
}
