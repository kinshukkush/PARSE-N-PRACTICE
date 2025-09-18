import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Home, Download, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from '@/components/QuestionCard';
import { useTestStore } from '@/hooks/useTestStore';
import { exportTestAsJSON } from '@/lib/parser';
import { useToast } from '@/hooks/use-toast';

export default function Result() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    testResult,
    currentTest,
    resetTest,
    getAnswerForQuestion
  } = useTestStore();

  if (!testResult || !currentTest) {
    navigate('/');
    return null;
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-primary';
    return 'text-error';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad, keep practicing! 📚';
    return 'Keep studying and try again! 💪';
  };

  const handleRetakeTest = () => {
    resetTest();
    navigate('/test');
  };

  const handleNewTest = () => {
    resetTest();
    navigate('/');
  };

  const handleExportTest = () => {
    try {
      const jsonData = exportTestAsJSON(currentTest);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `practice-test-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Test exported",
        description: "The test has been exported as JSON file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the test",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl text-gradient mb-2">
              Test Completed!
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              {getScoreMessage(testResult.percentage)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(testResult.percentage)}`}>
                  {testResult.score}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">
                  {testResult.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(testResult.percentage)}`}>
                  {testResult.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={testResult.percentage} className="h-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {testResult.score} Correct
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-error" />
                  {testResult.totalQuestions - testResult.score} Incorrect
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="hero"
                onClick={handleRetakeTest}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Test
              </Button>
              <Button
                variant="outline"
                onClick={handleNewTest}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                New Test
              </Button>
              <Button
                variant="secondary"
                onClick={handleExportTest}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Review Your Answers
                <Badge variant="outline">{testResult.questions.length} Questions</Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          {testResult.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={testResult.questions.length}
              userAnswer={getAnswerForQuestion(question.id)}
              showCorrectAnswer={true}
              isReviewMode={true}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center gap-4">
              <Button
                variant="default"
                onClick={handleRetakeTest}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Take Again
              </Button>
              <Button
                variant="outline"
                onClick={handleNewTest}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Create New Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}