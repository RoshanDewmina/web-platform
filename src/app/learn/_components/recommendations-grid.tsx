"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Award } from "lucide-react";

export function RecommendationsGrid() {
  const [items, setItems] = useState<
    Array<{ id: string; title: string; description: string; reason?: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/recommendations");
        if (!res.ok) return;
        const data = await res.json();
        const mapped = (data.recommendations || []).map((r: any) => ({
          id: r.course.id,
          title: r.course.title,
          description: r.course.description,
          reason: r.reason,
        }));
        if (mounted) setItems(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading...</div>;
  if (items.length === 0)
    return (
      <div className="text-muted-foreground">
        No recommendations yet. Update your learning preferences in Profile.
      </div>
    );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative">
            <Badge className="absolute top-2 right-2" variant="secondary">
              <Award className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-primary/50" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-base">{course.title}</CardTitle>
            {course.reason && (
              <div className="text-xs text-muted-foreground">
                {course.reason}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground line-clamp-3">
              {course.description}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" size="sm">
              Learn More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
