"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  X,
  FileText,
  Image,
  Code,
  BookOpen,
  Layers,
  Star,
  Clock,
  User,
  Tag,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  SearchResult,
  SearchQuery,
  CollectionName,
  COLLECTIONS,
} from "@/lib/semantic-search-simple";
import { cn } from "@/lib/utils";

interface SearchInterfaceProps {
  onResultSelect?: (result: SearchResult) => void;
  onSearchComplete?: () => void;
  className?: string;
  initialQuery?: string;
  defaultCollection?: CollectionName;
}

export function SearchInterface({
  onResultSelect,
  onSearchComplete,
  className,
  initialQuery = "",
  defaultCollection = COLLECTIONS.CONTENT,
}: SearchInterfaceProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionName>(defaultCollection);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Search categories
  const searchCategories = [
    {
      id: COLLECTIONS.CONTENT,
      name: "All Content",
      icon: Layers,
      description: "Search across all content types",
    },
    {
      id: COLLECTIONS.SLIDES,
      name: "Slides",
      icon: FileText,
      description: "Search slide content and layouts",
    },
    {
      id: COLLECTIONS.ASSETS,
      name: "Assets",
      icon: Image,
      description: "Search media files and resources",
    },
    {
      id: COLLECTIONS.COMPONENTS,
      name: "Components",
      icon: Code,
      description: "Search custom components and templates",
    },
    {
      id: COLLECTIONS.COURSES,
      name: "Courses",
      icon: BookOpen,
      description: "Search course content and structure",
    },
  ];

  // Filter options
  const filterOptions = {
    type: ["slide", "image", "video", "component", "course", "document"],
    category: ["education", "business", "technology", "design", "marketing"],
    tags: ["interactive", "responsive", "modern", "professional", "creative"],
  };

  const performSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchQuery: SearchQuery = {
        text: query,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        limit: 20,
      };

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: selectedCollection,
          query: searchQuery,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);

        // Add to search history
        if (!searchHistory.includes(query)) {
          setSearchHistory((prev) => [query, ...prev.slice(0, 9)]);
        }

        // Call search complete callback
        onSearchComplete?.();
      } else {
        console.error("Search failed:", response.statusText);
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCollection, filters, searchHistory]);

  // Auto-search on query change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCollection, filters, performSearch]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getResultIcon = (result: SearchResult) => {
    const type = result.payload.type;
    switch (type) {
      case "slide":
        return <FileText className="h-4 w-4" />;
      case "image":
      case "video":
        return <Image className="h-4 w-4" />;
      case "component":
        return <Code className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Search Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Semantic Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for content, components, assets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
          </div>

          {/* Search Categories */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Search in:</Label>
            <Select
              value={selectedCollection}
              onValueChange={(value: CollectionName) =>
                setSelectedCollection(value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {searchCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Search Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="mt-2 space-y-2">
                    {filterOptions.type.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.type === type}
                          onCheckedChange={(checked) =>
                            handleFilterChange(
                              "type",
                              checked ? type : undefined
                            )
                          }
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="text-sm capitalize"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="mt-2 space-y-2">
                    {filterOptions.category.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category === category}
                          onCheckedChange={(checked) =>
                            handleFilterChange(
                              "category",
                              checked ? category : undefined
                            )
                          }
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm capitalize"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-2 space-y-2">
                    {filterOptions.tags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags?.includes(tag)}
                          onCheckedChange={(checked) => {
                            const currentTags = filters.tags || [];
                            const newTags = checked
                              ? [...currentTags, tag]
                              : currentTags.filter((t: string) => t !== tag);
                            handleFilterChange(
                              "tags",
                              newTags.length > 0 ? newTags : undefined
                            );
                          }}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !query && (
            <div>
              <Label className="text-sm font-medium">Recent Searches</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setQuery(term)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isLoading ? "Searching..." : `Results (${results.length})`}
            </CardTitle>
            {results.length > 0 && (
              <Badge variant="outline">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onResultSelect?.(result)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getResultIcon(result)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium truncate">
                          {result.payload.title ||
                            result.payload.name ||
                            result.id}
                        </h3>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="outline" className="text-xs">
                            {formatScore(result.score)}% match
                          </Badge>
                          {result.payload.type && (
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {result.payload.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {result.payload.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {result.payload.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {result.payload.created_by && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {result.payload.created_by}
                          </div>
                        )}
                        {result.payload.tags &&
                          result.payload.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {result.payload.tags.slice(0, 3).join(", ")}
                            </div>
                          )}
                        {result.payload.created_at && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(
                              result.payload.created_at
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Enter a query to find content, components, and assets
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
