"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  className?: string;
}

export function YouTubeVideo({ 
  videoId, 
  title, 
  aspectRatio = "16:9",
  className 
}: YouTubeVideoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (input: string): string => {
    // Already just an ID
    if (input.length === 11 && !input.includes('/')) {
      return input;
    }
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return input;
  };

  const videoIdClean = extractVideoId(videoId);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoIdClean}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoIdClean}?autoplay=1&rel=0`;

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "1:1": "aspect-square"
  };

  const handlePlay = () => {
    setIsLoading(true);
    setShowVideo(true);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn("relative w-full", aspectRatioClasses[aspectRatio])}>
        {!showVideo ? (
          <>
            {/* Thumbnail with play button overlay */}
            <div 
              className="absolute inset-0 cursor-pointer group"
              onClick={handlePlay}
            >
              <img
                src={thumbnailUrl}
                alt={title || "Video thumbnail"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default quality if maxresdefault doesn't exist
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoIdClean}/hqdefault.jpg`;
                }}
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-4 md:p-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="h-8 w-8 md:h-12 md:w-12 text-white fill-white" />
                </div>
              </div>
              
              {/* Title overlay */}
              {title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {title}
                  </h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Loading spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            
            {/* YouTube iframe */}
            <iframe
              src={embedUrl}
              title={title || "YouTube video"}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </>
        )}
      </div>
    </Card>
  );
}
