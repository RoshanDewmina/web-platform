"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Wand2,
  FileText,
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import useSlideBuilderStore from "@/stores/slide-builder-store";

interface AIAssistantProps {
  slideId: string;
}

export function AIAssistant({ slideId }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { executeCommand, currentSlide } = useSlideBuilderStore();

  const handleSendMessage = async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Send to AI API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: {
            slideId,
            currentSlide,
          },
        }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();

      // Execute any commands returned by the AI
      if (data.commands && data.commands.length > 0) {
        for (const command of data.commands) {
          await executeCommand(command);
        }
        toast.success("AI commands executed successfully");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      toast.error("Failed to process AI request");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Create from text",
      icon: FileText,
      action: () => setPrompt("Create slides from the following text:\n\n"),
    },
    {
      label: "Add image placeholder",
      icon: Sparkles,
      action: () =>
        executeCommand({
          type: "add_element",
          parameters: {
            slideId,
            type: "image",
            x: 3,
            y: 3,
            w: 6,
            h: 6,
            props: { alt: "Image placeholder" },
          },
        }),
    },
    {
      label: "Apply two-column layout",
      icon: Wand2,
      action: () =>
        executeCommand({
          type: "apply_layout_template",
          parameters: {
            slideId,
            templateId: "two-column",
            preserveContent: true,
          },
        }),
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="chat" className="flex-1">
            Chat
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex-1">
            Quick Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 mb-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card className="p-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-center text-muted-foreground">
                    Ask me to help you create or modify your slides!
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Try:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• "Add a title at the top"</li>
                      <li>• "Create a two-column layout"</li>
                      <li>• "Add an image on the right side"</li>
                      <li>• "Generate quiz questions about..."</li>
                    </ul>
                  </div>
                </Card>
              ) : (
                messages.map((message, index) => (
                  <Card
                    key={index}
                    className={`p-3 ${
                      message.role === "user" ? "ml-4 bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs font-semibold mb-1">
                          {message.role === "user" ? "You" : "AI Assistant"}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-2"
                          onClick={() => handleCopy(message.content, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}

              {loading && (
                <Card className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      AI is thinking...
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>

          <div className="space-y-2">
            <Textarea
              placeholder="Ask AI to help with your slide..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={3}
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!prompt.trim() || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="p-4">
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={action.action}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-3">Content Suggestions</h4>
            <div className="space-y-2">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  Generate content about:
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Introduction", "Key Points", "Summary", "Questions"].map(
                    (topic) => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() =>
                          setPrompt(`Generate content about: ${topic}`)
                        }
                      >
                        {topic}
                      </Button>
                    )
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
