"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, File } from "lucide-react";

interface FileEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function FileEditor({ content, onChange }: FileEditorProps) {
  const [url, setUrl] = useState<string>(content?.url || "");
  const [fileName, setFileName] = useState<string>(content?.fileName || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    onChange({ ...content, url: value });
  };

  const handleFileNameChange = (value: string) => {
    setFileName(value);
    onChange({ ...content, fileName: value });
  };

  const handleFileUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const key = `files/${Date.now()}-${encodeURIComponent(file.name)}`;
      const presignRes = await fetch("/api/storage/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          contentType: file.type || "application/octet-stream",
        }),
      });
      if (!presignRes.ok) throw new Error("Failed to presign");
      const {
        url: signedUrl,
        bucket,
        key: objectKey,
      } = await presignRes.json();

      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      const publicBase = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE ?? "";
      const publicUrl = publicBase
        ? `${publicBase}/${bucket}/${objectKey}`
        : objectKey;
      handleUrlChange(publicUrl);
      handleFileNameChange(file.name);
    } catch (err) {
      console.error("File upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <File className="h-5 w-5 text-muted-foreground" />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              {fileName || url}
            </a>
          </div>
        </Card>
      ) : (
        <Card className="p-8 border-dashed">
          <div className="text-center">
            <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-sm font-medium mb-2">Upload a file</h3>
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
                  const value = window.prompt("Enter file URL:");
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
        className="hidden"
        onChange={handleFileSelected}
        aria-label="Upload file"
        title="Upload file"
      />

      <div className="space-y-2">
        <Label htmlFor="file-url">File URL</Label>
        <Input
          id="file-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-name">File Name</Label>
        <Input
          id="file-name"
          value={fileName}
          onChange={(e) => handleFileNameChange(e.target.value)}
          placeholder="Optional display name"
        />
      </div>
    </div>
  );
}
