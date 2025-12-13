import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Download, 
  CheckCircle, 
  XCircle,
  Award,
  Target,
  Clock,
  TrendingUp,
  Share,
  BookOpen,
  Zap,
  Star,
  Medal,
  Brain,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  
  const {
    testResult,
    currentTest,
    resetTest,
    getAnswerForQuestion
  } = useTestStore();

  // Animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 600),
      setTimeout(() => setAnimationPhase(3), 900),
    ];

    // Trigger confetti for high scores
    if (testResult && testResult.percentage >= 80) {
      setTimeout(() => setConfettiActive(true), 1000);
      setTimeout(() => setConfettiActive(false), 4000);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [testResult]);

  if (!testResult || !currentTest) {
    navigate('/');
    return null;
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-blue-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (percentage: number) => {
    if (percentage >= 90) return 'from-emerald-500 to-green-500';
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 70) return 'from-blue-500 to-cyan-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 95) return { message: 'Outstanding Performance! 🏆', emoji: '🔥' };
    if (percentage >= 90) return { message: 'Excellent work! 🎉', emoji: '⭐' };
    if (percentage >= 80) return { message: 'Great job! 👏', emoji: '✨' };
    if (percentage >= 70) return { message: 'Good work! 👍', emoji: '💫' };
    if (percentage >= 60) return { message: 'Not bad, keep practicing! 📚', emoji: '📈' };
    return { message: 'Keep studying and try again! 💪', emoji: '🎯' };
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 95) return { text: 'MASTER', color: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
    if (percentage >= 90) return { text: 'EXPERT', color: 'bg-gradient-to-r from-emerald-400 to-green-500' };
    if (percentage >= 80) return { text: 'PROFICIENT', color: 'bg-gradient-to-r from-blue-400 to-cyan-500' };
    if (percentage >= 70) return { text: 'COMPETENT', color: 'bg-gradient-to-r from-purple-400 to-pink-500' };
    if (percentage >= 60) return { text: 'DEVELOPING', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500' };
    return { text: 'NEEDS PRACTICE', color: 'bg-gradient-to-r from-red-400 to-red-500' };
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
        title: "Test exported successfully! 📁",
        description: "Your test has been downloaded as a JSON file",
      });
    } catch (error) {
      toast({
        title: "Export failed ❌",
        description: "There was an error exporting the test",
        variant: "destructive",
      });
    }
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Practice Test Results',
          text: `I scored ${testResult.percentage}% (${testResult.score}/${testResult.totalQuestions}) on my practice test!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fall back to clipboard
        navigator.clipboard.writeText(
          `I scored ${testResult.percentage}% (${testResult.score}/${testResult.totalQuestions}) on my practice test!`
        );
        toast({
          title: "Results copied to clipboard! 📋",
          description: "Share your achievement with others",
        });
      }
    } else {
      navigator.clipboard.writeText(
        `I scored ${testResult.percentage}% (${testResult.score}/${testResult.totalQuestions}) on my practice test!`
      );
      toast({
        title: "Results copied to clipboard! 📋",
        description: "Share your achievement with others",
      });
    }
  };

  const scoreMessage = getScoreMessage(testResult.percentage);
  const performanceBadge = getPerformanceBadge(testResult.percentage);

  // Calculate additional analytics
  const avgTimePerQuestion = testResult.totalTime ? Math.round(testResult.totalTime / testResult.totalQuestions) : 0;
  const accuracy = testResult.percentage;
  const incorrectAnswers = testResult.totalQuestions - testResult.score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      </div>

      {/* Confetti Effect for High Scores */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${getScoreGradient(testResult.percentage)} animate-bounce-gentle`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Results Header */}
        <Card className={`text-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl transform transition-all duration-1000 ${
          animationPhase >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          <CardHeader className="pb-8">
            {/* Trophy and Badge */}
            <div className="flex flex-col items-center space-y-4">
              <div className={`relative p-6 bg-gradient-to-br ${getScoreGradient(testResult.percentage)} rounded-3xl shadow-2xl shadow-purple-500/25 animate-pulse-glow`}>
                <Trophy className="h-20 w-20 text-white" />
                {testResult.percentage >= 90 && (
                  <div className="absolute -top-2 -right-2 animate-bounce-gentle">
                    <Star className="h-8 w-8 text-yellow-300 fill-yellow-300" />
                  </div>
                )}
              </div>
              
              <div className={`${performanceBadge.color} px-6 py-2 rounded-full text-white font-bold text-sm tracking-wider shadow-lg`}>
                {performanceBadge.text}
              </div>
            </div>

            <CardTitle className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Test Completed!
            </CardTitle>
            
            <div className="flex items-center justify-center space-x-2 text-xl text-gray-300">
              <span>{scoreMessage.message}</span>
              <span className="text-2xl animate-bounce-gentle">{scoreMessage.emoji}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Main Score Display */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-600/30 hover:scale-105 transition-transform duration-300">
                  <div className={`text-5xl lg:text-6xl font-bold ${getScoreColor(testResult.percentage)} mb-2`}>
                    {testResult.score}
                  </div>
                  <div className="text-gray-400 font-medium">Correct Answers</div>
                  <CheckCircle className={`h-6 w-6 mx-auto mt-2 ${getScoreColor(testResult.percentage)}`} />
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-600/30 hover:scale-105 transition-transform duration-300">
                  <div className="text-5xl lg:text-6xl font-bold text-white mb-2">
                    {testResult.totalQuestions}
                  </div>
                  <div className="text-gray-400 font-medium">Total Questions</div>
                  <BookOpen className="h-6 w-6 text-blue-400 mx-auto mt-2" />
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl backdrop-blur-sm border border-gray-600/30 hover:scale-105 transition-transform duration-300">
                  <div className={`text-5xl lg:text-6xl font-bold ${getScoreColor(testResult.percentage)} mb-2`}>
                    {testResult.percentage}%
                  </div>
                  <div className="text-gray-400 font-medium">Final Score</div>
                  <Target className={`h-6 w-6 mx-auto mt-2 ${getScoreColor(testResult.percentage)}`} />
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="space-y-4">
                <div className="relative">
                  <Progress 
                    value={testResult.percentage} 
                    className={`h-6 bg-gray-700 overflow-hidden rounded-full`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm mix-blend-difference">
                      {testResult.percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    {testResult.score} Correct
                  </span>
                  <span className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    {incorrectAnswers} Incorrect
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className={`transform transition-all duration-1000 delay-500 ${
              animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button
                variant="ghost"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full flex items-center justify-center gap-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
              >
                <BarChart3 className="h-4 w-4" />
                {showAnalytics ? 'Hide' : 'Show'} Detailed Analytics
                {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {showAnalytics && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-700/30">
                    <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-300">
                      {avgTimePerQuestion}s
                    </div>
                    <div className="text-xs text-gray-400">Avg per Question</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-700/30">
                    <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-300">
                      {accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Accuracy Rate</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl border border-green-700/30">
                    <Award className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-300">
                      {testResult.percentage >= 80 ? 'A' : testResult.percentage >= 70 ? 'B' : testResult.percentage >= 60 ? 'C' : 'D'}
                    </div>
                    <div className="text-xs text-gray-400">Letter Grade</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-900/20 to-orange-800/20 rounded-xl border border-orange-700/30">
                    <Brain className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-300">
                      {testResult.score > testResult.totalQuestions / 2 ? 'Good' : 'Review'}
                    </div>
                    <div className="text-xs text-gray-400">Recommendation</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleRetakeTest}
                className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                Retake Test
              </Button>
              
              <Button
                variant="outline"
                onClick={handleNewTest}
                className="px-8 py-4 text-lg font-semibold border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <Home className="mr-2 h-5 w-5" />
                New Test
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleExportTest}
                className="px-8 py-4 text-lg font-semibold bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <Download className="mr-2 h-5 w-5" />
                Export JSON
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleShareResults}
                className="px-8 py-4 text-lg font-semibold text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Share className="mr-2 h-5 w-5" />
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Review Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white">Review Your Answers</span>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-blue-500/10 text-blue-300 border-blue-500/30 px-3 py-1"
                >
                  {testResult.questions.length} Questions
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {testResult.questions.map((question, index) => (
              <div
                key={question.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                                <QuestionCard
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={testResult.questions.length}
                  userAnswer={getAnswerForQuestion(question.id)}
                  showCorrectAnswer={true}
                  isReviewMode={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights Section */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Your Strengths
                </h3>
                <div className="space-y-3">
                  {testResult.percentage >= 80 && (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Star className="h-4 w-4 text-green-400" />
                      <span className="text-green-300">Excellent overall performance</span>
                    </div>
                  )}
                  {testResult.score > testResult.totalQuestions * 0.7 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Brain className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-300">Strong comprehension skills</span>
                    </div>
                  )}
                  {avgTimePerQuestion < 60 && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-300">Quick response time</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {testResult.percentage < 70 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <BookOpen className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-300">Review core concepts</span>
                    </div>
                  )}
                  {incorrectAnswers > testResult.totalQuestions * 0.3 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <RotateCcw className="h-4 w-4 text-orange-400" />
                      <span className="text-orange-300">Practice more questions</span>
                    </div>
                  )}
                  {avgTimePerQuestion > 120 && (
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <Clock className="h-4 w-4 text-red-400" />
                      <span className="text-red-300">Work on time management</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                <Medal className="h-5 w-5" />
                Next Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {testResult.percentage >= 90 ? (
                  <>
                    <div className="flex items-center gap-2 text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      Try more advanced topics
                    </div>
                    <div className="flex items-center gap-2 text-green-300">
                      <CheckCircle className="h-4 w-4" />
                      Share your knowledge with others
                    </div>
                  </>
                ) : testResult.percentage >= 70 ? (
                  <>
                    <div className="flex items-center gap-2 text-blue-300">
                      <Target className="h-4 w-4" />
                      Focus on missed questions
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <RotateCcw className="h-4 w-4" />
                      Retake test in a few days
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-yellow-300">
                      <BookOpen className="h-4 w-4" />
                      Review study materials
                    </div>
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Calendar className="h-4 w-4" />
                      Create a study schedule
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Statistics */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Test Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/20">
                <div className="text-2xl font-bold text-white mb-1">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">Date Taken</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/20">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round((testResult.score / testResult.totalQuestions) * 100) / 100}
                </div>
                <div className="text-sm text-gray-400">Success Ratio</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/20">
                <div className="text-2xl font-bold text-white mb-1">
                  {testResult.totalTime ? `${Math.floor(testResult.totalTime / 60)}:${String(testResult.totalTime % 60).padStart(2, '0')}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-400">Total Time</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/20">
                <div className="text-2xl font-bold text-white mb-1">
                  #{Math.floor(Math.random() * 1000) + 1}
                </div>
                <div className="text-sm text-gray-400">Test ID</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Section */}
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border-purple-500/20 shadow-xl">
          <CardContent className="pt-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Ready for Your Next Challenge?
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Keep practicing to improve your knowledge and boost your confidence. Every test brings you closer to mastery!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={handleRetakeTest}
                  className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  <RotateCcw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                  Practice Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNewTest}
                  className="px-8 py-4 text-lg font-semibold border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Create New Test
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportTest}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/30"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Save Results
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShareResults}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/30"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share Achievement
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/30"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote Section */}
        {testResult.percentage < 70 && (
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border-blue-500/20 shadow-xl animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl">💪</div>
                <blockquote className="text-lg italic text-blue-200">
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </blockquote>
                <cite className="text-sm text-blue-400">- Winston Churchill</cite>
              </div>
            </CardContent>
          </Card>
        )}

        {testResult.percentage >= 90 && (
          <Card className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 backdrop-blur-sm border-emerald-500/20 shadow-xl animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl">🏆</div>
                <blockquote className="text-lg italic text-emerald-200">
                  "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                </blockquote>
                <cite className="text-sm text-emerald-400">- Aristotle</cite>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}