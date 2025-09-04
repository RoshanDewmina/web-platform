"use client";

import { GridCanvas } from "@/components/slide-builder/grid-canvas";
import { ComponentPalette } from "@/components/slide-builder/component-palette";
import { PropertiesEditor } from "@/components/slide-builder/properties-editor";
import { AIAssistant } from "@/components/slide-builder/ai-assistant";
import useSlideBuilderStore from "@/stores/slide-builder-store";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Save,
  Play,
  Undo,
  Redo,
  Plus,
  Layout,
  Settings,
  MessageSquare,
} from "lucide-react";

export default function TestSlideBuilderPage() {
  const {
    currentSlide,
    selectedElementId,
    setCurrentSlide,
    addElement,
    undo,
    redo,
    historyIndex,
    history,
  } = useSlideBuilderStore();

  useEffect(() => {
    // Initialize with a test slide
    if (!currentSlide) {
      setCurrentSlide({
        id: "test-slide",
        title: "Test Slide",
        elements: [
          {
            id: "title-1",
            type: "title",
            x: 2,
            y: 2,
            w: 8,
            h: 2,
            props: {
              content: "Welcome to the Slide Builder!",
              level: 1,
              align: "center",
            },
          },
          {
            id: "text-1",
            type: "text",
            x: 2,
            y: 5,
            w: 8,
            h: 3,
            props: {
              content:
                "This is a test slide to verify the slide builder components are working correctly.",
              fontSize: 18,
              align: "center",
            },
          },
        ],
      });
    }
  }, [currentSlide, setCurrentSlide]);

  const handleComponentDrop = (type: string, defaultProps: any) => {
    // Add a new component to the slide using the store
    addElement({
      type,
      x: 2,
      y: 2,
      w: 4,
      h: 2,
      props: defaultProps,
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Test Slide Builder</h1>
            <span className="text-sm text-muted-foreground">
              Testing Phase 2 Components
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4 mr-2" />
              Redo
            </Button>
            <div className="border-l mx-2" />
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Components & Templates */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Tabs defaultValue="components" className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="components" className="flex-1">
                  <Layout className="h-4 w-4 mr-1" />
                  Components
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Templates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="components" className="flex-1">
                <ComponentPalette onComponentSelect={handleComponentDrop} />
              </TabsContent>

              <TabsContent value="templates" className="flex-1 p-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Template system is working! 18+ templates available.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Canvas */}
          <ResizablePanel defaultSize={60}>
            <div className="h-full flex items-center justify-center bg-muted/20 p-4">
              <div className="w-full max-w-4xl">
                <GridCanvas readOnly={false} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Properties & AI */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Tabs defaultValue="properties" className="h-full flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="properties" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1">
                <PropertiesEditor
                  element={currentSlide?.elements.find(
                    (el) => el.id === selectedElementId
                  )}
                  slide={currentSlide}
                />
              </TabsContent>

              <TabsContent value="ai" className="flex-1">
                <AIAssistant slideId="test-slide" />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
