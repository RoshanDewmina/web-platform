"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HeatmapProps = {
  daily: { date: string; minutes: number }[];
  title?: string;
};

export function Heatmap({ daily, title = "Study Heatmap" }: HeatmapProps) {
  // Build last 13 weeks grid (7x13)
  const dates = daily.slice(-7 * 13);
  const max = Math.max(1, ...dates.map((d) => d.minutes));
  const colorFor = (m: number) => {
    const t = m / max;
    if (t === 0) return "bg-muted";
    if (t < 0.25) return "bg-emerald-200 dark:bg-emerald-900";
    if (t < 0.5) return "bg-emerald-300 dark:bg-emerald-800";
    if (t < 0.75) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-500 dark:bg-emerald-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {/* Week columns */}
          {Array.from({ length: 13 }).map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dow) => {
                const idx = dates.length - (13 - weekIdx) * 7 + dow;
                const item = dates[idx] || { minutes: 0 };
                return (
                  <div
                    key={dow}
                    className={`h-3 w-3 rounded-sm ${colorFor(
                      item.minutes || 0
                    )}`}
                    title={`${item?.date || ""}: ${item?.minutes || 0} min`}
                    aria-label={`${item?.date || ""}: ${
                      item?.minutes || 0
                    } min`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
