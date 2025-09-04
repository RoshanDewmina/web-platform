"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, 
  Zap, 
  Users, 
  Trees, 
  Wallet, 
  Wifi,
  TrendingUp,
  Home,
  Building,
  Battery
} from "lucide-react";

interface Factor {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

interface ProjectType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  scores: Record<string, number>;
}

const factors: Factor[] = [
  {
    id: "revenue",
    name: "Revenue Generation",
    icon: DollarSign,
    description: "Importance of generating income from the project"
  },
  {
    id: "savings",
    name: "Energy Savings",
    icon: Zap,
    description: "Reducing community energy costs"
  },
  {
    id: "jobs",
    name: "Job Creation",
    icon: Users,
    description: "Creating local employment opportunities"
  },
  {
    id: "land",
    name: "Land Availability",
    icon: Trees,
    description: "Amount of suitable land available"
  },
  {
    id: "budget",
    name: "Budget Availability",
    icon: Wallet,
    description: "Available funding for the project"
  },
  {
    id: "grid",
    name: "Grid Connectivity",
    icon: Wifi,
    description: "Quality of grid connection"
  }
];

const projectTypes: ProjectType[] = [
  {
    id: "net-metering",
    name: "Net Metering",
    icon: Home,
    description: "Offset your own electricity consumption and sell excess back to grid",
    scores: {
      revenue: 2,
      savings: 5,
      jobs: 2,
      land: 3,
      budget: 3,
      grid: 5
    }
  },
  {
    id: "community-net-metering",
    name: "Community Net Metering",
    icon: Building,
    description: "Shared solar project benefiting multiple community members",
    scores: {
      revenue: 3,
      savings: 4,
      jobs: 3,
      land: 4,
      budget: 4,
      grid: 5
    }
  },
  {
    id: "utility-scale",
    name: "Utility Scale",
    icon: TrendingUp,
    description: "Large-scale generation for revenue through power purchase agreements",
    scores: {
      revenue: 5,
      savings: 1,
      jobs: 5,
      land: 5,
      budget: 5,
      grid: 5
    }
  },
  {
    id: "microgrid",
    name: "Microgrid",
    icon: Battery,
    description: "Energy independence with resilience during outages",
    scores: {
      revenue: 2,
      savings: 4,
      jobs: 4,
      land: 3,
      budget: 5,
      grid: 2
    }
  }
];

export function ProjectTypeMatcher() {
  const [priorities, setPriorities] = useState<Record<string, number>>(
    Object.fromEntries(factors.map(f => [f.id, 3]))
  );
  const [showResults, setShowResults] = useState(false);

  const calculateScores = () => {
    return projectTypes.map(project => {
      const score = factors.reduce((total, factor) => {
        return total + (project.scores[factor.id] * priorities[factor.id]);
      }, 0);
      const maxScore = factors.reduce((total, factor) => {
        return total + (5 * priorities[factor.id]);
      }, 0);
      return {
        ...project,
        score,
        percentage: Math.round((score / maxScore) * 100)
      };
    }).sort((a, b) => b.score - a.score);
  };

  const handlePriorityChange = (factorId: string, value: number[]) => {
    setPriorities({ ...priorities, [factorId]: value[0] });
  };

  const results = calculateScores();
  const topMatch = results[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Type Matcher</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate the importance of each factor for your community (1 = Not Important, 5 = Very Important)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {factors.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {factor.name}
                  </Label>
                  <span className="text-sm font-medium text-muted-foreground">
                    {priorities[factor.id]}
                  </span>
                </div>
                <Slider
                  value={[priorities[factor.id]]}
                  onValueChange={(value) => handlePriorityChange(factor.id, value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
            );
          })}
          
          <Button 
            onClick={() => setShowResults(true)} 
            className="w-full"
            size="lg"
          >
            Find Best Project Type
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Project Types</CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on your community priorities
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <div 
                  key={result.id} 
                  className={cn(
                    "p-4 rounded-lg border",
                    index === 0 ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold">{result.name}</h3>
                        {index === 0 && (
                          <Badge className="mt-1" variant="default">
                            Best Match
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{result.percentage}%</div>
                      <div className="text-xs text-muted-foreground">match</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                  
                  {index === 0 && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                      <h4 className="text-sm font-semibold mb-2">Why this matches:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        {factors
                          .filter(f => priorities[f.id] >= 4)
                          .filter(f => result.scores[f.id] >= 4)
                          .map(f => (
                            <li key={f.id}>• Strong in {f.name.toLowerCase()}</li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
