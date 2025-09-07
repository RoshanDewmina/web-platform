"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { getAssetUrl } from "@/lib/storage/minio-client";

interface VideoProps {
  provider: "youtube" | "vimeo" | "minio" | "external";
  videoId: string;
  url?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
}

export default function Video({
  provider = "youtube",
  videoId,
  url,
  title,
  autoplay = false,
  controls = true,
  poster,
  className,
}: VideoProps) {
  const [hasStarted, setHasStarted] = useState(autoplay);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // Load poster image from MinIO if needed
  React.useEffect(() => {
    if (poster && poster.startsWith("courses/")) {
      getAssetUrl(poster).then(setPosterUrl);
    } else if (poster) {
      setPosterUrl(poster);
    }
  }, [poster]);

  const renderVideo = () => {
    switch (provider) {
      case "youtube":
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        );

      case "vimeo":
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}${autoplay ? "?autoplay=1" : ""}`}
            title={title || "Vimeo video"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        );

      case "minio":
        return (
          <MinIOVideo
            videoKey={videoId}
            title={title}
            autoplay={autoplay}
            controls={controls}
            poster={posterUrl}
          />
        );

      case "external":
        return (
          <video
            src={url}
            title={title}
            autoPlay={autoplay}
            controls={controls}
            poster={posterUrl || undefined}
            className="absolute inset-0 w-full h-full object-contain"
          />
        );

      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">Unsupported video provider</p>
          </div>
        );
    }
  };

  // Show poster with play button for non-autoplay videos
  if (!hasStarted && posterUrl && !autoplay) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg shadow-lg my-6", className)}>
        <img
          src={posterUrl}
          alt={title || "Video thumbnail"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <button
          onClick={() => setHasStarted(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          aria-label="Play video"
        >
          <div className="rounded-full bg-white/90 p-4 shadow-lg">
            <Play className="h-8 w-8 text-black fill-black" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg shadow-lg my-6", className)}>
      {renderVideo()}
    </div>
  );
}

// MinIO video component with signed URL handling
function MinIOVideo({
  videoKey,
  title,
  autoplay,
  controls,
  poster,
}: {
  videoKey: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  poster?: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    getAssetUrl(videoKey, { expiry: 7200 }) // 2 hour expiry for videos
      .then(setVideoUrl)
      .catch((err) => {
        console.error("Failed to load video:", err);
        setError("Failed to load video");
      });
  }, [videoKey]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      title={title}
      autoPlay={autoplay}
      controls={controls}
      poster={poster || undefined}
      className="absolute inset-0 w-full h-full object-contain bg-black"
    />
  );
}
