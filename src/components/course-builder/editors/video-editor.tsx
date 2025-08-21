'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Video, Youtube, Link } from 'lucide-react';
import { useState } from 'react';

interface VideoEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function VideoEditor({ content, onChange }: VideoEditorProps) {
  const [videoUrl, setVideoUrl] = useState(content?.url || '');
  const [provider, setProvider] = useState(content?.provider || 'youtube');

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    onChange({ ...content, url });
    
    // Auto-detect provider
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setProvider('youtube');
      onChange({ ...content, url, provider: 'youtube' });
    } else if (url.includes('vimeo.com')) {
      setProvider('vimeo');
      onChange({ ...content, url, provider: 'vimeo' });
    }
  };

  const getEmbedUrl = () => {
    if (!videoUrl) return '';
    
    if (provider === 'youtube') {
      const videoId = extractYouTubeId(videoUrl);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } else if (provider === 'vimeo') {
      const videoId = extractVimeoId(videoUrl);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
    
    return videoUrl;
  };

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractVimeoId = (url: string) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const embedUrl = getEmbedUrl();

  return (
    <div className='space-y-4'>
      {embedUrl ? (
        <div className='relative aspect-video'>
          <iframe
            src={embedUrl}
            className='w-full h-full rounded-md border'
            allowFullScreen
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          />
        </div>
      ) : (
        <Card className='p-8 border-dashed'>
          <div className='text-center'>
            <Video className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
            <h3 className='text-sm font-medium mb-2'>Add a video</h3>
            <p className='text-xs text-muted-foreground'>
              Paste a YouTube or Vimeo URL below
            </p>
          </div>
        </Card>
      )}

      <div className='space-y-2'>
        <Label htmlFor='video-provider'>Video Provider</Label>
        <Select
          value={provider}
          onValueChange={(value) => {
            setProvider(value);
            onChange({ ...content, provider: value });
          }}
        >
          <SelectTrigger id='video-provider'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='youtube'>
              <div className='flex items-center'>
                <Youtube className='h-4 w-4 mr-2' />
                YouTube
              </div>
            </SelectItem>
            <SelectItem value='vimeo'>Vimeo</SelectItem>
            <SelectItem value='custom'>Custom URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='video-url'>Video URL</Label>
        <Input
          id='video-url'
          value={videoUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder='https://youtube.com/watch?v=...'
        />
      </div>
    </div>
  );
}
