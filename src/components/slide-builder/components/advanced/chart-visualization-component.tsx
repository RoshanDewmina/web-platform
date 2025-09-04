"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "next-themes";

interface ChartData {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
  [key: string]: any;
}

interface ChartVisualizationComponentProps {
  data?: ChartData[];
  chartType?: "bar" | "line" | "pie" | "area" | "radar" | "mixed";
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
  onDataChange?: (data: ChartData[]) => void;
}

const defaultColors = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

const chartTypes = [
  { value: "bar", label: "Bar Chart", icon: BarChart3 },
  { value: "line", label: "Line Chart", icon: LineChartIcon },
  { value: "pie", label: "Pie Chart", icon: PieChartIcon },
  { value: "area", label: "Area Chart", icon: TrendingUp },
  { value: "radar", label: "Radar Chart", icon: BarChart3 },
];

export default function ChartVisualizationComponent({
  data: initialData = [
    { name: "Jan", value: 400, value2: 240 },
    { name: "Feb", value: 300, value2: 139 },
    { name: "Mar", value: 200, value2: 980 },
    { name: "Apr", value: 278, value2: 390 },
    { name: "May", value: 189, value2: 480 },
  ],
  chartType = "bar",
  title = "Chart",
  xAxisLabel = "Category",
  yAxisLabel = "Value",
  colors = defaultColors,
  showLegend = true,
  showGrid = true,
  width,
  height,
  previewMode = false,
  className,
  onDataChange,
}: ChartVisualizationComponentProps) {
  const [data, setData] = useState<ChartData[]>(initialData);
  const [currentChartType, setCurrentChartType] = useState(chartType);
  const [editMode, setEditMode] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(
    null
  );
  const { theme } = useTheme();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleDataUpdate = (index: number, field: string, value: any) => {
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      [field]: field === "name" ? value : parseFloat(value) || 0,
    };
    setData(updatedData);
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const addDataPoint = () => {
    const newData = [
      ...data,
      { name: `Item ${data.length + 1}`, value: 100, value2: 50 },
    ];
    setData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const removeDataPoint = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const exportData = () => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",");

      const newData = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = isNaN(Number(values[index]))
              ? values[index]?.trim()
              : Number(values[index]);
            return obj;
          }, {} as ChartData);
        })
        .filter((row) => row.name); // Filter out empty rows

      setData(newData);
      if (onDataChange) {
        onDataChange(newData);
      }
    };
    reader.readAsText(file);
  };

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const axisProps = {
      stroke: theme === "dark" ? "#64748b" : "#94a3b8",
      fontSize: 12,
    };

    const gridProps = {
      strokeDasharray: "3 3",
      stroke: theme === "dark" ? "#334155" : "#e2e8f0",
    };

    switch (currentChartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              {showGrid && <CartesianGrid {...gridProps} />}
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                }}
              />
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={colors[0]} name="Series 1" />
              {data[0]?.value2 !== undefined && (
                <Bar dataKey="value2" fill={colors[1]} name="Series 2" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              {showGrid && <CartesianGrid {...gridProps} />}
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                }}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors[0]}
                name="Series 1"
                strokeWidth={2}
              />
              {data[0]?.value2 !== undefined && (
                <Line
                  type="monotone"
                  dataKey="value2"
                  stroke={colors[1]}
                  name="Series 2"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              {showGrid && <CartesianGrid {...gridProps} />}
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                }}
              />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
                name="Series 1"
              />
              {data[0]?.value2 !== undefined && (
                <Area
                  type="monotone"
                  dataKey="value2"
                  stroke={colors[1]}
                  fill={colors[1]}
                  fillOpacity={0.6}
                  name="Series 2"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid {...gridProps} />
              <PolarAngleAxis dataKey="name" {...axisProps} />
              <PolarRadiusAxis {...axisProps} />
              <Radar
                name="Series 1"
                dataKey="value"
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
              {data[0]?.value2 !== undefined && (
                <Radar
                  name="Series 2"
                  dataKey="value2"
                  stroke={colors[1]}
                  fill={colors[1]}
                  fillOpacity={0.6}
                />
              )}
              {showLegend && <Legend />}
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: "1px solid",
                  borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (editMode && !previewMode) {
    return (
      <Card
        className={cn("flex flex-col", className)}
        style={{ width, height }}
      >
        <Tabs defaultValue="chart" className="flex-1 flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="chart" className="flex-1">
              Chart
            </TabsTrigger>
            <TabsTrigger value="data" className="flex-1">
              Data
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="flex-1 p-4">
            <div className="h-full">{renderChart()}</div>
          </TabsContent>

          <TabsContent value="data" className="flex-1 p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Data Points</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={addDataPoint}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={exportData}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <label htmlFor="csv-upload">
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                      </span>
                    </Button>
                    <input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={importData}
                      aria-label="Import CSV data"
                    />
                  </label>
                </div>
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {data.map((point, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex gap-2 items-center">
                        <Input
                          value={point.name}
                          onChange={(e) =>
                            handleDataUpdate(index, "name", e.target.value)
                          }
                          className="flex-1"
                          placeholder="Label"
                        />
                        <Input
                          type="number"
                          value={point.value}
                          onChange={(e) =>
                            handleDataUpdate(index, "value", e.target.value)
                          }
                          className="w-24"
                          placeholder="Value"
                        />
                        {data[0]?.value2 !== undefined && (
                          <Input
                            type="number"
                            value={point.value2}
                            onChange={(e) =>
                              handleDataUpdate(index, "value2", e.target.value)
                            }
                            className="w-24"
                            placeholder="Value 2"
                          />
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeDataPoint(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <Label>Chart Type</Label>
                <Select
                  value={currentChartType}
                  onValueChange={(v) => setCurrentChartType(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={() => setEditMode(false)}>
                Done Editing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    );
  }

  return (
    <Card
      className={cn("flex flex-col", className)}
      style={{ width, height }}
      onDoubleClick={() => !previewMode && setEditMode(true)}
    >
      {title && (
        <div className="px-4 py-2 border-b">
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
      )}
      <div className="flex-1 p-4">{renderChart()}</div>
      {!previewMode && (
        <div className="px-4 py-2 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Double-click to edit chart
          </p>
        </div>
      )}
    </Card>
  );
}
