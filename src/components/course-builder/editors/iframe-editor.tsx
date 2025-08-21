"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface IframeEditorProps {
  content: any;
  onChange: (content: any) => void;
}

export function IframeEditor({ content, onChange }: IframeEditorProps) {
  const [src, setSrc] = useState<string>(content?.src || "");
  const [height, setHeight] = useState<number>(content?.height || 400);

  const updateSrc = (value: string) => {
    setSrc(value);
    onChange({ ...content, src: value });
  };

  const updateHeight = (value: number) => {
    setHeight(value);
    onChange({ ...content, height: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="iframe-src">URL</Label>
        <Input
          id="iframe-src"
          value={src}
          onChange={(e) => updateSrc(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="iframe-height">Height (px)</Label>
        <Input
          id="iframe-height"
          type="number"
          value={height}
          onChange={(e) => updateHeight(parseInt(e.target.value) || 400)}
        />
      </div>
      <Card className="p-2">
        {src ? (
          <iframe
            src={src}
            className="w-full border rounded"
            height={height}
            title="Embedded content preview"
          />
        ) : (
          <div className="text-sm text-muted-foreground p-8 text-center">
            Enter a URL to preview
          </div>
        )}
      </Card>
    </div>
  );
}
