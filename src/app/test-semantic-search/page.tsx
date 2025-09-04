"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Sparkles,
  Database,
  Zap,
  TrendingUp,
  FileText,
  Image,
  Code,
  BookOpen,
  Layers,
  Brain,
  Target,
  BarChart3,
} from "lucide-react";
import { SearchInterface } from "@/components/search/search-interface";
import { SearchResult } from "@/lib/semantic-search-simple";
import { toast } from "sonner";

export default function TestSemanticSearchPage() {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    averageResponseTime: 0,
    topQueries: [] as string[],
  });

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    toast.success(
      `Selected: ${result.payload.title || result.payload.name || result.id}`
    );
  };

  const handleSearchComplete = () => {
    setSearchStats((prev) => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
    }));
  };

  // Sample search suggestions
  const searchSuggestions = [
    "interactive dashboard components",
    "modern slide templates",
    "data visualization charts",
    "educational course materials",
    "professional presentation layouts",
    "responsive design patterns",
    "animated content blocks",
    "user interface elements",
    "business analytics widgets",
    "creative design assets",
  ];

  const quickSearchCategories = [
    {
      name: "Components",
      icon: Code,
      queries: ["counter", "timer", "progress bar", "calculator"],
      color: "bg-blue-500",
    },
    {
      name: "Templates",
      icon: FileText,
      queries: ["presentation", "dashboard", "report", "portfolio"],
      color: "bg-green-500",
    },
    {
      name: "Assets",
      icon: Image,
      queries: ["icons", "illustrations", "photos", "videos"],
      color: "bg-purple-500",
    },
    {
      name: "Courses",
      icon: BookOpen,
      queries: ["tutorial", "workshop", "training", "lesson"],
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Semantic Search System</h1>
                  <p className="text-muted-foreground">
                    AI-powered content discovery and search
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Phase 4
              </Badge>
              <Badge variant="default" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger
              value="suggestions"
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Main Search Interface */}
            <SearchInterface
              onResultSelect={handleResultSelect}
              onSearchComplete={handleSearchComplete}
            />

            {/* Selected Result Details */}
            {selectedResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Selected Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedResult.payload.title ||
                          selectedResult.payload.name ||
                          selectedResult.id}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedResult.payload.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {Math.round(selectedResult.score * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Match Score
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedResult.payload.type || "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Type
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedResult.payload.category || "General"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Category
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">
                          {selectedResult.payload.tags?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tags
                        </div>
                      </div>
                    </div>

                    {selectedResult.payload.tags &&
                      selectedResult.payload.tags.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedResult.payload.tags.map(
                              (tag: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Search Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {searchStats.totalSearches}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Searches
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {searchStats.averageResponseTime.toFixed(2)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Response Time
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Queries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Popular Queries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{suggestion}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 100) + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vector Database</span>
                    <Badge variant="default" className="text-xs">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Embedding Service</span>
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Search Index</span>
                    <Badge variant="default" className="text-xs">
                      Optimized
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Search Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickSearchCategories.map((category) => (
                    <div key={category.name} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.queries.map((query, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // This would trigger a search
                              toast.info(`Searching for: ${query}`);
                            }}
                          >
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI-Generated Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Based on your recent activity, here are some personalized
                    search suggestions:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchSuggestions.slice(0, 6).map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => {
                          toast.info(`Searching for: ${suggestion}`);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Search Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      Try These Example Searches
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Experience the power of semantic search with these
                      examples
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Component Searches</h4>
                      <div className="space-y-2">
                        {[
                          "interactive counter",
                          "progress bar",
                          "data chart",
                          "timer component",
                        ].map((query, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              toast.info(`Demo search: ${query}`);
                            }}
                          >
                            <Code className="h-4 w-4 mr-2" />
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Content Searches</h4>
                      <div className="space-y-2">
                        {[
                          "presentation template",
                          "educational content",
                          "business dashboard",
                          "creative design",
                        ].map((query, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => {
                              toast.info(`Demo search: ${query}`);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <h4 className="font-medium mb-2">
                      Advanced Search Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <Brain className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">
                          Semantic Understanding
                        </div>
                        <div className="text-muted-foreground">
                          Understands context and meaning
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Smart Filtering</div>
                        <div className="text-muted-foreground">
                          Filter by type, category, tags
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Relevance Scoring</div>
                        <div className="text-muted-foreground">
                          AI-powered relevance ranking
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
