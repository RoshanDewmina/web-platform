"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface EmbedComponentProps {
  platform: "twitter" | "instagram" | "codepen" | "codesandbox" | "github";
  id: string;
  height?: number;
  className?: string;
}

export default function EmbedComponent({
  platform,
  id,
  height = 400,
  className,
}: EmbedComponentProps) {
  const getEmbedUrl = () => {
    switch (platform) {
      case "twitter":
        return `https://platform.twitter.com/embed/Tweet.html?id=${id}`;
      case "instagram":
        return `https://www.instagram.com/p/${id}/embed`;
      case "codepen":
        return `https://codepen.io/pen/embed/${id}?default-tab=result`;
      case "codesandbox":
        return `https://codesandbox.io/embed/${id}`;
      case "github":
        // GitHub Gist embed
        return `https://gist.github.com/${id}.pibb`;
      default:
        return "";
    }
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <Card className={cn("my-6 p-4", className)}>
        <p className="text-center text-muted-foreground">
          Unsupported embed platform: {platform}
        </p>
      </Card>
    );
  }

  // Special handling for GitHub Gists
  if (platform === "github") {
    return (
      <div className={cn("my-6", className)}>
        <script src={`https://gist.github.com/${id}.js`}></script>
        <noscript>
          <Card className="p-4">
            <p className="text-center text-muted-foreground">
              <a href={`https://gist.github.com/${id}`} target="_blank" rel="noopener noreferrer">
                View Gist on GitHub
              </a>
            </p>
          </Card>
        </noscript>
      </div>
    );
  }

  return (
    <div className={cn("my-6", className)}>
      <iframe
        src={embedUrl}
        height={height}
        className="w-full rounded-lg border shadow-sm"
        frameBorder="0"
        scrolling="no"
        allowTransparency
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        loading="lazy"
      />
    </div>
  );
}

// Helper component for Twitter embeds with better loading
export function TwitterEmbed({ tweetId }: { tweetId: string }) {
  React.useEffect(() => {
    // Load Twitter widgets script if not already loaded
    if (!(window as any).twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Re-render tweets if script is already loaded
      (window as any).twttr.widgets.load();
    }
  }, []);

  return (
    <div className="my-6">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${tweetId}`}>Loading tweet...</a>
      </blockquote>
    </div>
  );
}

// Helper component for Instagram embeds
export function InstagramEmbed({ postId }: { postId: string }) {
  React.useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Re-process embeds if script is already loaded
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="my-6">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
        data-instgrm-version="14"
      >
        <a href={`https://www.instagram.com/p/${postId}/`}>View on Instagram</a>
      </blockquote>
    </div>
  );
}
