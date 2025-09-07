"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAssetUrl } from "@/lib/storage/minio-client";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageWithCaption({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: ImageWithCaptionProps) {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If src is a MinIO key (starts with courses/), get signed URL
    if (src.startsWith("courses/")) {
      getAssetUrl(src)
        .then(setImageUrl)
        .catch((err) => {
          console.error("Failed to load image:", err);
          setError("Failed to load image");
        });
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load image");
  };

  if (error) {
    return (
      <figure className={cn("my-6", className)}>
        <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg">
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        {caption && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={cn("my-6", className)}>
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {isLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        {width && height ? (
          <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-auto",
              isLoading && "invisible"
            )}
          />
        ) : (
          <img
            src={imageUrl}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-auto",
              isLoading && "invisible"
            )}
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
