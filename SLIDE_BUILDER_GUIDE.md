# AI-Powered Grid-Based Slide Builder Guide

## Overview

We've successfully enhanced your existing web platform with a sophisticated AI-powered slide builder system that uses a 12x12 grid layout with magnetic snapping, drag-and-drop functionality, and AI-assisted content creation.

## What's Been Built

### ✅ Phase 1: Core Foundation (Completed)

#### 1. **Enhanced Data Models** (`src/types/slide-builder.ts`)
- Grid-based positioning system (x, y, w, h coordinates)
- Component registry with validation schemas
- Layout templates and themes
- Collision detection utilities
- AI command types and interfaces

#### 2. **Database Schema Updates** (`prisma/schema.prisma`)
- Enhanced Slide model with `gridLayout` JSON field for storing grid elements
- Added `EnhancedAsset` model for better asset management
- Added `AICommand` model for command audit logging
- Added `CustomComponent` model for user-created components

#### 3. **State Management** (`src/stores/slide-builder-store.ts`)
- Comprehensive Zustand store for slide builder state
- Undo/redo functionality with history management
- Element manipulation (add, move, resize, delete, duplicate)
- Clipboard operations (copy, cut, paste)
- Alignment and distribution tools
- Z-index management for layering

#### 4. **Grid Canvas Component** (`src/components/slide-builder/grid-canvas.tsx`)
- 12x12 responsive grid system
- Magnetic snapping to grid and alignment guides
- Drag-and-drop with visual feedback
- Resize handles on all sides
- Keyboard navigation (arrow keys for movement)
- Zoom and pan controls
- Collision detection with auto-positioning

#### 5. **Component System**
- **Component Renderer** - Dynamic component loading and rendering
- **Built-in Components**:
  - Text components (title, paragraph, text)
  - Media components (image, video, audio)
  - Interactive components (quiz, code, iframe)
  - Data components (chart, table)
  - Layout components (columns, callout)
- Component property editors with real-time updates

#### 6. **AI Command System** (`src/app/api/ai/slide-commands/route.ts`)
- Command-based architecture (no direct code manipulation)
- Supported commands:
  - `create_slides_from_text` - Generate slides from text content
  - `add_element` - Add components to slides
  - `move_element` - Reposition elements with collision detection
  - `update_props` - Update component properties
  - `delete_element` - Remove elements
  - `apply_layout_template` - Apply predefined layouts
- Audit logging for all commands

#### 7. **Slide Builder Interface** (`src/app/admin/slides/[slideId]/builder/page.tsx`)
- Three-panel layout:
  - Left: Component palette, templates, and AI assistant
  - Center: Grid canvas with visual editing
  - Right: Properties editor
- Toolbar with save, preview, undo/redo
- Real-time property editing

## How to Use

### Creating a New Slide

1. **Navigate to the slide builder**:
   ```
   /admin/slides/new/builder
   ```

2. **Add components**:
   - Drag components from the left palette onto the grid
   - Click a component to add it at position (0,0)
   - Components automatically avoid collisions

3. **Edit components**:
   - Select a component to see its properties
   - Double-click text components to edit inline
   - Use resize handles to adjust size
   - Drag to reposition

4. **Use AI assistance**:
   - Open the AI tab in the left panel
   - Ask for help creating content
   - Use quick actions for common tasks

### Grid System Features

- **12x12 Grid**: Provides precise positioning
- **Magnetic Snapping**: Elements snap to grid cells and align with other elements
- **Alignment Guides**: Visual guides show when elements align
- **Collision Detection**: Prevents overlapping elements
- **Keyboard Controls**:
  - Arrow keys: Move selected element
  - Shift + Arrow: Move faster (2 cells)
  - Delete/Backspace: Remove selected element

### AI Commands

The AI system uses structured commands to manipulate slides:

