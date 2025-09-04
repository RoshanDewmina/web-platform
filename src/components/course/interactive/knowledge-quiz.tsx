"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Award } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  module: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is Canada's target for emissions reduction by 2030?",
    options: [
      "20-30% from 2005 levels",
      "40-45% from 2005 levels",
      "50-60% from 2005 levels",
      "Net-zero emissions"
    ],
    correctAnswer: 1,
    explanation: "Canada has committed to reducing emissions by 40-45% from 2005 levels by 2030 as part of the 2030 Emissions Reduction Plan.",
    module: "Module 1"
  },
  {
    id: "q2",
    question: "Which of the following is NOT a benefit of clean energy transition for Indigenous communities?",
    options: [
      "Reduced energy bills",
      "Jobs and training for youth",
      "Increased dependency on external providers",
      "Energy independence and self-determination"
    ],
    correctAnswer: 2,
    explanation: "Clean energy transition actually reduces dependency on external providers, not increases it. It promotes energy independence and self-determination.",
    module: "Module 1"
  },
  {
    id: "q3",
    question: "What does CEP stand for?",
    options: [
      "Clean Energy Project",
      "Community Energy Plan",
      "Carbon Emission Protocol",
      "Central Electricity Program"
    ],
    correctAnswer: 1,
    explanation: "CEP stands for Community Energy Plan - a strategic roadmap for a community's energy future.",
    module: "Module 1"
  },
  {
    id: "q4",
    question: "In Ontario, which organization manages the electricity system and runs energy programs?",
    options: [
      "Ontario Energy Board (OEB)",
      "Hydro One",
      "Independent Electricity System Operator (IESO)",
      "Local Distribution Companies (LDCs)"
    ],
    correctAnswer: 2,
    explanation: "The IESO (Independent Electricity System Operator) manages Ontario's electricity system and runs various energy programs.",
    module: "Module 1"
  },
  {
    id: "q5",
    question: "What is the maximum funding available through IESO's Indigenous Energy Support Program for energy planning?",
    options: [
      "$50,000",
      "$100,000",
      "$135,000",
      "$200,000"
    ],
    correctAnswer: 2,
    explanation: "IESO's Indigenous Energy Support Program offers up to $135,000 per application for Energy Resilience & Monitoring.",
    module: "Module 1"
  },
  {
    id: "q6",
    question: "Which net metering option allows multiple customers to share benefits from a single project?",
    options: [
      "Standard Net Metering",
      "Virtual Net Metering",
      "Community Net Metering",
      "Gross Metering"
    ],
    correctAnswer: 2,
    explanation: "Community Net Metering allows multiple customers to share the benefits of a single renewable energy project.",
    module: "Module 1"
  },
  {
    id: "q7",
    question: "What are the five phases of project development?",
    options: [
      "Planning, Design, Build, Test, Launch",
      "Concept, Feasibility, Financing, EPC, Operations",
      "Research, Development, Implementation, Review, Maintenance",
      "Initiation, Planning, Execution, Monitoring, Closing"
    ],
    correctAnswer: 1,
    explanation: "The five phases are: Concept, Feasibility, Financing, EPC (Engineering, Procurement, Construction), and Operations.",
    module: "Module 1"
  },
  {
    id: "q8",
    question: "What does the IEX SuperGrid vision aim to create?",
    options: [
      "A provincial electricity grid",
      "A municipal power network",
      "An Indigenous-led interprovincial clean energy network",
      "A connection to the US power grid"
    ],
    correctAnswer: 2,
    explanation: "The IEX SuperGrid vision aims to create an Indigenous-led interprovincial clean energy network connecting communities across provinces.",
    module: "Module 4"
  }
];

export function KnowledgeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    setAnswers({ ...answers, [question.id]: isCorrect });
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const percentage = Math.round((score / quizQuestions.length) * 100);

  if (quizComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {percentage}%
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {quizQuestions.length} questions correct
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Performance by Module:</h3>
            <div className="space-y-2">
              {["Module 1", "Module 4"].map(module => {
                const moduleQuestions = quizQuestions.filter(q => q.module === module);
                const moduleCorrect = moduleQuestions.filter(q => answers[q.id]).length;
                const modulePercentage = Math.round((moduleCorrect / moduleQuestions.length) * 100);
                
                return (
                  <div key={module} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <span className="font-medium">{module}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={modulePercentage} className="w-24" />
                      <span className="text-sm font-medium">{modulePercentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <p className="font-semibold mb-2">
              {percentage >= 80 ? "Excellent work!" : percentage >= 60 ? "Good job!" : "Keep learning!"}
            </p>
            <p className="text-sm text-muted-foreground">
              {percentage >= 80 
                ? "You have a strong understanding of community renewable energy projects."
                : percentage >= 60
                ? "You have a good grasp of the concepts. Review the areas you missed."
                : "Consider reviewing the course materials and trying again."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Knowledge Check Quiz</CardTitle>
        <Progress value={progress} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showResult}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className={`cursor-pointer flex-1 ${
                        showResult && index === question.correctAnswer
                          ? "text-green-600 font-semibold"
                          : showResult && index === selectedAnswer && index !== question.correctAnswer
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {option}
                    </Label>
                  </div>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle2 className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        
        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer
              ? "bg-green-50 dark:bg-green-950"
              : "bg-red-50 dark:bg-red-950"
          }`}>
            <p className="font-semibold mb-1">
              {selectedAnswer === question.correctAnswer ? "Correct!" : "Not quite right."}
            </p>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          {!showResult ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                  }
                }}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            </>
          ) : (
            <Button onClick={handleNext} className="ml-auto">
              {currentQuestion === quizQuestions.length - 1 ? "See Results" : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
