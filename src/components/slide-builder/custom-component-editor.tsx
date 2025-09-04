"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Save,
  Code,
  Eye,
  Settings,
  Download,
  Upload,
  Copy,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  FileCode,
  Palette,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  CustomComponent,
  ComponentEditorState,
} from "@/types/custom-components";
import { ComponentValidator } from "@/lib/component-validator";
import { ComponentSandbox } from "@/lib/component-sandbox";
import { cn } from "@/lib/utils";

interface CustomComponentEditorProps {
  component?: CustomComponent | null;
  onSave?: (component: CustomComponent) => void;
  onCancel?: () => void;
  className?: string;
}

export function CustomComponentEditor({
  component,
  onSave,
  onCancel,
  className,
}: CustomComponentEditorProps) {
  const [editorState, setEditorState] = useState<ComponentEditorState>({
    code:
      component?.code || ComponentSandbox.createComponentTemplate("counter"),
    props: component?.defaultProps || {},
    previewMode: false,
    isCompiling: false,
    errors: [],
    warnings: [],
  });

  const [componentName, setComponentName] = useState(
    component?.name || "MyComponent"
  );
  const [componentDescription, setComponentDescription] = useState(
    component?.description || ""
  );
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [previewResult, setPreviewResult] = useState<React.ReactElement | null>(
    null
  );

  const validator = new ComponentValidator();
  const sandbox = new ComponentSandbox();

  // Auto-validate on code change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateComponent();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [editorState.code]);

  const validateComponent = useCallback(async () => {
    setIsValidating(true);
    try {
      const tempComponent: CustomComponent = {
        id: "temp",
        name: componentName,
        description: componentDescription,
        code: editorState.code,
        dependencies: [],
        propSchema: {},
        defaultProps: editorState.props,
        defaultSize: { w: 4, h: 3 },
        minSize: { w: 2, h: 2 },
        category: "custom",
        isPublic: false,
        tags: [],
        version: 1,
        usageCount: 0,
        rating: 0,
        isVerified: false,
        createdBy: "current-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await validator.validateComponent(tempComponent);
      setValidationResult(result);
      setEditorState((prev) => ({
        ...prev,
        errors: result.errors,
        warnings: result.warnings,
      }));
    } catch (error) {
      console.error("Validation error:", error);
      setEditorState((prev) => ({
        ...prev,
        errors: ["Validation failed"],
      }));
    } finally {
      setIsValidating(false);
    }
  }, [editorState.code, componentName, componentDescription]);

  const previewComponent = useCallback(async () => {
    if (!validationResult?.isValid) {
      toast.error("Please fix validation errors before previewing");
      return;
    }

    try {
      const tempComponent: CustomComponent = {
        id: "preview",
        name: componentName,
        description: componentDescription,
        code: editorState.code,
        dependencies: [],
        propSchema: {},
        defaultProps: editorState.props,
        defaultSize: { w: 4, h: 3 },
        minSize: { w: 2, h: 2 },
        category: "custom",
        isPublic: false,
        tags: [],
        version: 1,
        usageCount: 0,
        rating: 0,
        isVerified: false,
        createdBy: "current-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await sandbox.executeComponent(tempComponent, {
        props: editorState.props,
        theme: { mode: "light" },
        slideId: "preview",
        elementId: "preview",
        isPreview: true,
        isEditing: false,
      });

      if (result.success && result.result) {
        setPreviewResult(result.result);
        setEditorState((prev) => ({ ...prev, previewMode: true }));
      } else {
        toast.error(result.error || "Preview failed");
      }
    } catch (error) {
      toast.error(
        "Preview failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }, [
    editorState.code,
    editorState.props,
    validationResult,
    componentName,
    componentDescription,
  ]);

  const handleSave = useCallback(() => {
    if (!validationResult?.isValid) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    const savedComponent: CustomComponent = {
      id: component?.id || `custom-${Date.now()}`,
      name: componentName,
      description: componentDescription,
      code: editorState.code,
      dependencies: validationResult.dependencies,
      propSchema: validationResult.propSchema,
      defaultProps: editorState.props,
      defaultSize: { w: 4, h: 3 },
      minSize: { w: 2, h: 2 },
      category: "custom",
      isPublic: false,
      tags: component?.tags || [],
      version: component?.version || 1,
      usageCount: component?.usageCount || 0,
      rating: component?.rating || 0,
      isVerified: component?.isVerified || false,
      createdBy: component?.createdBy || "current-user",
      createdAt: component?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave?.(savedComponent);
    toast.success("Component saved successfully!");
  }, [
    component,
    componentName,
    componentDescription,
    editorState,
    validationResult,
    onSave,
  ]);

  const loadTemplate = useCallback((templateName: string) => {
    const templateCode = ComponentSandbox.createComponentTemplate(templateName);
    setEditorState((prev) => ({
      ...prev,
      code: templateCode,
      props: {},
    }));
    toast.success(`Loaded ${templateName} template`);
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <FileCode className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">Custom Component Editor</h2>
            <p className="text-sm text-muted-foreground">
              Create and edit custom React components
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={validateComponent}
            disabled={isValidating}
          >
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Validate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={previewComponent}
            disabled={!validationResult?.isValid}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!validationResult?.isValid}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <Tabs defaultValue="editor" className="w-full flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              <Code className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="component-name">Component Name</Label>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          validationResult?.isValid ? "default" : "destructive"
                        }
                      >
                        {validationResult?.isValid ? "Valid" : "Invalid"}
                      </Badge>
                      {isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                  <Input
                    id="component-name"
                    value={componentName}
                    onChange={(e) => setComponentName(e.target.value)}
                    placeholder="Enter component name..."
                    className="mt-2"
                  />
                </div>

                <div className="flex-1 p-4">
                  <Label htmlFor="component-code">Component Code</Label>
                  <Textarea
                    id="component-code"
                    value={editorState.code}
                    onChange={(e) =>
                      setEditorState((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder="Enter your React component code..."
                    className="h-full font-mono text-sm resize-none"
                    rows={20}
                  />
                </div>
              </div>

              {/* Validation Panel */}
              <div className="w-80 border-l">
                <div className="p-4">
                  <h3 className="font-semibold mb-4">Validation & Errors</h3>

                  {editorState.errors.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-red-600 mb-2">
                        Errors
                      </h4>
                      <div className="space-y-2">
                        {editorState.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {editorState.warnings.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-yellow-600 mb-2">
                        Warnings
                      </h4>
                      <div className="space-y-2">
                        {editorState.warnings.map((warning, index) => (
                          <Alert key={index} variant="default">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{warning}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {validationResult && (
                    <div className="space-y-4">
                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Dependencies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {validationResult.dependencies.map(
                            (dep: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {dep}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Props</h4>
                        <div className="space-y-1">
                          {Object.entries(validationResult.propSchema).map(
                            ([prop, type]) => (
                              <div
                                key={prop}
                                className="flex justify-between text-xs"
                              >
                                <span className="font-mono">{prop}</span>
                                <span className="text-muted-foreground">
                                  {type as string}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Component Preview</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(editorState.code)}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4">
                {previewResult ? (
                  <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border">
                    <div className="max-w-md w-full">{previewResult}</div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Preview" to see your component in action</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Component Settings</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="component-description">Description</Label>
                    <Textarea
                      id="component-description"
                      value={componentDescription}
                      onChange={(e) => setComponentDescription(e.target.value)}
                      placeholder="Describe your component..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Templates</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {ComponentSandbox.getAvailableTemplates().map(
                        (template) => (
                          <Button
                            key={template}
                            variant="outline"
                            size="sm"
                            onClick={() => loadTemplate(template)}
                            className="justify-start"
                          >
                            <Palette className="h-4 w-4 mr-2" />
                            {template.charAt(0).toUpperCase() +
                              template.slice(1)}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Default Props</h4>
                    <div className="space-y-2">
                      {Object.entries(editorState.props).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <Input
                            value={key}
                            onChange={(e) => {
                              const newProps = { ...editorState.props };
                              delete newProps[key];
                              newProps[e.target.value] = value;
                              setEditorState((prev) => ({
                                ...prev,
                                props: newProps,
                              }));
                            }}
                            className="w-32"
                          />
                          <Input
                            value={String(value)}
                            onChange={(e) => {
                              setEditorState((prev) => ({
                                ...prev,
                                props: { ...prev.props, [key]: e.target.value },
                              }));
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newProps = { ...editorState.props };
                              delete newProps[key];
                              setEditorState((prev) => ({
                                ...prev,
                                props: newProps,
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditorState((prev) => ({
                            ...prev,
                            props: { ...prev.props, newProp: "" },
                          }));
                        }}
                      >
                        Add Prop
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
