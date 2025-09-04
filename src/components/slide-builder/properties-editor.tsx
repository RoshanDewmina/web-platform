"use client";

import React from "react";
import { Card } from "@/components/ui/card";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GridElement, SlideLayout } from "@/types/slide-builder";
import useSlideBuilderStore from "@/stores/slide-builder-store";
import { Palette, Settings2, Move, Lock, Unlock } from "lucide-react";

interface PropertiesEditorProps {
  element?: GridElement;
  slide?: SlideLayout | null;
}

export function PropertiesEditor({ element, slide }: PropertiesEditorProps) {
  const { updateElement, updateSlideTitle, updateSlideNotes } =
    useSlideBuilderStore();

  if (!element && !slide) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Settings2 className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  if (element) {
    return <ElementProperties element={element} onUpdate={updateElement} />;
  }

  return <SlideProperties slide={slide!} />;
}

function ElementProperties({
  element,
  onUpdate,
}: {
  element: GridElement;
  onUpdate: (id: string, updates: Partial<GridElement>) => void;
}) {
  const handlePropChange = (key: string, value: any) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        [key]: value,
      },
    });
  };

  const handlePositionChange = (key: "x" | "y" | "w" | "h", value: number) => {
    onUpdate(element.id, { [key]: value });
  };

  return (
    <Tabs defaultValue="properties" className="h-full">
      <TabsList className="w-full">
        <TabsTrigger value="properties" className="flex-1">
          Properties
        </TabsTrigger>
        <TabsTrigger value="position" className="flex-1">
          Position
        </TabsTrigger>
        <TabsTrigger value="style" className="flex-1">
          Style
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[calc(100%-40px)]">
        <TabsContent value="properties" className="p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1">Type</Label>
            <p className="text-sm font-medium capitalize">{element.type}</p>
          </div>

          {/* Component-specific properties */}
          {element.type === "text" ||
          element.type === "title" ||
          element.type === "paragraph" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={element.props.content || ""}
                  onChange={(e) => handlePropChange("content", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="fontSize"
                    min={10}
                    max={72}
                    step={1}
                    value={[element.props.fontSize || 16]}
                    onValueChange={([value]) =>
                      handlePropChange("fontSize", value)
                    }
                    className="flex-1"
                  />
                  <span className="text-sm w-12">
                    {element.props.fontSize || 16}px
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="align">Alignment</Label>
                <Select
                  value={element.props.align || "left"}
                  onValueChange={(value) => handlePropChange("align", value)}
                >
                  <SelectTrigger id="align">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : null}

          {element.type === "image" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  type="url"
                  value={element.props.src || ""}
                  onChange={(e) => handlePropChange("src", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={element.props.alt || ""}
                  onChange={(e) => handlePropChange("alt", e.target.value)}
                  placeholder="Describe the image..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fit">Object Fit</Label>
                <Select
                  value={element.props.fit || "contain"}
                  onValueChange={(value) => handlePropChange("fit", value)}
                >
                  <SelectTrigger id="fit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {element.type === "video" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="src">Video URL</Label>
                <Input
                  id="src"
                  type="url"
                  value={element.props.src || ""}
                  onChange={(e) => handlePropChange("src", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay</Label>
                <Switch
                  id="autoplay"
                  checked={element.props.autoplay || false}
                  onCheckedChange={(checked) =>
                    handlePropChange("autoplay", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="controls">Show Controls</Label>
                <Switch
                  id="controls"
                  checked={element.props.controls !== false}
                  onCheckedChange={(checked) =>
                    handlePropChange("controls", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="loop">Loop</Label>
                <Switch
                  id="loop"
                  checked={element.props.loop || false}
                  onCheckedChange={(checked) =>
                    handlePropChange("loop", checked)
                  }
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="position" className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <Label>Lock Element</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate(element.id, { locked: !element.locked })}
            >
              {element.locked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x">X Position</Label>
              <Input
                id="x"
                type="number"
                min={0}
                max={11}
                value={element.x}
                onChange={(e) =>
                  handlePositionChange("x", parseInt(e.target.value))
                }
                disabled={element.locked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="y">Y Position</Label>
              <Input
                id="y"
                type="number"
                min={0}
                max={11}
                value={element.y}
                onChange={(e) =>
                  handlePositionChange("y", parseInt(e.target.value))
                }
                disabled={element.locked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="w">Width</Label>
              <Input
                id="w"
                type="number"
                min={1}
                max={12}
                value={element.w}
                onChange={(e) =>
                  handlePositionChange("w", parseInt(e.target.value))
                }
                disabled={element.locked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="h">Height</Label>
              <Input
                id="h"
                type="number"
                min={1}
                max={12}
                value={element.h}
                onChange={(e) =>
                  handlePositionChange("h", parseInt(e.target.value))
                }
                disabled={element.locked}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zIndex">Layer (Z-Index)</Label>
            <Input
              id="zIndex"
              type="number"
              value={element.zIndex || 0}
              onChange={(e) =>
                onUpdate(element.id, { zIndex: parseInt(e.target.value) })
              }
              disabled={element.locked}
            />
          </div>
        </TabsContent>

        <TabsContent value="style" className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={element.props.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handlePropChange("backgroundColor", e.target.value)
                }
                className="w-16"
              />
              <Input
                value={element.props.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handlePropChange("backgroundColor", e.target.value)
                }
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={element.props.color || "#000000"}
                onChange={(e) => handlePropChange("color", e.target.value)}
                className="w-16"
              />
              <Input
                value={element.props.color || "#000000"}
                onChange={(e) => handlePropChange("color", e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="borderRadius"
                min={0}
                max={50}
                step={1}
                value={[element.props.borderRadius || 0]}
                onValueChange={([value]) =>
                  handlePropChange("borderRadius", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-12">
                {element.props.borderRadius || 0}px
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="opacity">Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                id="opacity"
                min={0}
                max={100}
                step={5}
                value={[(element.props.opacity || 1) * 100]}
                onValueChange={([value]) =>
                  handlePropChange("opacity", value / 100)
                }
                className="flex-1"
              />
              <span className="text-sm w-12">
                {Math.round((element.props.opacity || 1) * 100)}%
              </span>
            </div>
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}

function SlideProperties({ slide }: { slide: SlideLayout }) {
  const { updateSlideTitle, updateSlideNotes } = useSlideBuilderStore();

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Slide Title</Label>
          <Input
            id="title"
            value={slide.title}
            onChange={(e) => updateSlideTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Speaker Notes</Label>
          <Textarea
            id="notes"
            value={slide.notes || ""}
            onChange={(e) => updateSlideNotes(e.target.value)}
            rows={6}
            placeholder="Add speaker notes..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transition">Transition</Label>
          <Select
            value={slide.transition || "none"}
            onValueChange={(value) => {
              // Update transition
            }}
          >
            <SelectTrigger id="transition">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
              <SelectItem value="slide">Slide</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Auto-advance (seconds)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            value={slide.duration || 0}
            onChange={(e) => {
              // Update duration
            }}
            placeholder="0 = disabled"
          />
        </div>
      </div>
    </ScrollArea>
  );
}