```javascript
// Example: Add a title element
{
  type: 'add_element',
  parameters: {
    slideId: 'slide-123',
    type: 'title',
    x: 0,
    y: 0,
    w: 12,
    h: 3,
    props: {
      content: 'Welcome to the Presentation'
    }
  }
}
```

### Database Migration

Run the Prisma migration to update your database:

```bash
npx prisma db push
```

## Integration with Existing System

The new slide builder integrates seamlessly with your existing course structure:

1. **Course → Module → Lesson → Slide** hierarchy maintained
2. Slides now use grid-based layouts instead of vertical content blocks
3. Existing slides can be migrated to the new format
4. The original course builder remains functional

## Next Steps

### To Complete Phase 1:
1. **Install new dependencies**:
   ```bash
   npm install @radix-ui/react-slider
   ```

2. **Run database migration**:
   ```bash
   npx prisma db push
   ```

3. **Test the slide builder**:
   - Create a new slide at `/admin/slides/new/builder`
   - Add and arrange components
   - Save and preview

### Phase 2 Features (Pending):
- [ ] Advanced component editors (rich text, code with syntax highlighting)
- [ ] Custom component creation with sandboxed React
- [ ] More layout templates
- [ ] Asset library with S3/MinIO integration
- [ ] Import from PowerPoint/Google Slides

### Phase 3 Features (Pending):
- [ ] Real-time collaboration with Yjs
- [ ] Advanced AI features (content generation, auto-layout)
- [ ] Version history and branching
- [ ] Export to various formats (PDF, SCORM)

## Technical Architecture

### Frontend Stack:
- **Next.js 15.5** - React framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **DND-kit** - Drag and drop
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library

### Backend Stack:
- **PostgreSQL** - Database
- **Prisma** - ORM
- **MinIO** - S3-compatible storage
- **Qdrant** - Vector database for semantic search
- **Clerk** - Authentication

### AI Integration:
- **OpenAI API** - Content generation
- **Command pattern** - Structured AI interactions
- **Vector embeddings** - Semantic asset search

## File Structure

```
src/
├── types/
│   └── slide-builder.ts         # Type definitions
├── stores/
│   └── slide-builder-store.ts   # Zustand store
├── components/
│   └── slide-builder/
│       ├── grid-canvas.tsx      # Main canvas
│       ├── grid-element.tsx     # Individual elements
│       ├── grid-overlay.tsx     # Grid visualization
│       ├── alignment-guides.tsx # Snapping guides
│       ├── component-renderer.tsx # Component rendering
│       ├── component-palette.tsx # Component picker
│       ├── properties-editor.tsx # Property editor
│       ├── ai-assistant.tsx     # AI chat interface
│       └── components/          # Individual components
├── app/
│   ├── admin/slides/[slideId]/builder/page.tsx # Builder page
│   └── api/
│       ├── slides/              # Slide CRUD
│       └── ai/
│           └── slide-commands/  # AI command processing
```

## Troubleshooting

### Common Issues:

1. **Components not rendering**: Check that all component files exist in `src/components/slide-builder/components/`

2. **Grid not showing**: Toggle the grid button in the canvas toolbar

3. **AI commands failing**: Ensure OpenAI API key is set in environment variables

4. **Database errors**: Run `npx prisma db push` to sync schema

## Performance Considerations

- Components are lazy-loaded for better performance
- Grid calculations are memoized
- History is limited to 50 states to prevent memory issues
- Large assets should be uploaded to S3/MinIO, not embedded

## Security

- AI commands are validated with Zod schemas
- Custom components will be sandboxed (Phase 2)
- All API routes require authentication
- File uploads are validated and scanned

## Contributing

When adding new features:
1. Add types to `slide-builder.ts`
2. Update the Zustand store if needed
3. Create components in the slide-builder directory
4. Add AI commands to the command handler
5. Update this documentation

---

This system provides a professional-grade slide creation platform with AI assistance, making it easy for educators to create engaging, accessible, and effective learning content while maintaining full control over design and structure.
