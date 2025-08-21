"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  previewImage?: string;
  blockStructure: any;
}

interface TemplatePickerProps {
  onApplyToSlide: (template: Template) => void;
  onApplyToLesson?: (template: Template) => void;
}

export function TemplatePicker({
  onApplyToSlide,
  onApplyToLesson,
}: TemplatePickerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      // In test environments or older runtimes without fetch, skip auto loading
      if (typeof fetch === "undefined") {
        if (mounted) setTemplates([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/templates", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setTemplates(data);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selected = templates.find((t) => t.id === selectedId);

  return (
    <Card className="p-3 space-y-3">
      <div className="space-y-2">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                loading ? "Loading templates..." : "Choose a template"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!selected}
          onClick={() => selected && onApplyToSlide(selected)}
        >
          Apply to Slide
        </Button>
        {onApplyToLesson && (
          <Button
            size="sm"
            variant="outline"
            disabled={!selected}
            onClick={() => selected && onApplyToLesson(selected)}
          >
            Apply to Lesson
          </Button>
        )}
      </div>
    </Card>
  );
}
