"use client";

import React from "react";
import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlockRenderer } from "../block-renderer";
import { UnifiedContentBlock } from "@/types/unified-content";

interface AccordionProps {
  items: Array<{
    title: string;
    content: UnifiedContentBlock[];
    defaultOpen?: boolean;
  }>;
}

export default function Accordion({ items }: AccordionProps) {
  const defaultValues = items
    .map((item, index) => (item.defaultOpen ? `item-${index}` : null))
    .filter(Boolean) as string[];

  return (
    <UIAccordion
      type="multiple"
      defaultValue={defaultValues}
      className="my-6"
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {item.title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <BlockRenderer blocks={item.content} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </UIAccordion>
  );
}
