import { z } from 'zod';

// Custom Component Schema
export const CustomComponentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  code: z.string().min(1),
  compiledCode: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  propSchema: z.record(z.any(), z.any()),
  defaultProps: z.record(z.any(), z.any()).default({}),
  defaultSize: z.object({
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(12),
  }),
  minSize: z.object({
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(12),
  }),
  maxSize: z.object({
    w: z.number().min(1).max(12),
    h: z.number().min(1).max(12),
  }).optional(),
  category: z.string().default('custom'),
  isPublic: z.boolean().default(false),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().default(1),
  tags: z.array(z.string()).default([]),
  usageCount: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  isVerified: z.boolean().default(false),
});

export type CustomComponent = z.infer<typeof CustomComponentSchema>;

// Component Validation Result
export interface ComponentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  compiledCode?: string;
  dependencies: string[];
  propSchema: Record<string, any>;
}

// Component Execution Context
export interface ComponentExecutionContext {
  props: Record<string, any>;
  theme: Record<string, any>;
  slideId: string;
  elementId: string;
  isPreview: boolean;
  isEditing: boolean;
}

// Component Sandbox Options
export interface SandboxOptions {
  timeout?: number;
  maxMemory?: number;
  allowedAPIs?: string[];
  restrictedAPIs?: string[];
  enableConsole?: boolean;
  enableNetwork?: boolean;
}

// Component Editor State
export interface ComponentEditorState {
  code: string;
  props: Record<string, any>;
  previewMode: boolean;
  isCompiling: boolean;
  errors: string[];
  warnings: string[];
  compilationResult?: ComponentValidationResult;
}

// Component Registry Entry
export interface ComponentRegistryEntry {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  defaultProps: Record<string, any>;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  isCustom: boolean;
  component?: React.ComponentType<any>;
  customComponent?: CustomComponent;
}

// Component Template
export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  defaultProps: Record<string, any>;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Component Marketplace
export interface ComponentMarketplace {
  featured: CustomComponent[];
  popular: CustomComponent[];
  recent: CustomComponent[];
  categories: {
    [category: string]: CustomComponent[];
  };
  searchResults: CustomComponent[];
}

// Component Sharing
export interface ComponentShareOptions {
  isPublic: boolean;
  allowForking: boolean;
  requireAttribution: boolean;
  license: string;
  tags: string[];
}

// Component Analytics
export interface ComponentAnalytics {
  usageCount: number;
  averageRating: number;
  totalDownloads: number;
  uniqueUsers: number;
  lastUsed: Date;
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  };
}





