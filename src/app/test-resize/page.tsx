"use client";

import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

export default function TestResizePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {!isCollapsed && (
          <>
            <ResizablePanel
              defaultSize={25}
              minSize={15}
              maxSize={40}
              className="bg-muted/50"
            >
              <div className="p-4 h-full">
                <h2 className="text-lg font-semibold mb-4">
                  Resizable Sidebar
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drag the handle between panels to resize. The sidebar can be
                  resized between 15% and 40% of the screen width.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-background rounded-md border">
                    Item 1
                  </div>
                  <div className="p-3 bg-background rounded-md border">
                    Item 2
                  </div>
                  <div className="p-3 bg-background rounded-md border">
                    Item 3
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel defaultSize={isCollapsed ? 100 : 75}>
          <div className="p-8 h-full">
            <h1 className="text-2xl font-bold mb-4">Test Resizable Panel</h1>
            <Button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? "Show" : "Hide"} Sidebar
            </Button>
            <div className="mt-4 p-6 bg-muted/50 rounded-lg">
              <p className="font-medium">Main content area</p>
              <p className="text-sm text-muted-foreground mt-2">
                The sidebar can be resized by dragging the handle between
                panels. Look for the grip icon when hovering over the divider.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The sidebar maintains its size in localStorage and will be
                restored on page reload.
              </p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
