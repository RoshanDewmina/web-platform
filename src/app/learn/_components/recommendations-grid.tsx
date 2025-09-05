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
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award } from "lucide-react";

function RecommendationSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

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

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <RecommendationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          No recommendations yet
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Update your learning preferences in Profile to get personalized
          recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((course) => (
        <Card
          key={course.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
        >
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 relative overflow-hidden">
            <Badge className="absolute top-2 right-2 z-10" variant="secondary">
              <Award className="h-3 w-3 mr-1" />
              Recommended
            </Badge>
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-12 w-12 text-primary/50 transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardHeader>
            <CardTitle className="text-base group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
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
            <Button
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              variant="outline"
              size="sm"
            >
              Learn More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
