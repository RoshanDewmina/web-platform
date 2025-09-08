"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { QuizQuestion } from "@/types/unified-content";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  passingScore?: number;
  showFeedback?: boolean;
  randomizeQuestions?: boolean;
  maxAttempts?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

interface Answer {
  questionId: string;
  answer: string | number | boolean | string[];
  isCorrect?: boolean;
}

export default function InteractiveQuiz({
  questions: initialQuestions,
  passingScore = 70,
  showFeedback = true,
  randomizeQuestions = false,
  maxAttempts,
  onComplete,
}: InteractiveQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>("");

  // Initialize questions
  useEffect(() => {
    const questionsToUse = randomizeQuestions 
      ? [...initialQuestions].sort(() => Math.random() - 0.5)
      : initialQuestions;
    setQuestions(questionsToUse);
  }, [initialQuestions, randomizeQuestions]);

  const currentQ = questions[currentQuestion];
  if (!currentQ) return null;

  const handleAnswer = () => {
    if (!selectedAnswer) return;

    let isCorrect = false;
    if (currentQ.type === "multiple_choice" || currentQ.type === "true_false") {
      isCorrect = selectedAnswer === String(currentQ.correctAnswer);
    } else if (currentQ.type === "short_answer" && typeof selectedAnswer === "string") {
      isCorrect = selectedAnswer.toLowerCase().trim() === String(currentQ.correctAnswer).toLowerCase().trim();
    }

    const newAnswer: Answer = {
      questionId: currentQ.id,
      answer: selectedAnswer,
      isCorrect,
    };

    setAnswers([...answers.filter(a => a.questionId !== currentQ.id), newAnswer]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const score = calculateScore();
    const passed = score >= passingScore;
    setShowResults(true);
    setAttempts(attempts + 1);
    
    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const calculateScore = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a) => {
      const question = questions.find(q => q.id === a.questionId);
      return sum + (a.isCorrect ? (question?.points || 1) : 0);
    }, 0);
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleRetry = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResults(false);
    
    if (randomizeQuestions) {
      setQuestions([...questions].sort(() => Math.random() - 0.5));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1].id);
      setSelectedAnswer(prevAnswer ? String(prevAnswer.answer) : "");
    }
  };

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;

    return (
      <Card className="my-6">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {passed ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Quiz Passed!
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                Quiz Failed
              </>
            )}
          </CardTitle>
          <CardDescription>
            Your score: {score}% (Passing score: {passingScore}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFeedback && (
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const answer = answers.find(a => a.questionId === q.id);
                return (
                  <div key={q.id} className="border rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      {answer?.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {idx + 1}. {q.question}
                        </p>
                        {!answer?.isCorrect && q.explanation && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {(!maxAttempts || attempts < maxAttempts) && (
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQ.points} point{currentQ.points !== 1 ? "s" : ""}
          </span>
        </div>
        <Progress value={(currentQuestion / questions.length) * 100} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{currentQ.question}</p>
          {currentQ.hint && (
            <p className="text-sm text-muted-foreground mt-1">Hint: {currentQ.hint}</p>
          )}
        </div>

        {currentQ.type === "multiple_choice" && currentQ.options && (
          <RadioGroup value={typeof selectedAnswer === "string" ? selectedAnswer : ""} onValueChange={setSelectedAnswer}>
            {currentQ.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQ.type === "true_false" && (
          <RadioGroup value={typeof selectedAnswer === "string" ? selectedAnswer : ""} onValueChange={setSelectedAnswer}>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        )}

        {currentQ.type === "short_answer" && (
          <Input
            type="text"
            placeholder="Type your answer..."
            value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAnswer()}
          />
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleAnswer}
            disabled={!selectedAnswer}
            className="flex-1"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
