"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Code, RefreshCw, Settings } from "lucide-react";
import {
  CustomComponent,
  ComponentExecutionContext,
} from "@/types/custom-components";
import { ComponentSandbox } from "@/lib/component-sandbox";
import { cn } from "@/lib/utils";

interface CustomComponentRendererProps {
  component: CustomComponent;
  props: Record<string, any>;
  theme: Record<string, any>;
  slideId: string;
  elementId: string;
  isPreview: boolean;
  isEditing: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

export function CustomComponentRenderer({
  component,
  props,
  theme,
  slideId,
  elementId,
  isPreview,
  isEditing,
  className,
  style,
  onError,
  onLoad,
}: CustomComponentRendererProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [componentResult, setComponentResult] =
    useState<React.ReactElement | null>(null);
  const [executionTime, setExecutionTime] = useState<number>(0);

  const sandbox = useMemo(() => new ComponentSandbox(), []);

  const context: ComponentExecutionContext = useMemo(
    () => ({
      props: { ...component.defaultProps, ...props },
      theme,
      slideId,
      elementId,
      isPreview,
      isEditing,
    }),
    [
      component.defaultProps,
      props,
      theme,
      slideId,
      elementId,
      isPreview,
      isEditing,
    ]
  );

  useEffect(() => {
    executeComponent();
  }, [component.code, context]);

  const executeComponent = async () => {
    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const result = await sandbox.executeComponent(component, context);

      if (result.success && result.result) {
        setComponentResult(result.result);
        onLoad?.();
      } else {
        const errorMessage = result.error || "Component execution failed";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    executeComponent();
  };

  const handleEdit = () => {
    // This would open the component editor
    console.log("Edit component:", component.id);
  };

  if (isLoading) {
    return (
      <Card
        className={cn("flex items-center justify-center p-4", className)}
        style={style}
      >
        <div className="text-center">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading component...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("p-4", className)} style={style}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Component Error</p>
              <p className="text-sm">{error}</p>
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={handleEdit}>
                    <Settings className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  if (!componentResult) {
    return (
      <Card
        className={cn("flex items-center justify-center p-4", className)}
        style={style}
      >
        <div className="text-center text-muted-foreground">
          <Code className="h-6 w-6 mx-auto mb-2" />
          <p className="text-sm">No component output</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("relative", className)} style={style}>
      {/* Component Output */}
      <div className="w-full h-full">{componentResult}</div>

      {/* Debug Info (only in editing mode) */}
      {isEditing && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {executionTime.toFixed(1)}ms
          </Badge>
          <Badge variant="outline" className="text-xs">
            Custom
          </Badge>
        </div>
      )}

      {/* Component Info Overlay (on hover in editing mode) */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
            <p className="font-medium">{component.name}</p>
            {component.description && (
              <p className="text-muted-foreground">{component.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Higher-order component for easier integration
export function withCustomComponentRenderer<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function CustomComponentWrapper(
    props: P & { customComponent?: CustomComponent }
  ) {
    const { customComponent, ...restProps } = props;

    if (!customComponent) {
      return <WrappedComponent {...(restProps as P)} />;
    }

    return (
      <CustomComponentRenderer
        component={customComponent}
        props={restProps as Record<string, any>}
        theme={{}}
        slideId=""
        elementId=""
        isPreview={false}
        isEditing={false}
      />
    );
  };
}

// Utility hook for custom component management
export function useCustomComponent(componentId: string) {
  const [component, setComponent] = useState<CustomComponent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComponent();
  }, [componentId]);

  const loadComponent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This would fetch the component from the database
      // For now, we'll simulate loading
      const response = await fetch(`/api/custom-components/${componentId}`);

      if (!response.ok) {
        throw new Error("Failed to load component");
      }

      const data = await response.json();
      setComponent(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load component";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateComponent = async (updates: Partial<CustomComponent>) => {
    if (!component) return;

    try {
      const response = await fetch(`/api/custom-components/${componentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update component");
      }

      const updatedComponent = await response.json();
      setComponent(updatedComponent);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update component";
      setError(errorMessage);
    }
  };

  return {
    component,
    isLoading,
    error,
    updateComponent,
    reload: loadComponent,
  };
}

// Component registry hook
export function useComponentRegistry() {
  const [components, setComponents] = useState<CustomComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/custom-components");
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error("Failed to load components:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addComponent = async (
    component: Omit<CustomComponent, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/custom-components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(component),
      });

      if (response.ok) {
        const newComponent = await response.json();
        setComponents((prev) => [...prev, newComponent]);
        return newComponent;
      }
    } catch (error) {
      console.error("Failed to add component:", error);
    }
  };

  const deleteComponent = async (componentId: string) => {
    try {
      const response = await fetch(`/api/custom-components/${componentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComponents((prev) => prev.filter((c) => c.id !== componentId));
      }
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  };

  return {
    components,
    isLoading,
    addComponent,
    deleteComponent,
    reload: loadComponents,
  };
}





