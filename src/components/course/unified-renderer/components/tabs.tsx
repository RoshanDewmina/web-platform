"use client";

import React from "react";
import { Tabs as UITabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockRenderer } from "../block-renderer";
import { UnifiedContentBlock } from "@/types/unified-content";

interface TabsProps {
  tabs: Array<{
    label: string;
    content: UnifiedContentBlock[];
  }>;
  defaultTab?: number;
}

export default function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
  const defaultValue = `tab-${defaultTab}`;

  return (
    <UITabs defaultValue={defaultValue} className="my-6">
      <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab, index) => (
          <TabsTrigger key={index} value={`tab-${index}`}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={`tab-${index}`} className="mt-4">
          <BlockRenderer blocks={tab.content} />
        </TabsContent>
      ))}
    </UITabs>
  );
}
