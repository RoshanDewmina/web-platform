"use client";

import { ContentBlock } from "@/types/course-builder";
import { RichTextEditor } from "./editors/rich-text-editor";
import { ImageEditor } from "./editors/image-editor";
import { VideoEditor } from "./editors/video-editor";
import { CodeEditor } from "./editors/code-editor";
import { QuizEditor } from "./editors/quiz-editor";
import { CalloutEditor } from "./editors/callout-editor";
import { Separator } from "@/components/ui/separator";
import { AudioEditor } from "./editors/audio-editor";
import { IframeEditor } from "./editors/iframe-editor";
import { FileEditor } from "./editors/file-editor";

interface ContentBlockEditorProps {
  block: ContentBlock;
  onUpdate: (updates: Partial<ContentBlock>) => void;
}

export function ContentBlockEditor({
  block,
  onUpdate,
}: ContentBlockEditorProps) {
  const updateContent = (content: any) => {
    onUpdate({ content });
  };

  switch (block.type) {
    case "text":
      return (
        <RichTextEditor content={block.content} onChange={updateContent} />
      );
    case "image":
      return <ImageEditor content={block.content} onChange={updateContent} />;
    case "video":
      return <VideoEditor content={block.content} onChange={updateContent} />;
    case "code":
      return <CodeEditor content={block.content} onChange={updateContent} />;
    case "audio":
      return <AudioEditor content={block.content} onChange={updateContent} />;
    case "iframe":
      return <IframeEditor content={block.content} onChange={updateContent} />;
    case "file":
      return <FileEditor content={block.content} onChange={updateContent} />;
    case "quiz":
      return <QuizEditor content={block.content} onChange={updateContent} />;
    case "callout":
      return <CalloutEditor content={block.content} onChange={updateContent} />;
    case "divider":
      return <Separator className="my-4" />;
    case "columns":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded">Column 1</div>
          <div className="p-4 border rounded">Column 2</div>
        </div>
      );
    default:
      return (
        <div className="p-4 text-center text-muted-foreground">
          Unsupported block type: {block.type}
        </div>
      );
  }
}
