"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  Zap, 
  TrendingUp,
  Award,
  Lightbulb,
  ArrowRight,
  Battery,
  Sun
} from "lucide-react";

export function TTNIntroduction({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
        <CardHeader>
          <CardTitle className="text-2xl">
            Taykwa Tagamou Nation: Leading the Energy Transition
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            A success story in Indigenous-led renewable energy development
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Community Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Northern Ontario, Treaty 9 Territory
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Oji-Cree First Nation committed to sustainability
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Mission</h4>
              <p className="text-sm">
                "To achieve energy sovereignty while protecting our land for 
                future generations through clean, renewable energy development."
              </p>
            </div>
          </div>

          {/* Energy Project Stats */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 rounded-lg">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sun className="h-6 w-6 text-orange-500" />
              TTN Solar Energy Project
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">345 kW</div>
                <p className="text-sm text-muted-foreground">Solar Capacity</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">38 kWh</div>
                <p className="text-sm text-muted-foreground">Battery Storage</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">Net Zero</div>
                <p className="text-sm text-muted-foreground">Target by 2030</p>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Key Achievements
            </h3>
            <div className="grid gap-3">
              {[
                {
                  icon: Zap,
                  title: "Energy Independence",
                  description: "Reduced reliance on grid power and lowered energy costs for community buildings"
                },
                {
                  icon: TrendingUp,
                  title: "Economic Development",
                  description: "Created local jobs and training opportunities in renewable energy sector"
                },
                {
                  icon: Battery,
                  title: "Resilience & Storage",
                  description: "Battery storage ensures power security during outages and peak demand"
                },
                {
                  icon: Lightbulb,
                  title: "IEX SuperGrid Pioneer",
                  description: "Leading the development of the Indigenous Energy Exchange SuperGrid initiative"
                }
              ].map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Factors */}
          <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <h4 className="font-semibold mb-3">Success Factors</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Strong leadership and community support",
                "Strategic partnerships and collaboration",
                "Comprehensive Community Energy Plan",
                "Phased approach to development",
                "Focus on capacity building",
                "Long-term vision for energy sovereignty"
              ].map((factor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
            <h3 className="font-semibold text-lg mb-2">
              Your Community Can Do This Too!
            </h3>
            <p className="text-muted-foreground mb-4">
              Learn from TTN's experience and create your own renewable energy success story
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="secondary">Community-Led</Badge>
              <Badge variant="secondary">Sustainable</Badge>
              <Badge variant="secondary">Economically Viable</Badge>
              <Badge variant="secondary">Culturally Appropriate</Badge>
            </div>
            <Button onClick={onContinue} size="lg" className="w-full md:w-auto">
              Begin Your Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
