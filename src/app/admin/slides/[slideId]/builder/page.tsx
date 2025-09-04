"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GridCanvas } from "@/components/slide-builder/grid-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useSlideBuilderStore from "@/stores/slide-builder-store";
import { SlideLayout, GridElement } from "@/types/slide-builder";
import {
  Save,
  Play,
  Undo,
  Redo,
  Plus,
  Layout,
  Settings,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { ComponentPalette } from "@/components/slide-builder/component-palette";
import { PropertiesEditor } from "@/components/slide-builder/properties-editor";
import { AIAssistant } from "@/components/slide-builder/ai-assistant";

export default function SlideBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const slideId = params.slideId as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lessonInfo, setLessonInfo] = useState<any>(null);

  const {
    currentSlide,
    setCurrentSlide,
    selectedElementId,
    history,
    historyIndex,
    undo,
    redo,
    addElement,
    saveToHistory,
  } = useSlideBuilderStore();

  // Load slide data
  useEffect(() => {
    const loadSlide = async () => {
      try {
        const response = await fetch(`/api/slides/${slideId}`);
        if (!response.ok) throw new Error("Failed to load slide");

        const data = await response.json();

        // Convert database format to SlideLayout
        const slideLayout: SlideLayout = {
          id: data.id,
          title: data.title,
          elements: (data.gridLayout as GridElement[]) || [],
          notes: data.notes,
          theme: data.theme,
          transition: data.transition,
          duration: data.duration,
          background: data.background,
        };

        setCurrentSlide(slideLayout);
        setLessonInfo(data.lesson);
        saveToHistory();
      } catch (error) {
        console.error("Error loading slide:", error);
        toast.error("Failed to load slide");
      } finally {
        setLoading(false);
      }
    };

    if (slideId && slideId !== "new") {
      loadSlide();
    } else {
      // Create new slide
      const newSlide: SlideLayout = {
        id: "new",
        title: "New Slide",
        elements: [],
      };
      setCurrentSlide(newSlide);
      setLoading(false);
    }
  }, [slideId, setCurrentSlide, saveToHistory]);

  // Save slide
  const handleSave = async () => {
    if (!currentSlide) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/slides/${slideId}`, {
        method: slideId === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentSlide.title,
          gridLayout: currentSlide.elements,
          notes: currentSlide.notes,
          theme: currentSlide.theme,
          transition: currentSlide.transition,
          duration: currentSlide.duration,
          background: currentSlide.background,
        }),
      });

      if (!response.ok) throw new Error("Failed to save slide");

      const savedSlide = await response.json();

      if (slideId === "new") {
        // Redirect to the saved slide
        router.replace(`/admin/slides/${savedSlide.id}/builder`);
      }

      toast.success("Slide saved successfully");
    } catch (error) {
      console.error("Error saving slide:", error);
      toast.error("Failed to save slide");
    } finally {
      setSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    // Save before preview
    handleSave().then(() => {
      window.open(`/slides/${slideId}/preview`, "_blank");
    });
  };

  // Handle component drop from palette
  const handleComponentDrop = (type: string, defaultProps: any) => {
    addElement({
      type,
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      props: defaultProps,
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="animate-pulse">Loading slide...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">
                {currentSlide?.title || "Untitled Slide"}
              </h1>
              {lessonInfo && (
                <span className="text-sm text-muted-foreground">
                  in {lessonInfo.title}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>

            <div className="border-l mx-2" />

            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Component Palette & AI */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <Tabs defaultValue="components" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger value="components" className="flex-1">
                <Plus className="h-4 w-4 mr-1" />
                Components
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                <Layout className="h-4 w-4 mr-1" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-1" />
                AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="h-[calc(100%-40px)]">
              <ComponentPalette onComponentSelect={handleComponentDrop} />
            </TabsContent>

            <TabsContent value="templates" className="h-[calc(100%-40px)]">
              <TemplatePalette />
            </TabsContent>

            <TabsContent value="ai" className="h-[calc(100%-40px)]">
              <AIAssistant slideId={slideId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle />

        {/* Center - Canvas */}
        <ResizablePanel defaultSize={60}>
          <GridCanvas />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Panel - Properties */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-l">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Properties
              </h3>
            </div>
            <PropertiesEditor
              element={currentSlide?.elements.find(
                (el) => el.id === selectedElementId
              )}
              slide={currentSlide}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// Template Palette Component
function TemplatePalette() {
  const templates = [
    { id: "title-content", name: "Title & Content", preview: "📝" },
    { id: "two-column", name: "Two Column", preview: "⬛⬜" },
    { id: "media-left", name: "Media Left", preview: "🖼️📝" },
    { id: "media-right", name: "Media Right", preview: "📝🖼️" },
    { id: "title-only", name: "Title Only", preview: "🔤" },
    { id: "blank", name: "Blank", preview: "⬜" },
  ];

  const { applyTemplate } = useSlideBuilderStore();

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => {
              // This would fetch and apply the template
              fetch(`/api/templates/${template.id}`)
                .then((res) => res.json())
                .then((data) => applyTemplate(data));
            }}
          >
            <div className="text-2xl text-center mb-2">{template.preview}</div>
            <p className="text-xs text-center">{template.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
