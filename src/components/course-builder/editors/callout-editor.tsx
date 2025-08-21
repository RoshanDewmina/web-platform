'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface CalloutEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const calloutTypes = [
  { value: 'info', label: 'Info', icon: Info, className: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, className: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' },
  { value: 'error', label: 'Error', icon: AlertCircle, className: 'border-red-500 bg-red-50 dark:bg-red-950/20' },
  { value: 'success', label: 'Success', icon: CheckCircle, className: 'border-green-500 bg-green-50 dark:bg-green-950/20' },
];

export function CalloutEditor({ content, onChange }: CalloutEditorProps) {
  const [type, setType] = useState(content?.type || 'info');
  const [text, setText] = useState(content?.content || '');

  const handleTypeChange = (newType: string) => {
    setType(newType);
    onChange({ ...content, type: newType });
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    onChange({ ...content, content: newText });
  };

  const currentType = calloutTypes.find((t) => t.value === type) || calloutTypes[0];
  const Icon = currentType.icon;

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='callout-type'>Callout Type</Label>
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger id='callout-type'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {calloutTypes.map((calloutType) => (
              <SelectItem key={calloutType.value} value={calloutType.value}>
                <div className='flex items-center'>
                  <calloutType.icon className='h-4 w-4 mr-2' />
                  {calloutType.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='callout-content'>Content</Label>
        <Textarea
          id='callout-content'
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder='Enter callout message...'
          rows={3}
        />
      </div>

      <div className='space-y-2'>
        <Label>Preview</Label>
        <Alert className={`${currentType.className} border-l-4`}>
          <Icon className='h-4 w-4' />
          <AlertDescription>{text || 'Enter callout content above...'}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
