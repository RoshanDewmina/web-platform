'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Course, Module, Lesson, Slide, ContentBlock } from '@/types/course-builder';
import { Settings, Info, Lock, Eye, Calendar, DollarSign, Users, Tag } from 'lucide-react';

interface PropertiesPanelProps {
  selectedItem: Course | Module | Lesson | Slide | ContentBlock;
  onUpdate: (item: any) => void;
}

export function PropertiesPanel({ selectedItem, onUpdate }: PropertiesPanelProps) {
  const getItemType = (item: any): string => {
    if ('modules' in item) return 'course';
    if ('lessons' in item) return 'module';
    if ('slides' in item) return 'lesson';
    if ('blocks' in item) return 'slide';
    if ('type' in item && 'content' in item) return 'block';
    return 'unknown';
  };

  const itemType = getItemType(selectedItem);

  return (
    <div className='h-full flex flex-col border-l bg-muted/30'>
      <div className='p-4 border-b'>
        <h3 className='font-semibold flex items-center gap-2'>
          <Settings className='h-4 w-4' />
          Properties
        </h3>
        <p className='text-sm text-muted-foreground mt-1'>
          {itemType.charAt(0).toUpperCase() + itemType.slice(1)} Settings
        </p>
      </div>

      <ScrollArea className='flex-1'>
        <div className='p-4'>
          {itemType === 'course' && <CourseProperties item={selectedItem as Course} onUpdate={onUpdate} />}
          {itemType === 'module' && <ModuleProperties item={selectedItem as Module} onUpdate={onUpdate} />}
          {itemType === 'lesson' && <LessonProperties item={selectedItem as Lesson} onUpdate={onUpdate} />}
          {itemType === 'slide' && <SlideProperties item={selectedItem as Slide} onUpdate={onUpdate} />}
          {itemType === 'block' && <BlockProperties item={selectedItem as ContentBlock} onUpdate={onUpdate} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function CourseProperties({ item, onUpdate }: { item: Course; onUpdate: (item: Course) => void }) {
  return (
    <Tabs defaultValue='general' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='general'>General</TabsTrigger>
        <TabsTrigger value='settings'>Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value='general' className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='course-title'>Title</Label>
          <Input
            id='course-title'
            value={item.title}
            onChange={(e) => onUpdate({ ...item, title: e.target.value })}
            placeholder='Course title'
          />
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor='course-description'>Description</Label>
          <Textarea
            id='course-description'
            value={item.description}
            onChange={(e) => onUpdate({ ...item, description: e.target.value })}
            placeholder='Course description'
            rows={4}
          />
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor='course-category'>Category</Label>
          <Input
            id='course-category'
            value={item.metadata.category}
            onChange={(e) => onUpdate({
              ...item,
              metadata: { ...item.metadata, category: e.target.value }
            })}
            placeholder='e.g., Web Development'
          />
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor='course-difficulty'>Difficulty</Label>
          <Select
            value={item.metadata.difficulty}
            onValueChange={(value: any) => onUpdate({
              ...item,
              metadata: { ...item.metadata, difficulty: value }
            })}
          >
            <SelectTrigger id='course-difficulty'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='beginner'>Beginner</SelectItem>
              <SelectItem value='intermediate'>Intermediate</SelectItem>
              <SelectItem value='advanced'>Advanced</SelectItem>
              <SelectItem value='expert'>Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>
      
      <TabsContent value='settings' className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='course-visibility'>Visibility</Label>
          <Select
            value={item.settings.visibility}
            onValueChange={(value: any) => onUpdate({
              ...item,
              settings: { ...item.settings, visibility: value }
            })}
          >
            <SelectTrigger id='course-visibility'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='public'>
                <div className='flex items-center'>
                  <Eye className='h-4 w-4 mr-2' />
                  Public
                </div>
              </SelectItem>
              <SelectItem value='private'>
                <div className='flex items-center'>
                  <Lock className='h-4 w-4 mr-2' />
                  Private
                </div>
              </SelectItem>
              <SelectItem value='restricted'>
                <div className='flex items-center'>
                  <Users className='h-4 w-4 mr-2' />
                  Restricted
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className='space-y-2'>
          <Label htmlFor='enrollment-limit'>Enrollment Limit</Label>
          <Input
            id='enrollment-limit'
            type='number'
            value={item.settings.enrollmentLimit || ''}
            onChange={(e) => onUpdate({
              ...item,
              settings: { ...item.settings, enrollmentLimit: parseInt(e.target.value) || undefined }
            })}
            placeholder='Unlimited'
          />
        </div>
        
        <div className='flex items-center justify-between'>
          <Label htmlFor='course-price'>Price ($)</Label>
          <Input
            id='course-price'
            type='number'
            className='w-24'
            value={item.settings.price || 0}
            onChange={(e) => onUpdate({
              ...item,
              settings: { ...item.settings, price: parseFloat(e.target.value) || 0 }
            })}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function ModuleProperties({ item, onUpdate }: { item: Module; onUpdate: (item: Module) => void }) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='module-title'>Title</Label>
        <Input
          id='module-title'
          value={item.title}
          onChange={(e) => onUpdate({ ...item, title: e.target.value })}
          placeholder='Module title'
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='module-description'>Description</Label>
        <Textarea
          id='module-description'
          value={item.description || ''}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          placeholder='Module description'
          rows={3}
        />
      </div>
      
      <div className='space-y-2'>
        <Label>Unlock Conditions</Label>
        <Select
          value={item.unlockConditions?.type || 'sequential'}
          onValueChange={(value: any) => onUpdate({
            ...item,
            unlockConditions: { type: value }
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='sequential'>Sequential (Complete Previous)</SelectItem>
            <SelectItem value='xp'>XP Requirement</SelectItem>
            <SelectItem value='date'>Date Based</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function LessonProperties({ item, onUpdate }: { item: Lesson; onUpdate: (item: Lesson) => void }) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='lesson-title'>Title</Label>
        <Input
          id='lesson-title'
          value={item.title}
          onChange={(e) => onUpdate({ ...item, title: e.target.value })}
          placeholder='Lesson title'
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='lesson-description'>Description</Label>
        <Textarea
          id='lesson-description'
          value={item.description || ''}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          placeholder='Lesson description'
          rows={3}
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='lesson-duration'>Duration (minutes)</Label>
        <Input
          id='lesson-duration'
          type='number'
          value={item.duration || ''}
          onChange={(e) => onUpdate({ ...item, duration: parseInt(e.target.value) || undefined })}
          placeholder='Estimated duration'
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='lesson-xp'>XP Reward</Label>
        <Input
          id='lesson-xp'
          type='number'
          value={item.xpReward || 10}
          onChange={(e) => onUpdate({ ...item, xpReward: parseInt(e.target.value) || 10 })}
        />
      </div>
      
      <div className='flex items-center justify-between'>
        <Label htmlFor='lesson-locked'>Locked</Label>
        <Switch
          id='lesson-locked'
          checked={item.settings.locked || false}
          onCheckedChange={(checked) => onUpdate({
            ...item,
            settings: { ...item.settings, locked: checked }
          })}
        />
      </div>
    </div>
  );
}

function SlideProperties({ item, onUpdate }: { item: Slide; onUpdate: (item: Slide) => void }) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='slide-title'>Title</Label>
        <Input
          id='slide-title'
          value={item.title}
          onChange={(e) => onUpdate({ ...item, title: e.target.value })}
          placeholder='Slide title'
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='slide-notes'>Speaker Notes</Label>
        <Textarea
          id='slide-notes'
          value={item.notes || ''}
          onChange={(e) => onUpdate({ ...item, notes: e.target.value })}
          placeholder='Notes for instructors...'
          rows={4}
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='slide-template'>Template</Label>
        <Select
          value={item.template || 'blank'}
          onValueChange={(value) => onUpdate({ ...item, template: value })}
        >
          <SelectTrigger id='slide-template'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='blank'>Blank</SelectItem>
            <SelectItem value='title'>Title Slide</SelectItem>
            <SelectItem value='content'>Content Slide</SelectItem>
            <SelectItem value='two-column'>Two Column</SelectItem>
            <SelectItem value='comparison'>Comparison</SelectItem>
            <SelectItem value='quiz'>Quiz Slide</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function BlockProperties({ item, onUpdate }: { item: ContentBlock; onUpdate: (item: ContentBlock) => void }) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm'>Block Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>{item.type}</Badge>
        </CardContent>
      </Card>
      
      <div className='space-y-2'>
        <Label htmlFor='block-width'>Width</Label>
        <Select
          value={item.settings.width || 'full'}
          onValueChange={(value: any) => onUpdate({
            ...item,
            settings: { ...item.settings, width: value }
          })}
        >
          <SelectTrigger id='block-width'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='full'>Full Width</SelectItem>
            <SelectItem value='half'>Half Width</SelectItem>
            <SelectItem value='third'>One Third</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='block-alignment'>Alignment</Label>
        <Select
          value={item.settings.alignment || 'left'}
          onValueChange={(value: any) => onUpdate({
            ...item,
            settings: { ...item.settings, alignment: value }
          })}
        >
          <SelectTrigger id='block-alignment'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='left'>Left</SelectItem>
            <SelectItem value='center'>Center</SelectItem>
            <SelectItem value='right'>Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor='block-padding'>Padding</Label>
        <Select
          value={item.settings.padding || 'normal'}
          onValueChange={(value) => onUpdate({
            ...item,
            settings: { ...item.settings, padding: value }
          })}
        >
          <SelectTrigger id='block-padding'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none'>None</SelectItem>
            <SelectItem value='small'>Small</SelectItem>
            <SelectItem value='normal'>Normal</SelectItem>
            <SelectItem value='large'>Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
