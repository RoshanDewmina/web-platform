"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Code,
  Plus,
  Play,
  Settings,
  FileCode,
  Palette,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { CustomComponentEditor } from "@/components/slide-builder/custom-component-editor";
import { CustomComponentRenderer } from "@/components/slide-builder/custom-component-renderer";
import { ComponentSandbox } from "@/lib/component-sandbox";
import { CustomComponent } from "@/types/custom-components";
import { toast } from "sonner";

export default function TestCustomComponentsPage() {
  const [activeTab, setActiveTab] = useState("editor");
  const [savedComponents, setSavedComponents] = useState<CustomComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<CustomComponent | null>(null);
  const [previewProps, setPreviewProps] = useState<Record<string, any>>({});

  // Sample components for testing
  const sampleComponents: CustomComponent[] = [
    {
      id: "counter-1",
      name: "Interactive Counter",
      description: "A simple counter with increment/decrement buttons",
      code: ComponentSandbox.createComponentTemplate("counter"),
      dependencies: ["react"],
      propSchema: { initialValue: "number", step: "number", label: "string" },
      defaultProps: { initialValue: 0, step: 1, label: "Counter" },
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 2, h: 2 },
      category: "custom",
      isPublic: false,
      tags: ["interactive", "counter"],
      version: 1,
      usageCount: 0,
      rating: 0,
      isVerified: false,
      createdBy: "test-user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "timer-1",
      name: "Countdown Timer",
      description: "A countdown timer with start/pause/reset controls",
      code: ComponentSandbox.createComponentTemplate("timer"),
      dependencies: ["react"],
      propSchema: { duration: "number", label: "string" },
      defaultProps: { duration: 60, label: "Timer" },
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 2, h: 2 },
      category: "custom",
      isPublic: false,
      tags: ["timer", "countdown"],
      version: 1,
      usageCount: 0,
      rating: 0,
      isVerified: false,
      createdBy: "test-user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "progress-1",
      name: "Progress Bar",
      description: "A customizable progress bar component",
      code: ComponentSandbox.createComponentTemplate("progress"),
      dependencies: ["react"],
      propSchema: {
        value: "number",
        max: "number",
        label: "string",
        color: "string",
      },
      defaultProps: {
        value: 50,
        max: 100,
        label: "Progress",
        color: "#007bff",
      },
      defaultSize: { w: 6, h: 2 },
      minSize: { w: 3, h: 1 },
      category: "custom",
      isPublic: false,
      tags: ["progress", "bar"],
      version: 1,
      usageCount: 0,
      rating: 0,
      isVerified: false,
      createdBy: "test-user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const handleSaveComponent = (component: CustomComponent) => {
    const existingIndex = savedComponents.findIndex(
      (c) => c.id === component.id
    );

    if (existingIndex >= 0) {
      // Update existing component
      const updated = [...savedComponents];
      updated[existingIndex] = component;
      setSavedComponents(updated);
    } else {
      // Add new component
      setSavedComponents((prev) => [...prev, component]);
    }

    toast.success(`Component "${component.name}" saved successfully!`);
  };

  const handleLoadSample = (component: CustomComponent) => {
    setSelectedComponent(component);
    setActiveTab("editor");
    toast.success(`Loaded sample component: ${component.name}`);
  };

  const handlePreviewComponent = (component: CustomComponent) => {
    setSelectedComponent(component);
    setActiveTab("preview");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileCode className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-semibold">
                Custom Components System
              </h1>
              <p className="text-sm text-muted-foreground">
                Create, edit, and test custom React components
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {savedComponents.length} Saved
            </Badge>
            <Badge variant="default" className="text-xs">
              Phase 3
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col"
        >
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Component Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Live Preview
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1">
              <Palette className="h-4 w-4 mr-2" />
              Component Gallery
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Sample Components
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1">
            <div className="h-full">
              <CustomComponentEditor
                component={selectedComponent}
                onSave={handleSaveComponent}
                className="h-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold mb-4">
                  Live Component Preview
                </h2>

                {selectedComponent ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium">
                          {selectedComponent.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedComponent.description}
                        </p>
                      </div>
                      <Badge variant="outline">Custom Component</Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Props</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedComponent.defaultProps).map(
                          ([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <label
                                htmlFor={`prop-${key}`}
                                className="text-xs font-mono"
                              >
                                {key}:
                              </label>
                              <input
                                id={`prop-${key}`}
                                type="text"
                                value={previewProps[key] ?? value}
                                onChange={(e) =>
                                  setPreviewProps((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                className="flex-1 px-2 py-1 text-xs border rounded"
                                placeholder={`Enter ${key} value`}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Select a component from the gallery to preview it here.
                  </p>
                )}
              </div>

              <div className="flex-1 p-4">
                {selectedComponent ? (
                  <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border">
                    <div className="max-w-md w-full">
                      <CustomComponentRenderer
                        component={selectedComponent}
                        props={previewProps}
                        theme={{ mode: "light" }}
                        slideId="preview"
                        elementId="preview"
                        isPreview={true}
                        isEditing={false}
                        className="w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a component to see it in action</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="flex-1">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Your Custom Components
                </h2>
                <Button onClick={() => setActiveTab("editor")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>

              {savedComponents.length === 0 ? (
                <div className="text-center py-12">
                  <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No custom components yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first custom component to get started
                  </p>
                  <Button onClick={() => setActiveTab("editor")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Component
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedComponents.map((component) => (
                    <Card
                      key={component.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              {component.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {component.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-muted-foreground">
                            Size:
                          </span>
                          <span className="text-xs font-mono">
                            {component.defaultSize.w}×{component.defaultSize.h}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedComponent(component);
                              setActiveTab("editor");
                            }}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePreviewComponent(component)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="samples" className="flex-1">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-6">Sample Components</h2>
              <p className="text-muted-foreground mb-6">
                These are pre-built sample components you can use as starting
                points.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleComponents.map((component) => (
                  <Card
                    key={component.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {component.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {component.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Sample
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">
                          Props:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(component.defaultProps).map((prop) => (
                            <Badge
                              key={prop}
                              variant="outline"
                              className="text-xs"
                            >
                              {prop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadSample(component)}
                        >
                          <Code className="h-3 w-3 mr-1" />
                          Load
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePreviewComponent(component)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted/20 rounded-lg">
                <h3 className="font-medium mb-2">Available Templates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ComponentSandbox.getAvailableTemplates().map((template) => (
                    <div key={template} className="text-sm">
                      <span className="font-mono">{template}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
