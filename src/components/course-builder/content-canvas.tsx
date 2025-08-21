'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Type,
  Image,
  Video,
  Code,
  FileText,
  Layout,
  Columns,
  AlertCircle,
  Minus,
  GripVertical,
  Trash,
  Copy,
  Settings,
} from 'lucide-react';
import { Slide, ContentBlock, ContentBlockType } from '@/types/course-builder';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ContentBlockEditor } from './content-block-editor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';

interface ContentCanvasProps {
  slide: Slide | null;
  selectedBlock: ContentBlock | null;
  onSelectBlock: (block: ContentBlock | null) => void;
  onUpdateSlide: (slide: Slide) => void;
}

const contentBlockTypes: { type: ContentBlockType; label: string; icon: any }[] = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'video', label: 'Video', icon: Video },
  { type: 'code', label: 'Code', icon: Code },
  { type: 'quiz', label: 'Quiz', icon: FileText },
  { type: 'columns', label: 'Columns', icon: Columns },
  { type: 'callout', label: 'Callout', icon: AlertCircle },
  { type: 'divider', label: 'Divider', icon: Minus },
];

export function ContentCanvas({
  slide,
  selectedBlock,
  onSelectBlock,
  onUpdateSlide,
}: ContentCanvasProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && slide) {
      const oldIndex = slide.blocks.findIndex((block) => block.id === active.id);
      const newIndex = slide.blocks.findIndex((block) => block.id === over?.id);

      const newBlocks = arrayMove(slide.blocks, oldIndex, newIndex).map(
        (block, index) => ({ ...block, order: index })
      );

      onUpdateSlide({
        ...slide,
        blocks: newBlocks,
      });
    }
  };

  const addContentBlock = (type: ContentBlockType) => {
    if (!slide) return;

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      settings: {
        width: 'full',
        alignment: 'left',
      },
      order: slide.blocks.length,
    };

    onUpdateSlide({
      ...slide,
      blocks: [...slide.blocks, newBlock],
    });
    onSelectBlock(newBlock);
  };

  const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    if (!slide) return;

    const updatedBlocks = slide.blocks.map((block) =>
      block.id === blockId ? { ...block, ...updates } : block
    );

    onUpdateSlide({
      ...slide,
      blocks: updatedBlocks,
    });
  };

  const deleteBlock = (blockId: string) => {
    if (!slide) return;

    const updatedBlocks = slide.blocks
      .filter((block) => block.id !== blockId)
      .map((block, index) => ({ ...block, order: index }));

    onUpdateSlide({
      ...slide,
      blocks: updatedBlocks,
    });

    if (selectedBlock?.id === blockId) {
      onSelectBlock(null);
    }
  };

  const duplicateBlock = (blockId: string) => {
    if (!slide) return;

    const blockToDuplicate = slide.blocks.find((block) => block.id === blockId);
    if (!blockToDuplicate) return;

    const newBlock: ContentBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}`,
      order: slide.blocks.length,
    };

    onUpdateSlide({
      ...slide,
      blocks: [...slide.blocks, newBlock],
    });
  };

  if (!slide) {
    return (
      <div className='h-full flex items-center justify-center bg-muted/10'>
        <div className='text-center'>
          <Layout className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
          <h3 className='text-lg font-medium text-muted-foreground'>
            No slide selected
          </h3>
          <p className='text-sm text-muted-foreground mt-2'>
            Select a slide from the outline to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* Canvas Header */}
      <div className='border-b px-4 py-2'>
        <div className='flex items-center justify-between'>
          <h3 className='font-medium'>{slide.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='sm'>
                <Plus className='h-4 w-4 mr-2' />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuLabel>Content Blocks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {contentBlockTypes.map((item) => (
                <DropdownMenuItem
                  key={item.type}
                  onClick={() => addContentBlock(item.type)}
                >
                  <item.icon className='h-4 w-4 mr-2' />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas Content */}
      <ScrollArea className='flex-1'>
        <div className='p-8 max-w-4xl mx-auto'>
          {slide.blocks.length === 0 ? (
            <Card className='p-12 border-dashed'>
              <div className='text-center'>
                <Plus className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
                <h3 className='text-lg font-medium text-muted-foreground'>
                  Add your first content block
                </h3>
                <p className='text-sm text-muted-foreground mt-2 mb-4'>
                  Click the "Add Block" button to get started
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Block
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-48'>
                    {contentBlockTypes.map((item) => (
                      <DropdownMenuItem
                        key={item.type}
                        onClick={() => addContentBlock(item.type)}
                      >
                        <item.icon className='h-4 w-4 mr-2' />
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slide.blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-4'>
                  {slide.blocks.map((block) => (
                    <SortableItem key={block.id} id={block.id}>
                      <div
                        className={cn(
                          'group relative rounded-lg border transition-all',
                          selectedBlock?.id === block.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50',
                          hoveredBlock === block.id && 'shadow-md'
                        )}
                        onClick={() => onSelectBlock(block)}
                        onMouseEnter={() => setHoveredBlock(block.id)}
                        onMouseLeave={() => setHoveredBlock(null)}
                      >
                        {/* Block Toolbar */}
                        <div
                          className={cn(
                            'absolute -top-10 right-0 flex items-center gap-1 bg-background border rounded-md p-1 opacity-0 transition-opacity',
                            (hoveredBlock === block.id ||
                              selectedBlock?.id === block.id) &&
                              'opacity-100'
                          )}
                        >
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 cursor-move'
                          >
                            <GripVertical className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7'
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateBlock(block.id);
                            }}
                          >
                            <Copy className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7'
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlock(block.id);
                            }}
                          >
                            <Trash className='h-3 w-3' />
                          </Button>
                        </div>

                        {/* Block Content */}
                        <div className='p-4'>
                          <ContentBlockEditor
                            block={block}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                          />
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function getDefaultContent(type: ContentBlockType): any {
  switch (type) {
    case 'text':
      return { text: 'Enter your text here...' };
    case 'image':
      return { url: '', alt: '' };
    case 'video':
      return { url: '', provider: 'youtube' };
    case 'code':
      return { code: '', language: 'javascript' };
    case 'quiz':
      return { questions: [] };
    case 'columns':
      return { columns: 2, content: [] };
    case 'callout':
      return { type: 'info', content: '' };
    case 'divider':
      return { style: 'solid' };
    default:
      return {};
  }
}
