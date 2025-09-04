"use client";

import { useState } from "react";
import { useInteractionTracking } from "@/hooks/use-progress-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Building2, 
  Mail, 
  FileText,
  CheckCircle2,
  Home,
  Zap,
  ArrowRight
} from "lucide-react";

interface RegistrationData {
  accountHolderName: string;
  designation: string;
  hydroOneCredentials: string;
  firstNationName: string;
  hasSpecificBuilding: string;
  buildingAddress: string;
  energyConsumption: string;
  email: string;
}

export function RegistrationForm({ onComplete }: { onComplete?: () => void }) {
  const { track } = useInteractionTracking();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>({
    accountHolderName: "",
    designation: "",
    hydroOneCredentials: "",
    firstNationName: "",
    hasSpecificBuilding: "",
    buildingAddress: "",
    energyConsumption: "",
    email: ""
  });
  const [showSampleReport, setShowSampleReport] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    // Track step progression
    track("form_interaction", "registration_step_complete", {
      step: step,
      stepName: getStepName(step),
      data: getStepData(step)
    });

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit form
      setIsSubmitted(true);
      // Track form submission
      track("form_interaction", "registration_submitted", {
        firstNationName: data.firstNationName,
        hasSpecificBuilding: data.hasSpecificBuilding,
        timestamp: new Date().toISOString()
      });
      // In a real app, this would send data to an API
      console.log("Registration data:", data);
    }
  };

  const getStepName = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return "Account Information";
      case 2: return "Green Button Credentials";
      case 3: return "Project Details";
      case 4: return "Contact Information";
      default: return `Step ${stepNumber}`;
    }
  };

  const getStepData = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return { accountHolderName: data.accountHolderName, designation: data.designation };
      case 2: return { hasCredentials: !!data.hydroOneCredentials };
      case 3: return { hasSpecificBuilding: data.hasSpecificBuilding };
      case 4: return { email: data.email };
      default: return {};
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.accountHolderName && data.designation && data.firstNationName;
      case 2:
        return data.hydroOneCredentials;
      case 3:
        return data.hasSpecificBuilding && 
          (data.hasSpecificBuilding === "no" || 
           (data.buildingAddress && data.energyConsumption));
      case 4:
        return data.email;
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Registration Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-lg">
              Thank you for registering, <strong>{data.accountHolderName}</strong>!
            </p>
            <p className="text-muted-foreground">
              We'll send a free PV assessment report to <strong>{data.email}</strong> within 48 hours.
            </p>
          </div>
          
          <div className="p-6 bg-primary/10 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              What's Included in Your PV Report:
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Solar potential analysis for your location</li>
              <li>• Estimated system size recommendations</li>
              <li>• Projected energy savings and payback period</li>
              <li>• Available funding opportunities</li>
              <li>• Next steps for project development</li>
            </ul>
          </div>
          
          <Button 
            onClick={onComplete} 
            className="w-full"
            size="lg"
          >
            Continue to Course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Course Registration</CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of 4
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>
            
            <div>
              <Label htmlFor="name">Account Holder's Name *</Label>
              <Input
                id="name"
                value={data.accountHolderName}
                onChange={(e) => setData({ ...data, accountHolderName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                value={data.designation}
                onChange={(e) => setData({ ...data, designation: e.target.value })}
                placeholder="e.g., Energy Manager, Chief, Councillor"
              />
            </div>
            
            <div>
              <Label htmlFor="nation">First Nation Name *</Label>
              <Input
                id="nation"
                value={data.firstNationName}
                onChange={(e) => setData({ ...data, firstNationName: e.target.value })}
                placeholder="Enter your First Nation name"
              />
            </div>
          </div>
        )}

        {/* Step 2: Utility Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Utility Information</h3>
            </div>
            
            <div>
              <Label htmlFor="hydro-credentials">Green Button Credentials - Hydro One *</Label>
              <Input
                id="hydro-credentials"
                value={data.hydroOneCredentials}
                onChange={(e) => setData({ ...data, hydroOneCredentials: e.target.value })}
                placeholder="Enter your Hydro One account number"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This helps us access your energy usage data for accurate assessments
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm">
                <strong>Need help finding your credentials?</strong><br />
                Your Green Button credentials can be found on your Hydro One bill 
                or by logging into your online account.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Building Information */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Project Planning</h3>
            </div>
            
            <div>
              <Label>Are you planning to develop a solar project for a specific building? *</Label>
              <RadioGroup
                value={data.hasSpecificBuilding}
                onValueChange={(value) => setData({ ...data, hasSpecificBuilding: value })}
              >
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="cursor-pointer">No, exploring options</Label>
                </div>
              </RadioGroup>
            </div>
            
            {data.hasSpecificBuilding === "yes" && (
              <>
                <div>
                  <Label htmlFor="address">Building Address *</Label>
                  <Textarea
                    id="address"
                    value={data.buildingAddress}
                    onChange={(e) => setData({ ...data, buildingAddress: e.target.value })}
                    placeholder="Enter the complete address of the building"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="consumption">
                    Annual Energy Consumption (kWh) *
                  </Label>
                  <Input
                    id="consumption"
                    type="number"
                    value={data.energyConsumption}
                    onChange={(e) => setData({ ...data, energyConsumption: e.target.value })}
                    placeholder="e.g., 120000"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can find this on your annual energy statement
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Contact Information */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-muted-foreground mt-2">
                We'll send your free PV assessment report to this email
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold mb-2">What happens next?</h4>
                <ul className="text-sm space-y-1">
                  <li>• Receive your customized PV report within 48 hours</li>
                  <li>• Get a free consultation call to discuss the findings</li>
                  <li>• Access to funding opportunities and next steps</li>
                </ul>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowSampleReport(!showSampleReport)}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                {showSampleReport ? "Hide" : "View"} Sample PV Report
              </Button>
              
              {showSampleReport && (
                <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                  <h4 className="font-semibold mb-3">Sample PV Report Contents:</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <Badge className="mb-2">Executive Summary</Badge>
                      <p className="text-muted-foreground">
                        Overview of solar potential and key recommendations
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Technical Analysis</Badge>
                      <p className="text-muted-foreground">
                        System sizing, production estimates, and site assessment
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Financial Projections</Badge>
                      <p className="text-muted-foreground">
                        Cost estimates, savings analysis, and payback calculations
                      </p>
                    </div>
                    <div>
                      <Badge className="mb-2">Funding Opportunities</Badge>
                      <p className="text-muted-foreground">
                        Available grants, incentives, and financing options
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 4 ? "Complete Registration" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
