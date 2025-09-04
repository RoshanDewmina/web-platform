"use client";

import { useState } from "react";
import { ResizablePanel } from "@/components/ui/resizable-panel";
import { Button } from "@/components/ui/button";

export default function TestResizePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <ResizablePanel
        isOpen={isOpen}
        defaultWidth={300}
        minWidth={200}
        maxWidth={500}
        className="border-r bg-gray-50 dark:bg-gray-900"
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Resizable Sidebar</h2>
          <p className="text-sm text-muted-foreground">
            Drag the right edge of this panel to resize it. The handle should be visible when you hover over it.
          </p>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-background rounded">Item 1</div>
            <div className="p-2 bg-background rounded">Item 2</div>
            <div className="p-2 bg-background rounded">Item 3</div>
          </div>
        </div>
      </ResizablePanel>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Test Resizable Panel</h1>
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"} Sidebar
        </Button>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p>Main content area</p>
          <p className="text-sm text-muted-foreground mt-2">
            The sidebar should be resizable by dragging its right edge. Look for the blue handle on hover.
          </p>
        </div>
      </div>
    </div>
  );
}
