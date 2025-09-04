"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Scale, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Target,
  Lightbulb
} from "lucide-react";

interface OverviewSection {
  icon: React.ElementType;
  title: string;
  description: string;
  topics: string[];
}

const courseSections: OverviewSection[] = [
  {
    icon: Zap,
    title: "Renewable Energy Project Development",
    description: "Learn the complete process of developing renewable energy projects in your community",
    topics: [
      "Solar, wind, and microgrid technologies",
      "Project scoping and feasibility studies",
      "Financial analysis and payback calculations",
      "Step-by-step development process"
    ]
  },
  {
    icon: Scale,
    title: "Assess Existing Regulatory Framework",
    description: "Navigate Ontario's energy regulations with confidence",
    topics: [
      "Understanding IESO programs",
      "Net metering regulations",
      "Grid connection requirements",
      "Indigenous energy rights and opportunities"
    ]
  },
  {
    icon: Users,
    title: "Benefits to Communities",
    description: "Discover how clean energy transforms Indigenous communities",
    topics: [
      "Energy independence and sovereignty",
      "Cost savings and revenue generation",
      "Local job creation and skills development",
      "Environmental stewardship"
    ]
  },
  {
    icon: Lightbulb,
    title: "IEX SuperGrid Vision",
    description: "Be part of the Indigenous-led energy future",
    topics: [
      "Cross-provincial energy sharing",
      "Community-to-community connections",
      "Building the SuperGrid network",
      "Your role in the energy transition"
    ]
  }
];

export function CourseOverview({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            How to Use This Course
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Your complete guide to developing renewable energy projects in Indigenous communities
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Objectives */}
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              What You'll Learn
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Develop a Community Energy Plan",
                "Navigate funding opportunities",
                "Design and size solar projects",
                "Understand regulatory requirements",
                "Calculate financial returns",
                "Build strategic partnerships",
                "Join the IEX SuperGrid",
                "Lead your community's energy transition"
              ].map((objective, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Sections */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Course Structure</h3>
            <div className="grid gap-4">
              {courseSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{section.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {section.description}
                        </p>
                        <div className="space-y-1">
                          {section.topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                              <span className="text-sm">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to Navigate */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <h4 className="font-semibold mb-3">How to Navigate the Course</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge className="mt-0.5">1</Badge>
                <span>Follow the modules in order for the best learning experience</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="mt-0.5">2</Badge>
                <span>Complete interactive activities to reinforce your learning</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="mt-0.5">3</Badge>
                <span>Use the sidebar navigation to review previous content</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="mt-0.5">4</Badge>
                <span>Take the final quiz to test your knowledge</span>
              </div>
            </div>
          </div>

          {/* Time Commitment */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Estimated Time to Complete</h4>
              <p className="text-sm text-muted-foreground">
                12 hours • Self-paced • Certificate upon completion
              </p>
            </div>
            <Button onClick={onContinue} size="lg">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
