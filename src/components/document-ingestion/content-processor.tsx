"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Layers,
  Image,
  Settings,
  Download,
  Eye,
  Edit3,
  Wand2,
  Copy,
  Check,
  BookOpen,
  Presentation,
} from "lucide-react";
import { ProcessingResult, DocumentSection } from "@/lib/document-processor";
import { GridElement } from "@/types/slide-builder";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ContentProcessorProps {
  result: ProcessingResult;
  onSlidesGenerated?: (slides: GridElement[][]) => void;
  onContentIndexed?: (result: ProcessingResult) => void;
  className?: string;
}

export function ContentProcessor({
  result,
  onSlidesGenerated,
  onContentIndexed,
  className,
}: ContentProcessorProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [processingOptions, setProcessingOptions] = useState({
    generateSlides: true,
    preserveFormatting: true,
    maxSlidesPerSection: 3,
    slideTemplate: "professional",
    includeImages: true,
    addToIndex: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<GridElement[][]>([]);

  const handleSectionToggle = useCallback((sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  const selectAllSections = useCallback(() => {
    setSelectedSections(result.document.sections.map((s) => s.id));
  }, [result.document.sections]);

  const clearSelection = useCallback(() => {
    setSelectedSections([]);
  }, []);

  const generateSlides = useCallback(async () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    setIsGenerating(true);
    try {
      // Filter selected sections
      const sectionsToProcess = result.document.sections.filter((s) =>
        selectedSections.includes(s.id)
      );

      // Generate slides for selected sections
      const slides: GridElement[][] = [];

      // Title slide
      slides.push([
        {
          id: "title-element",
          type: "title",
          x: 1,
          y: 2,
          w: 10,
          h: 2,
          props: {
            text: result.document.title,
            level: 1,
          },
        },
        {
          id: "subtitle-element",
          type: "text",
          x: 1,
          y: 4,
          w: 10,
          h: 1,
          props: {
            text: `${sectionsToProcess.length} sections • ${result.document.metadata.wordCount} words`,
          },
        },
      ]);

      // Content slides
      for (const section of sectionsToProcess) {
        if (section.content.trim()) {
          const contentChunks = chunkContent(section.content, 300);

          for (
            let i = 0;
            i <
            Math.min(
              contentChunks.length,
              processingOptions.maxSlidesPerSection
            );
            i++
          ) {
            const slideElements: GridElement[] = [
              {
                id: `${section.id}-title-${i}`,
                type: "title",
                x: 1,
                y: 1,
                w: 10,
                h: 1,
                props: {
                  text: section.title,
                  level: Math.min(section.level + 1, 6),
                },
              },
              {
                id: `${section.id}-content-${i}`,
                type: "paragraph",
                x: 1,
                y: 3,
                w: 10,
                h: 8,
                props: {
                  text: contentChunks[i],
                },
              },
            ];

            slides.push(slideElements);
          }
        }
      }

      setGeneratedSlides(slides);
      onSlidesGenerated?.(slides);
      toast.success(
        `Generated ${slides.length} slides from ${sectionsToProcess.length} sections`
      );
    } catch (error) {
      toast.error("Failed to generate slides");
      console.error("Slide generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedSections, result, processingOptions, onSlidesGenerated]);

  const indexContent = useCallback(async () => {
    try {
      // This would normally call the semantic search indexing API
      onContentIndexed?.(result);
      toast.success("Content indexed successfully");
    } catch (error) {
      toast.error("Failed to index content");
      console.error("Indexing error:", error);
    }
  }, [result, onContentIndexed]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const chunkContent = (content: string, maxWords: number): string[] => {
    const words = content.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(" "));
    }

    return chunks;
  };

  const getSectionIcon = (section: DocumentSection) => {
    switch (section.type) {
      case "heading":
        return <BookOpen className="h-4 w-4" />;
      case "paragraph":
        return <FileText className="h-4 w-4" />;
      case "list":
        return <Layers className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Document Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{result.document.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{result.document.sections.length} sections</span>
                <span>{result.document.metadata.wordCount} words</span>
                {result.document.metadata.pages && (
                  <span>{result.document.metadata.pages} pages</span>
                )}
                {result.document.metadata.author && (
                  <span>by {result.document.metadata.author}</span>
                )}
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Processing Errors</h4>
                {result.errors.map((error, index) => (
                  <p
                    key={index}
                    className="text-sm text-red-600 bg-red-50 p-2 rounded"
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}

            {result.warnings && result.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-600">Warnings</h4>
                {result.warnings.map((warning, index) => (
                  <p
                    key={index}
                    className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded"
                  >
                    {warning}
                  </p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Processing */}
      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="slides">Generate Slides</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Document Sections
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAllSections}
                  >
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {result.document.sections.map((section) => (
                    <div
                      key={section.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        selectedSections.includes(section.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      )}
                      onClick={() => handleSectionToggle(section.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getSectionIcon(section)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">
                              {section.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              Level {section.level}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {section.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.content.substring(0, 150)}
                            {section.content.length > 150 && "..."}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              {section.content.split(/\s+/).length} words
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(section.content);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="h-5 w-5" />
                Slide Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">
                    {selectedSections.length} sections selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estimated{" "}
                    {selectedSections.length *
                      processingOptions.maxSlidesPerSection +
                      1}{" "}
                    slides
                  </p>
                </div>
                <Button
                  onClick={generateSlides}
                  disabled={isGenerating || selectedSections.length === 0}
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Slides
                    </>
                  )}
                </Button>
              </div>

              {generatedSlides.length > 0 && (
                <div className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Generated Slides ({generatedSlides.length})
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {generatedSlides.map((slide, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Slide {index + 1}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {slide.length} elements
                            </span>
                          </div>
                          <div className="text-sm">
                            {slide.map((element, elemIndex) => (
                              <div key={elemIndex} className="truncate">
                                <span className="font-mono text-xs text-muted-foreground">
                                  {element.type}:
                                </span>{" "}
                                {element.props.text?.substring(0, 60)}
                                {element.props.text?.length > 60 && "..."}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Processing Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="generate-slides">Generate Slides</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create slides from document content
                    </p>
                  </div>
                  <Switch
                    id="generate-slides"
                    checked={processingOptions.generateSlides}
                    onCheckedChange={(checked) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        generateSlides: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="preserve-formatting">
                      Preserve Formatting
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Maintain original text formatting and structure
                    </p>
                  </div>
                  <Switch
                    id="preserve-formatting"
                    checked={processingOptions.preserveFormatting}
                    onCheckedChange={(checked) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        preserveFormatting: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="include-images">Include Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Extract and include images from the document
                    </p>
                  </div>
                  <Switch
                    id="include-images"
                    checked={processingOptions.includeImages}
                    onCheckedChange={(checked) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        includeImages: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="add-to-index">Add to Search Index</Label>
                    <p className="text-sm text-muted-foreground">
                      Index content for semantic search
                    </p>
                  </div>
                  <Switch
                    id="add-to-index"
                    checked={processingOptions.addToIndex}
                    onCheckedChange={(checked) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        addToIndex: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-slides">Max Slides per Section</Label>
                  <Input
                    id="max-slides"
                    type="number"
                    min="1"
                    max="10"
                    value={processingOptions.maxSlidesPerSection}
                    onChange={(e) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        maxSlidesPerSection: parseInt(e.target.value) || 3,
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slide-template">Slide Template</Label>
                  <select
                    id="slide-template"
                    title="Select slide template"
                    aria-label="Slide Template"
                    value={processingOptions.slideTemplate}
                    onChange={(e) =>
                      setProcessingOptions((prev) => ({
                        ...prev,
                        slideTemplate: e.target.value,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="professional">Professional</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Button
                  onClick={indexContent}
                  disabled={!processingOptions.addToIndex}
                  className="flex-1"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Index Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
