"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, Volume2 } from "lucide-react";

interface AudioEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function AudioEditor({ content, onChange }: AudioEditorProps) {
  const [url, setUrl] = useState<string>(content?.url || "");
  const [title, setTitle] = useState<string>(content?.title || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onChange({ ...content, url: value });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onChange({ ...content, title: value });
  };

  const handleFileUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const key = `audio/${Date.now()}-${encodeURIComponent(file.name)}`;
      const presignRes = await fetch("/api/storage/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, contentType: file.type }),
      });
      if (!presignRes.ok) throw new Error("Failed to presign");
      const {
        url: signedUrl,
        bucket,
        key: objectKey,
      } = await presignRes.json();

      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const publicUrl = `${
        process.env.NEXT_PUBLIC_S3_PUBLIC_BASE ?? ""
      }/${bucket}/${objectKey}`.replace(/\/$/, "");
      const finalUrl = publicUrl || `${objectKey}`;
      handleUrlChange(finalUrl);
    } catch (err) {
      console.error("Audio upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-2">
          <audio controls className="w-full">
            <source src={url} />
          </audio>
        </div>
      ) : (
        <Card className="p-8 border-dashed">
          <div className="text-center">
            <Volume2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-sm font-medium mb-2">Add an audio file</h3>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFileUploadClick}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const value = window.prompt("Enter audio URL:");
                  if (value) handleUrlChange(value);
                }}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                From URL
              </Button>
            </div>
          </div>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileSelected}
        aria-label="Upload audio file"
        title="Upload audio file"
      />

      <div className="space-y-2">
        <Label htmlFor="audio-url">Audio URL</Label>
        <Input
          id="audio-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audio-title">Title</Label>
        <Input
          id="audio-title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Optional title"
        />
      </div>
    </div>
  );
}
