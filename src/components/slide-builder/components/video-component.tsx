"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";

interface VideoComponentProps {
  src?: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
}

export default function VideoComponent({
  src,
  poster,
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
  width,
  height,
  previewMode = false,
  className,
}: VideoComponentProps) {
  if (!src) {
    return (
      <Card
        className={cn(
          "w-full h-full flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <Video className="h-12 w-12 text-muted-foreground" />
        <p className="ml-2 text-sm text-muted-foreground">No video selected</p>
      </Card>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoplay && previewMode}
      controls={controls}
      loop={loop}
      muted={muted}
      className={cn("w-full h-full object-contain", className)}
      style={{ width, height }}
    />
  );
}
