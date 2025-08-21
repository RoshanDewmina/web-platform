"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

type RoadmapProps = {
  title: string;
  totalModules: number;
  completedModules: number;
};

export function Roadmap({
  title,
  totalModules,
  completedModules,
}: RoadmapProps) {
  const nodes = useMemo(() => {
    return Array.from({ length: totalModules }).map((_, idx) => ({
      index: idx + 1,
      done: idx < completedModules,
    }));
  }, [totalModules, completedModules]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary">
            {completedModules}/{totalModules} modules
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="flex items-center gap-4">
              {nodes.map((n, i) => (
                <div key={n.index} className="flex items-center gap-4">
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                        n.done
                          ? "border-green-500 bg-green-500/10"
                          : "border-muted"
                      }`}
                      title={`Module ${n.index}`}
                      aria-label={`Module ${n.index} ${
                        n.done ? "completed" : "pending"
                      }`}
                    >
                      {n.done ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {n.index}
                    </span>
                  </div>
                  {i < nodes.length - 1 && (
                    <div
                      className={`h-0.5 w-16 ${
                        i < completedModules - 1 ? "bg-green-500" : "bg-muted"
                      }`}
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
