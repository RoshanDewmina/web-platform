"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Upload, Link } from "lucide-react";
import Image from "next/image";

interface ImageComponentProps {
  src?: string;
  alt?: string;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  position?: string;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
  onImageChange?: (src: string, alt: string) => void;
}

export default function ImageComponent({
  src,
  alt = "Image",
  fit = "contain",
  position = "center",
  width,
  height,
  previewMode = false,
  className,
  onImageChange,
}: ImageComponentProps) {
  const [imageUrl, setImageUrl] = useState(src || "");
  const [imageAlt, setImageAlt] = useState(alt);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  const handleUrlSubmit = () => {
    setImageUrl(tempUrl);
    setShowUrlInput(false);
    if (onImageChange) {
      onImageChange(tempUrl, imageAlt);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, this would upload to S3/MinIO
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);
        if (onImageChange) {
          onImageChange(dataUrl, imageAlt);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!imageUrl && !previewMode) {
    return (
      <Card
        className={cn(
          "w-full h-full flex flex-col items-center justify-center p-4 border-dashed",
          className
        )}
        style={{ width, height }}
      >
        <ImageIcon className="h-12 w-12 mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-4">Add an image</p>

        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(true)}
            className="w-full"
          >
            <Link className="h-4 w-4 mr-2" />
            Add from URL
          </Button>

          <label htmlFor="image-upload" className="w-full">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </span>
            </Button>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {showUrlInput && (
          <div className="mt-4 w-full max-w-xs">
            <Input
              placeholder="Enter image URL..."
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit();
                }
              }}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUrlSubmit}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowUrlInput(false);
                  setTempUrl("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  }

  if (!imageUrl) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center bg-muted/50",
          className
        )}
        style={{ width, height }}
      >
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{ width, height }}
    >
      {imageUrl.startsWith("data:") || imageUrl.startsWith("http") ? (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full"
          style={{
            objectFit: fit,
            objectPosition: position,
          }}
        />
      ) : (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          style={{
            objectFit: fit,
            objectPosition: position,
          }}
        />
      )}

      {!previewMode && (
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setImageUrl("");
              if (onImageChange) {
                onImageChange("", "");
              }
            }}
          >
            Change Image
          </Button>
        </div>
      )}
    </div>
  );
}
