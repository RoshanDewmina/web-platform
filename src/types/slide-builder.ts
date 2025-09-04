import { z } from 'zod';

// ==================== Grid System ====================
export interface GridConfig {
  columns: number;
  rows: number;
  cellSize: 'fixed' | 'responsive';
  gutterSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
}

export const DEFAULT_GRID: GridConfig = {
  columns: 12,
  rows: 12,
  cellSize: 'responsive',
  gutterSize: 8,
  snapToGrid: true,
  showGrid: true,
};

// ==================== Component Registry ====================
export type ComponentCategory = 
  | 'text' 
  | 'media' 
  | 'layout' 
  | 'interactive' 
  | 'data' 
  | 'custom';

export interface ComponentDefinition {
  type: string;
  name: string;
  description: string;
  icon?: string;
  category: ComponentCategory;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  propSchema: z.ZodSchema;
  defaultProps: Record<string, any>;
  previewComponent?: React.ComponentType<any>;
  renderComponent?: React.ComponentType<any>;
}

// ==================== Grid-Based Elements ====================
export interface GridElement {
  id: string;
  type: string;
  x: number;        // Grid column (0-11)
  y: number;        // Grid row (0-11)
  w: number;        // Width in grid cells
  h: number;        // Height in grid cells
  props: Record<string, any>;
  locked?: boolean;
  zIndex?: number;
  visible?: boolean;
  responsive?: {
    mobile?: { x: number; y: number; w: number; h: number };
    tablet?: { x: number; y: number; w: number; h: number };
  };
}

// ==================== Enhanced Slide Model ====================
export interface SlideLayout {
  id: string;
  title: string;
  elements: GridElement[];
  notes?: string;
  theme?: SlideTheme;
  transition?: 'fade' | 'slide' | 'none';
  duration?: number; // Auto-advance timing in seconds
  background?: {
    type: 'color' | 'gradient' | 'image' | 'video';
    value: string;
  };
  accessibility?: {
    altText?: string;
    description?: string;
    tabOrder?: string[]; // Element IDs in tab order
  };
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    tags?: string[];
  };
}

// ==================== Theme Configuration ====================
export interface SlideTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
      base: number;
      scale: number;
    };
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borders: {
    radius: number;
    width: number;
    style: string;
  };
}

// ==================== Assets ====================
export interface Asset {
  id: string;
  courseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    transcript?: string;
    alt?: string;
  };
  tags: string[];
  sha256Hash: string;
  createdAt: Date;
}

// ==================== AI Commands ====================
export type AICommandType = 
  | 'create_slides_from_text'
  | 'new_slide'
  | 'add_element'
  | 'move_element'
  | 'update_props'
  | 'delete_element'
  | 'duplicate_element'
  | 'reorder_slides'
  | 'apply_layout_template'
  | 'link_asset'
  | 'generate_quiz'
  | 'set_theme';

export interface AICommand {
  id: string;
  type: AICommandType;
  parameters: Record<string, any>;
  timestamp: Date;
  userId?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

// ==================== Slide Plan (for AI generation) ====================
export interface SlidePlanElement {
  type: string;
  slot: 'full' | 'left' | 'right' | 'top' | 'bottom' | 'center';
  content?: string;
  placeholder?: string;
  suggestedSize?: { w: number; h: number };
}

export interface SlidePlan {
  slides: Array<{
    title: string;
    elements: SlidePlanElement[];
    notes?: string;
    estimatedDuration?: number;
    layoutTemplate?: string;
  }>;
  assetsNeeded: Array<{
    kind: 'image' | 'video' | 'audio' | 'document';
    description: string;
    suggestedTags: string[];
  }>;
  totalDuration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// ==================== Layout Templates ====================
export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  preview?: string;
  category: 'title' | 'content' | 'comparison' | 'media' | 'quiz' | 'custom';
  elements: Omit<GridElement, 'id' | 'props'>[];
  defaultProps?: Record<string, Record<string, any>>;
  tags?: string[];
}

// ==================== Collision Detection ====================
export interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  elementId?: string;
}

