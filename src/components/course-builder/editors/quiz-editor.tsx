'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Plus, Trash, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface QuizEditorProps {
  content: any;
  onChange: (content: any) => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function QuizEditor({ content, onChange }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(
    content?.questions || []
  );

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    };
    const updated = [...questions, newQuestion];
    setQuestions(updated);
    onChange({ questions: updated });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, ...updates } : q
    );
    setQuestions(updated);
    onChange({ questions: updated });
  };

  const deleteQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    onChange({ questions: updated });
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  if (questions.length === 0) {
    return (
      <Card className='p-8 border-dashed'>
        <div className='text-center'>
          <CheckCircle className='h-12 w-12 mx-auto mb-4 text-muted-foreground/50' />
          <h3 className='text-sm font-medium mb-2'>Create a quiz</h3>
          <p className='text-xs text-muted-foreground mb-4'>
            Add questions to test learner knowledge
          </p>
          <Button onClick={addQuestion}>
            <Plus className='h-4 w-4 mr-2' />
            Add First Question
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      {questions.map((question, qIndex) => (
        <Card key={question.id} className='p-4'>
          <div className='space-y-4'>
            <div className='flex items-start justify-between'>
              <h4 className='font-medium'>Question {qIndex + 1}</h4>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => deleteQuestion(question.id)}
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>

            <div className='space-y-2'>
              <Label>Question Text</Label>
              <Textarea
                value={question.question}
                onChange={(e) =>
                  updateQuestion(question.id, { question: e.target.value })
                }
                placeholder='Enter your question...'
              />
            </div>

            <div className='space-y-2'>
              <Label>Answer Options</Label>
              <RadioGroup
                value={question.correctAnswer.toString()}
                onValueChange={(value) =>
                  updateQuestion(question.id, { correctAnswer: parseInt(value) })
                }
              >
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className='flex items-center gap-2'>
                    <RadioGroupItem value={oIndex.toString()} />
                    <Input
                      value={option}
                      onChange={(e) =>
                        updateOption(question.id, oIndex, e.target.value)
                      }
                      placeholder={`Option ${oIndex + 1}`}
                      className='flex-1'
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className='space-y-2'>
              <Label>Explanation (optional)</Label>
              <Textarea
                value={question.explanation || ''}
                onChange={(e) =>
                  updateQuestion(question.id, { explanation: e.target.value })
                }
                placeholder='Explain the correct answer...'
              />
            </div>
          </div>
        </Card>
      ))}

      <Button onClick={addQuestion} variant='outline' className='w-full'>
        <Plus className='h-4 w-4 mr-2' />
        Add Another Question
      </Button>
    </div>
  );
}
