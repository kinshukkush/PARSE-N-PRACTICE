import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Send, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from '@/components/QuestionCard';
import { useTestStore } from '@/hooks/useTestStore';
import { useToast } from '@/hooks/use-toast';

export default function Test() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentTest,
    userAnswers,
    currentQuestionIndex,
    isTestStarted,
    answerQuestion,
    goToQuestion,
    submitTest,
    shuffleQuestions,
    startTest,
    getAnswerForQuestion,
    getProgress
  } = useTestStore();

  useEffect(() => {
    if (!currentTest) {
      navigate('/');
      return;
    }

    if (!isTestStarted) {
      startTest();
    }
  }, [currentTest, isTestStarted, navigate, startTest]);

  if (!currentTest || !isTestStarted) {
    return null;
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const progress = getProgress();
  const canGoNext = currentQuestionIndex < currentTest.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;

  const handleAnswerSelect = (selectedIndex: number, selectedOption: string) => {
    answerQuestion(currentQuestion.id, selectedIndex, selectedOption);
  };

  const handleNext = () => {
    if (canGoNext) {
      goToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      goToQuestion(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (userAnswers.length < currentTest.questions.length) {
      toast({
        title: "Incomplete test",
        description: `You have answered ${userAnswers.length} out of ${currentTest.questions.length} questions. Submit anyway?`,
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              submitTest();
              navigate('/result');
            }}
          >
            Submit Anyway
          </Button>
        ),
      });
      return;
    }

    submitTest();
    navigate('/result');
  };

  const handleShuffle = () => {
    shuffleQuestions();
    toast({
      title: "Questions shuffled",
      description: "The question order has been randomized",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-gradient">
                {currentTest.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShuffle}
                  className="flex items-center gap-2"
                >
                  <Shuffle className="h-4 w-4" />
                  Shuffle
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress: {progress.answered}/{progress.total} answered</span>
                <span>{progress.percentage}% complete</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={currentTest.questions.length}
          userAnswer={getAnswerForQuestion(currentQuestion.id)}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrev}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentTest.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      index === currentQuestionIndex 
                        ? 'default' 
                        : getAnswerForQuestion(currentTest.questions[index].id)
                          ? 'success'
                          : 'outline'
                    }
                    size="sm"
                    className="w-10 h-10"
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              {canGoNext ? (
                <Button
                  variant="default"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Test
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}