export interface CollisionResult {
  hasCollision: boolean;
  collidingElements: string[];
  suggestedPosition?: { x: number; y: number };
}

// ==================== Validation Schemas ====================
export const GridElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  x: z.number().min(0).max(11),
  y: z.number().min(0).max(11),
  w: z.number().min(1).max(12),
  h: z.number().min(1).max(12),
  props: z.record(z.any(), z.any()),
  locked: z.boolean().optional(),
  zIndex: z.number().optional(),
  visible: z.boolean().optional(),
});

export const SlideLayoutSchema = z.object({
  id: z.string(),
  title: z.string(),
  elements: z.array(GridElementSchema),
  notes: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'none']).optional(),
  duration: z.number().optional(),
});

// ==================== Helper Functions ====================
export function slotToGridPosition(slot: SlidePlanElement['slot']): { x: number; y: number; w: number; h: number } {
  switch (slot) {
    case 'full':
      return { x: 0, y: 0, w: 12, h: 12 };
    case 'left':
      return { x: 0, y: 0, w: 6, h: 12 };
    case 'right':
      return { x: 6, y: 0, w: 6, h: 12 };
    case 'top':
      return { x: 0, y: 0, w: 12, h: 6 };
    case 'bottom':
      return { x: 0, y: 6, w: 12, h: 6 };
    case 'center':
      return { x: 3, y: 3, w: 6, h: 6 };
    default:
      return { x: 0, y: 0, w: 12, h: 12 };
  }
}

export function checkCollision(
  element: Pick<GridElement, 'x' | 'y' | 'w' | 'h'>,
  elements: GridElement[],
  excludeId?: string
): CollisionResult {
  const collidingElements: string[] = [];
  
  for (const other of elements) {
    if (other.id === excludeId) continue;
    
    const hasOverlap = !(
      element.x + element.w <= other.x ||
      other.x + other.w <= element.x ||
      element.y + element.h <= other.y ||
      other.y + other.h <= element.y
    );
    
    if (hasOverlap) {
      collidingElements.push(other.id);
    }
  }
  
  return {
    hasCollision: collidingElements.length > 0,
    collidingElements,
    suggestedPosition: collidingElements.length > 0 ? findFreePosition(element, elements) : undefined,
  };
}

export function findFreePosition(
  element: Pick<GridElement, 'w' | 'h'>,
  elements: GridElement[]
): { x: number; y: number } | undefined {
  // Try to find a free position for the element
  for (let y = 0; y <= 12 - element.h; y++) {
    for (let x = 0; x <= 12 - element.w; x++) {
      const testElement = { ...element, x, y };
      const collision = checkCollision(testElement, elements);
      if (!collision.hasCollision) {
        return { x, y };
      }
    }
  }
  return undefined;
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

// ==================== Export Component Props ====================
export interface GridCanvasProps {
  slide: SlideLayout;
  gridConfig?: GridConfig;
  selectedElement?: string;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<GridElement>) => void;
  onAddElement: (element: Omit<GridElement, 'id'>) => void;
  onDeleteElement: (elementId: string) => void;
  onReorderElements: (elements: GridElement[]) => void;
  readOnly?: boolean;
  showGuides?: boolean;
  previewMode?: boolean;
}

// ==================== Custom Component Support ====================
export interface CustomComponentDefinition {
  id: string;
  name: string;
  description: string;
  code: string;
  compiledCode?: string;
  dependencies: string[];
  propSchema: z.ZodSchema;
  defaultProps: Record<string, any>;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  category: 'custom';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Real-time Collaboration ====================
export interface CursorPosition {
  userId: string;
  userName: string;
  x: number;
  y: number;
  elementId?: string;
  color: string;
}

export interface CollaborationState {
  cursors: CursorPosition[];
  lockedElements: Record<string, string>; // elementId -> userId
  activeUsers: Array<{
    userId: string;
    userName: string;
    avatarUrl?: string;
    color: string;
  }>;
}
