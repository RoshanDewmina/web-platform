'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Link } from 'lucide-react';
import { useState } from 'react';

interface ImageEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function ImageEditor({ content, onChange }: ImageEditorProps) {
  const [imageUrl, setImageUrl] = useState(content?.url || '');
  const [altText, setAltText] = useState(content?.alt || '');

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onChange({ ...content, url });
  };

  const handleAltChange = (alt: string) => {
    setAltText(alt);
    onChange({ ...content, alt });
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload
    console.log('File upload not yet implemented');
  };

  return (
    <div className='space-y-4'>
      {imageUrl ? (
        <div className='relative group'>
          <img
            src={imageUrl}
            alt={altText}
            className='w-full rounded-md border'
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/600/400';
            }}
          />
          <Button
            variant='secondary'
            size='sm'
            className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={() => handleUrlChange('')}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <Card className='p-8 border-dashed'>
          <div className='text-center'>
            <ImageIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-sm font-medium mb-2'>Add an image</h3>
            <div className='flex gap-2 justify-center'>
              <Button variant='outline' size='sm' onClick={handleFileUpload}>
                <Upload className='h-4 w-4 mr-2' />
                Upload
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  const url = window.prompt('Enter image URL:');
                  if (url) handleUrlChange(url);
                }}
              >
                <Link className='h-4 w-4 mr-2' />
                From URL
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className='space-y-2'>
        <Label htmlFor='image-url'>Image URL</Label>
        <Input
          id='image-url'
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder='https://example.com/image.jpg'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='alt-text'>Alt Text (for accessibility)</Label>
        <Input
          id='alt-text'
          value={altText}
          onChange={(e) => handleAltChange(e.target.value)}
          placeholder='Describe the image...'
        />
      </div>
    </div>
  );
}
