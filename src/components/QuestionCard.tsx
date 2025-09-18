import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/parser';
import { UserAnswer } from '@/hooks/useTestStore';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: UserAnswer;
  onAnswerSelect?: (selectedIndex: number, selectedOption: string) => void;
  showCorrectAnswer?: boolean;
  isReviewMode?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerSelect,
  showCorrectAnswer = false,
  isReviewMode = false
}: QuestionCardProps) {
  
  const getOptionVariant = (optionIndex: number) => {
    if (!showCorrectAnswer && !isReviewMode) {
      return userAnswer?.selectedIndex === optionIndex ? 'quiz-selected' : 'quiz';
    }

    // Review mode - show correct/incorrect
    if (showCorrectAnswer) {
      const isCorrectAnswer = optionIndex === question.answerIndex;
      const isUserSelection = userAnswer?.selectedIndex === optionIndex;

      if (isCorrectAnswer) {
        return 'quiz-correct';
      } else if (isUserSelection && !isCorrectAnswer) {
        return 'quiz-incorrect';
      } else {
        return 'quiz';
      }
    }

    return userAnswer?.selectedIndex === optionIndex ? 'quiz-selected' : 'quiz';
  };

  const getStatusBadge = () => {
    if (!showCorrectAnswer || !userAnswer) return null;

    const isCorrect = userAnswer.selectedIndex === question.answerIndex;
    return (
      <Badge variant={isCorrect ? "default" : "destructive"} className="ml-auto">
        {isCorrect ? "Correct" : "Incorrect"}
      </Badge>
    );
  };

  return (
    <Card className="w-full transition-smooth hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          {getStatusBadge()}
        </div>
        {!showCorrectAnswer && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-smooth"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="text-lg font-medium leading-relaxed">
          {question.question}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const variant = getOptionVariant(index);
            
            return (
              <Button
                key={index}
                variant={variant}
                className="w-full justify-start text-left p-4 h-auto min-h-[60px] text-wrap"
                onClick={() => !isReviewMode && onAnswerSelect?.(index, option)}
                disabled={isReviewMode}
              >
                <span className="font-semibold mr-3 flex-shrink-0">
                  {optionLetter}.
                </span>
                <span className="flex-1">{option}</span>
              </Button>
            );
          })}
        </div>

        {/* Show correct answer in review mode */}
        {showCorrectAnswer && (
          <div className="bg-success-light border border-success-border rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-success flex-shrink-0">
                Correct Answer:
              </span>
              <span className="text-success">
                {String.fromCharCode(65 + question.answerIndex)}. {question.answer}
              </span>
            </div>
            {userAnswer && userAnswer.selectedIndex !== question.answerIndex && (
              <div className="flex items-start gap-2 mt-2">
                <span className="font-semibold text-error flex-shrink-0">
                  Your Answer:
                </span>
                <span className="text-error">
                  {String.fromCharCode(65 + userAnswer.selectedIndex)}. {userAnswer.selectedOption}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}