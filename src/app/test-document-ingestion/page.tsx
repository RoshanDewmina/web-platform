"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Upload,
  Settings,
  BarChart3,
  Zap,
  BookOpen,
  Layers,
  Image,
  Presentation,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { FileUpload } from "@/components/document-ingestion/file-upload";
import { ContentProcessor } from "@/components/document-ingestion/content-processor";
import { ProcessingResult } from "@/lib/document-processor";
import { GridElement } from "@/types/slide-builder";
import { toast } from "sonner";

export default function TestDocumentIngestionPage() {
  const [processingResults, setProcessingResults] = useState<
    ProcessingResult[]
  >([]);
  const [selectedResult, setSelectedResult] = useState<ProcessingResult | null>(
    null
  );
  const [generatedSlides, setGeneratedSlides] = useState<GridElement[][]>([]);
  const [processingStats, setProcessingStats] = useState({
    totalDocuments: 0,
    totalSections: 0,
    totalSlides: 0,
    totalWords: 0,
  });

  const handleProcessingComplete = (result: ProcessingResult) => {
    setProcessingResults((prev) => [...prev, result]);
    setSelectedResult(result);

    // Update stats
    setProcessingStats((prev) => ({
      totalDocuments: prev.totalDocuments + 1,
      totalSections: prev.totalSections + result.document.sections.length,
      totalSlides: prev.totalSlides + (result.slides?.length || 0),
      totalWords: prev.totalWords + result.document.metadata.wordCount,
    }));

    toast.success(`Document processed: ${result.document.title}`);
  };

  const handleSlidesGenerated = (slides: GridElement[][]) => {
    setGeneratedSlides(slides);
    setProcessingStats((prev) => ({
      ...prev,
      totalSlides: prev.totalSlides + slides.length,
    }));
    toast.success(`Generated ${slides.length} slides`);
  };

  const handleContentIndexed = (result: ProcessingResult) => {
    toast.success(`Content indexed: ${result.document.title}`);
  };

  const clearResults = () => {
    setProcessingResults([]);
    setSelectedResult(null);
    setGeneratedSlides([]);
    setProcessingStats({
      totalDocuments: 0,
      totalSections: 0,
      totalSlides: 0,
      totalWords: 0,
    });
    toast.info("Results cleared");
  };

  // Sample documents for demo
  const sampleDocuments = [
    {
      name: "Business Plan Template.md",
      type: "markdown",
      description:
        "A comprehensive business plan template with sections for executive summary, market analysis, and financial projections.",
      sections: 8,
      words: 2500,
    },
    {
      name: "Technical Documentation.pdf",
      type: "pdf",
      description:
        "API documentation with code examples, authentication guides, and best practices.",
      sections: 12,
      words: 4200,
    },
    {
      name: "Meeting Notes.docx",
      type: "docx",
      description:
        "Weekly team meeting notes with action items, decisions, and follow-up tasks.",
      sections: 5,
      words: 800,
    },
    {
      name: "Research Paper.txt",
      type: "text",
      description:
        "Academic research paper on machine learning applications in education.",
      sections: 15,
      words: 6500,
    },
  ];

  const processingFeatures = [
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDF, DOCX, Markdown, and plain text files",
      color: "text-blue-500",
    },
    {
      icon: Brain,
      title: "Smart Content Extraction",
      description: "Intelligent section detection and content parsing",
      color: "text-purple-500",
    },
    {
      icon: Presentation,
      title: "Automatic Slide Generation",
      description: "Convert document sections into presentation slides",
      color: "text-green-500",
    },
    {
      icon: Target,
      title: "Semantic Indexing",
      description: "Index content for AI-powered search and discovery",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Upload className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">
                    Document Ingestion Pipeline
                  </h1>
                  <p className="text-muted-foreground">
                    Import, process, and convert documents into interactive
                    content
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Phase 5
              </Badge>
              <Badge variant="default" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Process
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* File Upload Interface */}
            <FileUpload
              onProcessingComplete={handleProcessingComplete}
              maxFiles={5}
            />

            {/* Processing Statistics */}
            {processingResults.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Processing Statistics
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={clearResults}>
                      Clear Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {processingStats.totalDocuments}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Documents
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">
                        {processingStats.totalSections}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sections
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-500">
                        {processingStats.totalSlides}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Slides
                      </div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">
                        {processingStats.totalWords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Words</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            {selectedResult ? (
              <ContentProcessor
                result={selectedResult}
                onSlidesGenerated={handleSlidesGenerated}
                onContentIndexed={handleContentIndexed}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Document Selected
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Upload and process a document to view content processing
                    options
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Processing Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Processing Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {processingResults.length > 0 ? (
                    <div className="space-y-3">
                      {processingResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedResult === result
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedResult(result)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {result.document.title}
                              </h4>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>
                                  {result.document.sections.length} sections
                                </span>
                                <span>
                                  {result.document.metadata.wordCount} words
                                </span>
                                {result.slides && (
                                  <span>{result.slides.length} slides</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {result.errors && result.errors.length > 0 ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No documents processed yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Processing Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Processing Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {processingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-muted ${feature.color}`}
                        >
                          <feature.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Document Processing Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Sample Documents
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try processing these sample documents to see the system in
                      action
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleDocuments.map((doc, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{doc.name}</h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {doc.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <span>{doc.sections} sections</span>
                                <span>{doc.words} words</span>
                                <Badge variant="outline" className="text-xs">
                                  {doc.type}
                                </Badge>
                              </div>
                              <Button size="sm" className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Process Sample
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <h4 className="font-medium mb-2">Processing Pipeline</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Upload</div>
                        <div className="text-muted-foreground">
                          File validation and upload
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Extract</div>
                        <div className="text-muted-foreground">
                          Content and structure analysis
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <Presentation className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Generate</div>
                        <div className="text-muted-foreground">
                          Slide creation and formatting
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Index</div>
                        <div className="text-muted-foreground">
                          Semantic search integration
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}





