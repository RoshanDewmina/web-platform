"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, ImageIcon } from "lucide-react";

interface CourseImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  priority?: boolean;
  className?: string;
}

export function CourseImage({ 
  src, 
  alt, 
  caption,
  aspectRatio = "auto",
  priority = false,
  className 
}: CourseImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "1:1": "aspect-square",
    "auto": ""
  };

  // Determine if it's a local or external image
  const isLocalImage = src.startsWith('/');
  const imageSrc = isLocalImage ? src : src;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn(
        "relative w-full",
        aspectRatio !== "auto" && aspectRatioClasses[aspectRatio],
        aspectRatio === "auto" && "min-h-[200px]"
      )}>
        {/* Loading state */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}

        {/* Error state */}
        {hasError && (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-800 min-h-[200px]">
            <ImageIcon className="h-12 w-12 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Failed to load image
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {alt}
            </p>
          </div>
        )}

        {/* Image */}
        {!hasError && (
          <>
            {isLocalImage ? (
              <Image
                src={imageSrc}
                alt={alt}
                fill={aspectRatio !== "auto"}
                width={aspectRatio === "auto" ? 1200 : undefined}
                height={aspectRatio === "auto" ? 800 : undefined}
                className={cn(
                  "object-contain",
                  aspectRatio === "auto" && "w-full h-auto"
                )}
                priority={priority}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            ) : (
              <img
                src={imageSrc}
                alt={alt}
                className={cn(
                  "w-full h-full object-contain",
                  aspectRatio === "auto" && "h-auto"
                )}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Caption */}
      {caption && !hasError && (
        <div className="p-3 border-t bg-slate-50 dark:bg-slate-900">
          <p className="text-sm text-center text-slate-600 dark:text-slate-400">
            {caption}
          </p>
        </div>
      )}
    </Card>
  );
}
