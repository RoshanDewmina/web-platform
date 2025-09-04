"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Edit,
  Save,
  HelpCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "multiple-answer" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points?: number;
}

interface QuizBuilderComponentProps {
  questions?: QuizQuestion[];
  title?: string;
  description?: string;
  passingScore?: number;
  showFeedback?: boolean;
  randomizeQuestions?: boolean;
  width: number;
  height: number;
  previewMode?: boolean;
  className?: string;
  onQuestionsChange?: (questions: QuizQuestion[]) => void;
}

export default function QuizBuilderComponent({
  questions: initialQuestions = [],
  title = "Quiz",
  description,
  passingScore = 70,
  showFeedback = true,
  randomizeQuestions = false,
  width,
  height,
  previewMode = false,
  className,
  onQuestionsChange,
}: QuizBuilderComponentProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<"edit" | "preview" | "take">("edit");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  const addQuestion = (type: QuizQuestion["type"]) => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      type,
      question: "New question",
      options:
        type === "multiple-choice" || type === "multiple-answer"
          ? ["Option 1", "Option 2", "Option 3", "Option 4"]
          : type === "true-false"
          ? ["True", "False"]
          : undefined,
      correctAnswer: type === "multiple-answer" ? [] : "",
      points: 1,
    };

    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setCurrentQuestionIndex(updatedQuestions.length - 1);
    setEditingQuestion(newQuestion.id);

    if (onQuestionsChange) {
      onQuestionsChange(updatedQuestions);
    }
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    setQuestions(updatedQuestions);

    if (onQuestionsChange) {
      onQuestionsChange(updatedQuestions);
    }
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id);
    setQuestions(updatedQuestions);

    if (
      currentQuestionIndex >= updatedQuestions.length &&
      currentQuestionIndex > 0
    ) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }

    if (onQuestionsChange) {
      onQuestionsChange(updatedQuestions);
    }
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;

    questions.forEach((q) => {
      total += q.points || 1;
      const userAnswer = answers[q.id];

      if (q.type === "multiple-answer") {
        const correctSet = new Set(q.correctAnswer as string[]);
        const userSet = new Set((userAnswer as string[]) || []);
        if (
          correctSet.size === userSet.size &&
          [...correctSet].every((item) => userSet.has(item))
        ) {
          correct += q.points || 1;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correct += q.points || 1;
        }
      }
    });

    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (previewMode || quizMode === "take") {
    return (
      <Card
        className={cn("flex flex-col", className)}
        style={{ width, height }}
      >
        {/* Quiz Header */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {!showResults && (
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index === currentQuestionIndex
                        ? "bg-primary"
                        : answers[questions[index]?.id]
                        ? "bg-primary/50"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Content */}
        <ScrollArea className="flex-1 p-4">
          {showResults ? (
            <div className="space-y-4">
              <Card className="p-6 text-center">
                {(() => {
                  const score = calculateScore();
                  const passed = score.percentage >= passingScore;
                  return (
                    <>
                      <div className="mb-4">
                        {passed ? (
                          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                        ) : (
                          <XCircle className="h-16 w-16 mx-auto text-red-500" />
                        )}
                      </div>
                      <h4 className="text-2xl font-bold mb-2">
                        {score.percentage}%
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        You got {score.correct} out of {score.total} points
                      </p>
                      <p
                        className={cn(
                          "font-semibold",
                          passed ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {passed
                          ? "Congratulations! You passed!"
                          : "Keep practicing!"}
                      </p>
                    </>
                  );
                })()}
              </Card>

              {showFeedback && (
                <div className="space-y-3">
                  <h5 className="font-semibold">Review:</h5>
                  {questions.map((q, index) => {
                    const userAnswer = answers[q.id];
                    const isCorrect =
                      q.type === "multiple-answer"
                        ? JSON.stringify(userAnswer?.sort()) ===
                          JSON.stringify((q.correctAnswer as string[]).sort())
                        : userAnswer === q.correctAnswer;

                    return (
                      <Card key={q.id} className="p-3">
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <Check className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {index + 1}. {q.question}
                            </p>
                            {!isCorrect && q.explanation && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {q.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  setShowResults(false);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                }}
              >
                Retake Quiz
              </Button>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium mb-3">
                  {currentQuestion.question}
                </h4>

                {currentQuestion.type === "multiple-choice" && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) =>
                      handleAnswer(currentQuestion.id, value)
                    }
                  >
                    <div className="space-y-2">
                      {currentQuestion.options?.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                        >
                          <RadioGroupItem value={option} />
                          <span className="flex-1">{option}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "true-false" && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) =>
                      handleAnswer(currentQuestion.id, value)
                    }
                  >
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="True" />
                        <span>True</span>
                      </label>
                      <label className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="False" />
                        <span>False</span>
                      </label>
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === "multiple-answer" && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={(answers[currentQuestion.id] || []).includes(
                            option
                          )}
                          onCheckedChange={(checked) => {
                            const current = answers[currentQuestion.id] || [];
                            const updated = checked
                              ? [...current, option]
                              : current.filter((o: string) => o !== option);
                            handleAnswer(currentQuestion.id, updated);
                          }}
                        />
                        <span className="flex-1">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "short-answer" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswer(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer here..."
                    rows={3}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No questions in this quiz</p>
            </div>
          )}
        </ScrollArea>

        {/* Quiz Footer */}
        {!showResults && questions.length > 0 && (
          <div className="p-4 border-t flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={() => setShowResults(true)}>Submit Quiz</Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestionIndex(
                    Math.min(questions.length - 1, currentQuestionIndex + 1)
                  )
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  }

  // Edit Mode
  return (
    <Card className={cn("flex flex-col", className)} style={{ width, height }}>
      <Tabs
        value={quizMode}
        onValueChange={(v) => setQuizMode(v as any)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full">
          <TabsTrigger value="edit" className="flex-1">
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="flex-1 flex flex-col p-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Questions ({questions.length})</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => addQuestion("multiple-choice")}
                  >
                    Multiple Choice
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addQuestion("true-false")}>
                    True/False
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addQuestion("multiple-answer")}
                  >
                    Multiple Answer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addQuestion("short-answer")}>
                    Short Answer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <Card
                    key={q.id}
                    className={cn(
                      "p-3 cursor-pointer",
                      currentQuestionIndex === index && "ring-2 ring-primary"
                    )}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-sm font-medium">
                          {index + 1}. {q.question}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({q.type})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuestion(q.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Note: Added DropdownMenu import at the top
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
