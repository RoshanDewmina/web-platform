"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Wand2,
  Lightbulb,
  Palette,
  Workflow,
  MessageSquare,
  Sparkles,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  FileText,
  Image,
  Code,
  BookOpen,
  Layers,
} from "lucide-react";
import { GridElement } from "@/types/slide-builder";
import { aiAssistant, AIResponse, AISuggestion } from "@/lib/ai-assistant";
import {
  aiContentGenerator,
  GenerationRequest,
  GenerationResult,
} from "@/lib/ai-content-generator";
import { smartSuggestions, SuggestionContext } from "@/lib/ai-suggestions";
import { aiAutoFormatter, FormattingResult } from "@/lib/ai-auto-formatter";
import {
  aiWorkflows,
  Workflow as AIWorkflow,
  WorkflowExecution,
} from "@/lib/ai-workflows";
import { toast } from "sonner";

export default function TestAIFeaturesPage() {
  // AI Assistant state
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; type: "user" | "ai"; content: string; timestamp: Date }>
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Content Generation state
  const [generationRequest, setGenerationRequest] = useState<
    Partial<GenerationRequest>
  >({
    type: "slide",
    context: { topic: "AI in Education" },
    options: {
      tone: "formal",
      length: "moderate",
      audience: "general",
      purpose: "inform",
    },
  });
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);

  // Smart Suggestions state
  const [testSlide, setTestSlide] = useState<GridElement[]>([
    {
      id: "test-title",
      type: "title",
      x: 1,
      y: 1,
      w: 10,
      h: 1,
      props: { text: "Sample Slide Title", level: 1 },
    },
    {
      id: "test-content",
      type: "paragraph",
      x: 1,
      y: 3,
      w: 10,
      h: 4,
      props: {
        text: "This is a sample paragraph with some content that might need improvement. It contains multiple sentences and could benefit from better formatting and structure.",
      },
    },
  ]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  // Auto Formatting state
  const [formattingResult, setFormattingResult] =
    useState<FormattingResult | null>(null);

  // Workflows state
  const [availableWorkflows, setAvailableWorkflows] = useState<AIWorkflow[]>(
    []
  );
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("");
  const [workflowExecution, setWorkflowExecution] =
    useState<WorkflowExecution | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    totalInteractions: 0,
    contentGenerated: 0,
    suggestionsApplied: 0,
    workflowsExecuted: 0,
  });

  useEffect(() => {
    // Initialize workflows
    setAvailableWorkflows(aiWorkflows.getWorkflows());
  }, []);

  // AI Assistant functions
  const sendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      type: "user" as const,
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsProcessing(true);

    try {
      const response = await aiAssistant.processMessage(currentMessage, {
        currentSlide: testSlide,
        allSlides: [testSlide],
      });

      const aiMessage = {
        id: `msg-${Date.now()}-ai`,
        type: "ai" as const,
        content: response.message,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, aiMessage]);
      setStats((prev) => ({
        ...prev,
        totalInteractions: prev.totalInteractions + 1,
      }));
    } catch (error) {
      toast.error("Failed to get AI response");
    } finally {
      setIsProcessing(false);
    }
  };

  // Content Generation functions
  const generateContent = async () => {
    try {
      const result = await aiContentGenerator.generateContent(
        generationRequest as GenerationRequest
      );
      setGenerationResult(result);
      setStats((prev) => ({
        ...prev,
        contentGenerated: prev.contentGenerated + 1,
      }));
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content");
    }
  };

  // Smart Suggestions functions
  const generateSuggestions = () => {
    const context: SuggestionContext = {
      currentSlide: testSlide,
      allSlides: [testSlide],
    };

    const newSuggestions = smartSuggestions.generateSuggestions(context);
    setSuggestions(newSuggestions);
    toast.success(`Generated ${newSuggestions.length} suggestions`);
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    // Mock application of suggestion
    toast.success(`Applied suggestion: ${suggestion.title}`);
    setStats((prev) => ({
      ...prev,
      suggestionsApplied: prev.suggestionsApplied + 1,
    }));
  };

  // Auto Formatting functions
  const formatSlide = () => {
    const result = aiAutoFormatter.formatSlide(testSlide);
    setFormattingResult(result);
    toast.success(
      `Formatted slide: ${result.elementsModified} elements modified`
    );
  };

  // Workflow functions
  const executeWorkflow = async () => {
    if (!selectedWorkflow) {
      toast.error("Please select a workflow");
      return;
    }

    try {
      const execution = await aiWorkflows.executeWorkflow(selectedWorkflow, {
        slides: [testSlide],
        currentSlideIndex: 0,
        theme: "professional",
        presentationGoal: "Educational presentation about AI",
        targetAudience: "Students",
      });

      setWorkflowExecution(execution);
      setStats((prev) => ({
        ...prev,
        workflowsExecuted: prev.workflowsExecuted + 1,
      }));
      toast.success(`Workflow executed: ${execution.status}`);
    } catch (error) {
      toast.error("Failed to execute workflow");
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    toast.info("Chat cleared");
  };

  const resetStats = () => {
    setStats({
      totalInteractions: 0,
      contentGenerated: 0,
      suggestionsApplied: 0,
      workflowsExecuted: 0,
    });
    toast.info("Statistics reset");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Advanced AI Features</h1>
                  <p className="text-muted-foreground">
                    Test and explore AI-powered content creation and
                    optimization
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Phase 6
              </Badge>
              <Badge variant="default" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Dashboard */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Features Statistics
              </CardTitle>
              <Button size="sm" variant="outline" onClick={resetStats}>
                Reset Stats
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalInteractions}
                </div>
                <div className="text-sm text-muted-foreground">
                  AI Interactions
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {stats.contentGenerated}
                </div>
                <div className="text-sm text-muted-foreground">
                  Content Generated
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {stats.suggestionsApplied}
                </div>
                <div className="text-sm text-muted-foreground">
                  Suggestions Applied
                </div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-500">
                  {stats.workflowsExecuted}
                </div>
                <div className="text-sm text-muted-foreground">
                  Workflows Executed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="assistant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Assistant
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generation
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="formatting" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Formatting
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflows
            </TabsTrigger>
          </TabsList>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat Interface */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      AI Assistant Chat
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={clearChat}>
                      Clear Chat
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-64 border rounded-lg p-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                        <p>Start a conversation with the AI assistant</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.type === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.type === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask the AI assistant anything..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isProcessing || !currentMessage.trim()}
                    >
                      {isProcessing ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() =>
                      setCurrentMessage("Help me improve this slide's title")
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Improve slide title
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() =>
                      setCurrentMessage(
                        "Suggest a better layout for this content"
                      )
                    }
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Suggest layout improvements
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() =>
                      setCurrentMessage("Generate bullet points for this topic")
                    }
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate bullet points
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() =>
                      setCurrentMessage(
                        "What colors would work best for this presentation?"
                      )
                    }
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Color suggestions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Generation Tab */}
          <TabsContent value="generation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generation Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Content Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="generation-type">Generation Type</Label>
                    <Select
                      value={generationRequest.type}
                      onValueChange={(value) =>
                        setGenerationRequest((prev) => ({
                          ...prev,
                          type: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slide">Single Slide</SelectItem>
                        <SelectItem value="presentation">
                          Full Presentation
                        </SelectItem>
                        <SelectItem value="section">Section</SelectItem>
                        <SelectItem value="element">Element</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={generationRequest.context?.topic || ""}
                      onChange={(e) =>
                        setGenerationRequest((prev) => ({
                          ...prev,
                          context: { ...prev.context, topic: e.target.value },
                        }))
                      }
                      placeholder="Enter presentation topic..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select
                      value={generationRequest.options?.audience}
                      onValueChange={(value) =>
                        setGenerationRequest((prev) => ({
                          ...prev,
                          options: {
                            tone: prev.options?.tone || "formal",
                            length: prev.options?.length || "moderate",
                            purpose: prev.options?.purpose || "inform",
                            audience: value as any,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="students">Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={generationRequest.options?.tone}
                      onValueChange={(value) =>
                        setGenerationRequest((prev) => ({
                          ...prev,
                          options: {
                            audience: prev.options?.audience || "general",
                            length: prev.options?.length || "moderate",
                            purpose: prev.options?.purpose || "inform",
                            tone: value as any,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={generateContent} className="w-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Content
                  </Button>
                </CardContent>
              </Card>

              {/* Generation Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generationResult ? (
                    <div className="space-y-4">
                      {generationResult.success ? (
                        <>
                          {generationResult.content && (
                            <div className="space-y-3">
                              {generationResult.content.title && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Title
                                  </Label>
                                  <p className="text-lg font-semibold">
                                    {generationResult.content.title}
                                  </p>
                                </div>
                              )}

                              {generationResult.content.paragraphs && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Content
                                  </Label>
                                  {generationResult.content.paragraphs.map(
                                    (paragraph, index) => (
                                      <p key={index} className="text-sm mt-2">
                                        {paragraph}
                                      </p>
                                    )
                                  )}
                                </div>
                              )}

                              {generationResult.content.bulletPoints && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Key Points
                                  </Label>
                                  <ul className="list-disc list-inside mt-2 space-y-1">
                                    {generationResult.content.bulletPoints.map(
                                      (point, index) => (
                                        <li key={index} className="text-sm">
                                          {point}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {generationResult.metadata && (
                            <div className="text-xs text-muted-foreground">
                              Generated{" "}
                              {generationResult.metadata.wordsGenerated} words
                              in {generationResult.metadata.processingTime}ms
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center text-red-500">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>Generation failed: {generationResult.error}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Wand2 className="h-8 w-8 mx-auto mb-2" />
                      <p>Generate content to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Smart Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Test Slide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Test Slide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="space-y-3">
                      {testSlide.map((element) => (
                        <div
                          key={element.id}
                          className="p-2 border rounded bg-background"
                        >
                          <div className="text-xs text-muted-foreground mb-1">
                            {element.type} ({element.x}, {element.y}) -{" "}
                            {element.w}x{element.h}
                          </div>
                          <div className="text-sm">{element.props.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={generateSuggestions} className="w-full">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate Suggestions
                  </Button>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Smart Suggestions ({suggestions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    {suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {suggestion.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {suggestion.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.type}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {Math.round(suggestion.confidence * 100)}%
                                    confidence
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => applySuggestion(suggestion)}
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                        <p>Generate suggestions to see them here</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Auto Formatting Tab */}
          <TabsContent value="formatting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formatting Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Auto Formatting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Test automatic formatting on the sample slide. The formatter
                    will analyze and improve:
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Typography and font sizes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Element positioning and spacing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Color contrast and accessibility
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Visual hierarchy and alignment
                      </span>
                    </div>
                  </div>

                  <Button onClick={formatSlide} className="w-full">
                    <Palette className="h-4 w-4 mr-2" />
                    Format Slide
                  </Button>
                </CardContent>
              </Card>

              {/* Formatting Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Formatting Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formattingResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {formattingResult.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {formattingResult.success
                            ? "Formatting Successful"
                            : "Formatting Failed"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {formattingResult.elementsModified}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Elements Modified
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {formattingResult.changes.length}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Changes Made
                          </div>
                        </div>
                      </div>

                      {formattingResult.changes.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">
                            Changes Applied
                          </Label>
                          <ScrollArea className="h-32 mt-2">
                            <div className="space-y-2">
                              {formattingResult.changes.map((change, index) => (
                                <div
                                  key={index}
                                  className="text-xs p-2 bg-muted rounded"
                                >
                                  <div className="font-medium">
                                    {change.property}
                                  </div>
                                  <div className="text-muted-foreground">
                                    {change.reason}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Palette className="h-8 w-8 mx-auto mb-2" />
                      <p>Format the slide to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workflow Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    AI Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="workflow-select">Select Workflow</Label>
                    <Select
                      value={selectedWorkflow}
                      onValueChange={setSelectedWorkflow}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a workflow..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkflows.map((workflow) => (
                          <SelectItem key={workflow.id} value={workflow.id}>
                            {workflow.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedWorkflow && (
                    <div className="space-y-3">
                      {(() => {
                        const workflow = availableWorkflows.find(
                          (w) => w.id === selectedWorkflow
                        );
                        return workflow ? (
                          <>
                            <div>
                              <Label className="text-sm font-medium">
                                Description
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                {workflow.description}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Steps ({workflow.steps.length})
                              </Label>
                              <div className="space-y-1 mt-1">
                                {workflow.steps.map((step, index) => (
                                  <div
                                    key={step.id}
                                    className="text-xs p-2 bg-muted rounded"
                                  >
                                    {index + 1}. {step.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                ⏱️ ~{workflow.metadata?.estimatedTime}s
                              </span>
                              <span>📊 {workflow.metadata?.complexity}</span>
                              <Badge variant="outline">
                                {workflow.category}
                              </Badge>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  <Button
                    onClick={executeWorkflow}
                    disabled={!selectedWorkflow}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Execute Workflow
                  </Button>
                </CardContent>
              </Card>

              {/* Workflow Execution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Execution Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workflowExecution ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {workflowExecution.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : workflowExecution.status === "failed" ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                        <span className="font-medium capitalize">
                          {workflowExecution.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Progress</Label>
                        <div className="space-y-1">
                          {workflowExecution.steps.map((step, index) => (
                            <div
                              key={step.stepId}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  step.status === "completed"
                                    ? "bg-green-500"
                                    : step.status === "running"
                                    ? "bg-blue-500"
                                    : step.status === "failed"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <span>
                                Step {index + 1}: {step.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {workflowExecution.results && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">
                              {workflowExecution.results.metadata
                                ?.elementsCreated || 0}
                            </div>
                            <div className="text-muted-foreground">Created</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold">
                              {workflowExecution.results.metadata
                                ?.elementsModified || 0}
                            </div>
                            <div className="text-muted-foreground">
                              Modified
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Workflow className="h-8 w-8 mx-auto mb-2" />
                      <p>Execute a workflow to see status here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
