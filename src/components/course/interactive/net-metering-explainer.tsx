"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  DollarSign,
  CheckCircle,
  XCircle
} from "lucide-react";

interface MeteringType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  benefits: string[];
  limitations: string[];
  bestFor: string[];
  diagram: string;
}

const meteringTypes: MeteringType[] = [
  {
    id: "net-metering",
    name: "Net Metering",
    icon: Home,
    description: "Single customer generates their own electricity and feeds excess back to the grid",
    benefits: [
      "Direct reduction in electricity bills",
      "Simple billing arrangement",
      "Proven technology and process",
      "Ideal for single buildings"
    ],
    limitations: [
      "Limited to one meter/customer",
      "Size restrictions (typically <500 kW)",
      "Cannot share with neighbors",
      "Requires suitable roof/land"
    ],
    bestFor: [
      "Individual homes",
      "Community buildings",
      "Small businesses",
      "Band offices"
    ],
    diagram: "Customer → Solar Panels → Meter ↔ Grid"
  },
  {
    id: "virtual-net-metering",
    name: "Virtual Net Metering",
    icon: Building2,
    description: "One customer with multiple meters can allocate generation credits across their accounts",
    benefits: [
      "Optimize across multiple buildings",
      "Centralized solar installation",
      "Flexible credit allocation",
      "Economies of scale"
    ],
    limitations: [
      "Same customer requirement",
      "Complex billing setup",
      "Not available everywhere",
      "Administrative overhead"
    ],
    bestFor: [
      "First Nations with multiple buildings",
      "Schools with multiple facilities",
      "Municipal operations",
      "Large organizations"
    ],
    diagram: "Solar Farm → Credits → Multiple Meters (Same Owner)"
  },
  {
    id: "community-net-metering",
    name: "Community Net Metering",
    icon: Users,
    description: "Multiple customers share the benefits of a single renewable energy project",
    benefits: [
      "Community-wide benefits",
      "Include members without suitable roofs",
      "Larger project economics",
      "Social equity"
    ],
    limitations: [
      "Complex agreements needed",
      "Regulatory barriers in some areas",
      "Credit allocation challenges",
      "Requires strong governance"
    ],
    bestFor: [
      "Entire communities",
      "Housing cooperatives",
      "Mixed residential/commercial",
      "Regional initiatives"
    ],
    diagram: "Community Solar → Credits → Multiple Customers"
  }
];

export function NetMeteringExplainer() {
  const [selectedType, setSelectedType] = useState("net-metering");
  const [showComparison, setShowComparison] = useState(false);

  const currentType = meteringTypes.find(t => t.id === selectedType)!;

  return (
    <div className="space-y-6">
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList className="grid w-full grid-cols-3">
          {meteringTypes.map((type) => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.id} value={type.id} className="space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {meteringTypes.map((type) => {
          const Icon = type.icon;
          return (
            <TabsContent key={type.id} value={type.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    {type.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <div className="font-mono text-sm">{type.diagram}</div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <XCircle className="h-4 w-4" />
                        Limitations
                      </h4>
                      <ul className="space-y-2">
                        {type.limitations.map((limitation, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Best For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {type.bestFor.map((use, index) => (
                        <Badge key={index} variant="secondary">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setShowComparison(!showComparison)}
          variant="outline"
        >
          {showComparison ? "Hide" : "Show"} Comparison Table
        </Button>
      </div>
      
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    <th className="text-center p-2">Net Metering</th>
                    <th className="text-center p-2">Virtual Net</th>
                    <th className="text-center p-2">Community Net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Number of Customers</td>
                    <td className="text-center p-2">1</td>
                    <td className="text-center p-2">1 (multiple meters)</td>
                    <td className="text-center p-2">Multiple</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Complexity</td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="bg-green-50">Low</Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="bg-yellow-50">Medium</Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="bg-orange-50">High</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Community Benefit</td>
                    <td className="text-center p-2">Individual</td>
                    <td className="text-center p-2">Organization</td>
                    <td className="text-center p-2">Whole Community</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Project Size</td>
                    <td className="text-center p-2">Small</td>
                    <td className="text-center p-2">Medium</td>
                    <td className="text-center p-2">Large</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
