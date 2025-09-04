# Adding Media to Course Content

## Overview

The course system supports two types of media: images and YouTube videos. Media is added to slides through the `media` property in the slide data.

## Media Structure

```typescript
media?: {
  type: 'image' | 'youtube';
  src: string; // Image path or YouTube URL/ID
  alt?: string;
  caption?: string;
};
```

## Adding Images

1. Place image files in: `/public/course-assets/renewable-energy-ontario/images/`
2. Reference in slide data:

```typescript
{
  id: "slide-1",
  title: "Your Slide Title",
  content: "Your markdown content",
  media: {
    type: 'image',
    src: '/course-assets/renewable-energy-ontario/images/your-image.png',
    alt: 'Description of the image',
    caption: 'Optional caption text'
  },
  type: 'content'
}
```

### Image Best Practices
- Use descriptive filenames
- Optimize images for web (compress before uploading)
- Preferred formats: PNG for diagrams, JPG for photos
- Maximum width: 1200px for full-width images
- Always include meaningful alt text

## Adding YouTube Videos

1. Get the YouTube video ID from the URL
   - From: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Extract: `dQw4w9WgXcQ`

2. Add to slide data:

```typescript
{
  id: "slide-8",
  title: "Video Title",
  content: "Your markdown content",
  media: {
    type: 'youtube',
    src: 'dQw4w9WgXcQ', // Just the video ID
    alt: 'Video description'
  },
  type: 'video'
}
```

### Video Best Practices
- Ensure videos have closed captions
- Keep videos under 10 minutes when possible
- Use descriptive alt text
- Test video availability in your region

## Example Slide with Media

```typescript
{
  id: "slide-example",
  title: "Renewable Energy Benefits",
  content: `
## Key Benefits

- Clean energy production
- Reduced carbon emissions
- Energy independence
- Economic opportunities
  `,
  media: {
    type: 'image',
    src: '/course-assets/renewable-energy-ontario/images/solar-panels.jpg',
    alt: 'Solar panels on community building',
    caption: 'Community solar installation providing clean energy'
  },
  type: 'content'
}
```

## Responsive Design

All media components are automatically responsive:
- Images scale to fit container width
- Videos maintain 16:9 aspect ratio
- Proper sizing on mobile devices
- Touch-friendly video controls

## Troubleshooting

### Images not showing:
- Check file path is correct
- Ensure image is in public folder
- Verify file extension matches

### Videos not playing:
- Confirm video ID is correct
- Check if video is publicly available
- Ensure no regional restrictions
