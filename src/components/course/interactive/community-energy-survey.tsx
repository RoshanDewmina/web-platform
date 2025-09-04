"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface SurveyQuestion {
  id: string;
  question: string;
  type: "radio" | "text";
  options?: string[];
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: "q1",
    question: "What is your community's top energy priority?",
    type: "radio",
    options: [
      "Reducing energy costs",
      "Energy independence",
      "Environmental sustainability",
      "Economic development",
      "All of the above"
    ]
  },
  {
    id: "q2",
    question: "What are your main energy challenges?",
    type: "radio",
    options: [
      "High electricity bills",
      "Frequent power outages",
      "Diesel dependency",
      "Aging infrastructure",
      "Limited capacity for growth"
    ]
  },
  {
    id: "q3",
    question: "How important is community ownership of energy projects?",
    type: "radio",
    options: [
      "Very important",
      "Important",
      "Somewhat important",
      "Not important"
    ]
  },
  {
    id: "q4",
    question: "What renewable energy sources are you most interested in?",
    type: "radio",
    options: [
      "Solar",
      "Wind",
      "Hydro",
      "Biomass",
      "Combination of sources"
    ]
  },
  {
    id: "q5",
    question: "Describe your community's energy vision in your own words:",
    type: "text"
  }
];

export function CommunityEnergySurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [surveyQuestions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canProceed = answers[surveyQuestions[currentQuestion].id];

  if (isComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Survey Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Thank you for completing the Community Energy Survey.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="font-semibold mb-2">Your Responses Summary:</h3>
              <ul className="space-y-2 text-sm">
                <li>• Top Priority: {answers.q1}</li>
                <li>• Main Challenge: {answers.q2}</li>
                <li>• Community Ownership: {answers.q3}</li>
                <li>• Preferred Energy Source: {answers.q4}</li>
              </ul>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <h3 className="font-semibold mb-2">Next Steps:</h3>
              <p className="text-sm">
                Use these insights to guide your community energy planning process. 
                Consider sharing these results with elders, youth, and leadership 
                to build consensus around your energy vision.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = surveyQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Community Energy Survey</CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {surveyQuestions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          
          {question.type === "radio" && question.options && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={handleAnswer}
            >
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
          
          {question.type === "text" && (
            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[120px]"
            />
          )}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
          >
            {currentQuestion === surveyQuestions.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
