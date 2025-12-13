import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Shuffle, 
  Clock,
  Eye,
  EyeOff,
  Bookmark,
  BookmarkCheck,
  Zap,
  Target,
  Brain,
  AlertCircle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Timer,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QuestionCard } from '@/components/QuestionCard';
import { useTestStore } from '@/hooks/useTestStore';
import { useToast } from '@/hooks/use-toast';

export default function Test() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Timer and UI state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [animationPhase, setAnimationPhase] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  
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

  // Timer effect
  useEffect(() => {
    if (!isPaused && isTestStarted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, isTestStarted]);

  // Animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationPhase(1), 200),
      setTimeout(() => setAnimationPhase(2), 400),
      setTimeout(() => setAnimationPhase(3), 600),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [currentQuestionIndex]);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 text-white">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-lg text-gray-300">Loading your test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const progress = getProgress();
  const canGoNext = currentQuestionIndex < currentTest.questions.length - 1;
  const canGoPrev = currentQuestionIndex > 0;
  const isQuestionAnswered = getAnswerForQuestion(currentQuestion.id);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate average time per question
  const avgTimePerQuestion = currentQuestionIndex > 0 ? Math.round(timeElapsed / (currentQuestionIndex + 1)) : 0;

  const handleAnswerSelect = (selectedIndex: number, selectedOption: string) => {
    answerQuestion(currentQuestion.id, selectedIndex, selectedOption);
    
    // Show success animation
    toast({
      title: "Answer recorded! ✅",
      description: "Your response has been saved",
      duration: 1500,
    });
  };

  const handleNext = () => {
    if (canGoNext) {
      goToQuestion(currentQuestionIndex + 1);
      setAnimationPhase(0);
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      goToQuestion(currentQuestionIndex - 1);
      setAnimationPhase(0);
    }
  };

  const handleSubmit = () => {
    const unanswered = currentTest.questions.length - userAnswers.length;
    
    if (unanswered > 0) {
      toast({
        title: "⚠️ Incomplete Test",
        description: `${unanswered} question(s) remain unanswered. Submit anyway?`,
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                submitTest();
                navigate('/result');
              }}
            >
              Submit Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Go to first unanswered question
                const firstUnanswered = currentTest.questions.findIndex(q => 
                  !getAnswerForQuestion(q.id)
                );
                if (firstUnanswered !== -1) {
                  goToQuestion(firstUnanswered);
                }
              }}
            >
              Review
            </Button>
          </div>
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
      title: "🔀 Questions Shuffled",
      description: "Question order has been randomized for better practice",
    });
  };

  const toggleBookmark = () => {
    const newBookmarks = new Set(bookmarkedQuestions);
    if (newBookmarks.has(currentQuestion.id)) {
      newBookmarks.delete(currentQuestion.id);
      toast({
        title: "Bookmark removed",
        description: "Question unmarked for review",
      });
    } else {
      newBookmarks.add(currentQuestion.id);
      toast({
        title: "Question bookmarked! 🔖",
        description: "Marked for later review",
      });
    }
    setBookmarkedQuestions(newBookmarks);
  };

  const togglePause = () => {
    setPaused(!isPaused);
    toast({
      title: isPaused ? "Test resumed ▶️" : "Test paused ⏸️",
      description: isPaused ? "Timer is now running" : "Take a break, timer stopped",
      duration: 2000,
    });
  };

  const getQuestionStatusIcon = (questionIndex: number) => {
    const question = currentTest.questions[questionIndex];
    const isAnswered = getAnswerForQuestion(question.id);
    const isBookmarked = bookmarkedQuestions.has(question.id);
    
    if (isAnswered && isBookmarked) return <BookmarkCheck className="h-3 w-3" />;
    if (isBookmarked) return <Bookmark className="h-3 w-3" />;
    if (isAnswered) return <CheckCircle2 className="h-3 w-3" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <Card className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl transform transition-all duration-700 ${
          animationPhase >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {currentTest.title}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                    <Target className="h-3 w-3 mr-1" />
                    {currentTest.questions.length} Questions
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {progress.answered} Answered
                  </Badge>
                  {bookmarkedQuestions.size > 0 && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-300 border-yellow-500/30">
                      <Bookmark className="h-3 w-3 mr-1" />
                      {bookmarkedQuestions.size} Bookmarked
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Timer Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                  <Clock className={`h-4 w-4 ${isPaused ? 'text-yellow-400' : 'text-green-400'}`} />
                  <span className="font-mono text-sm font-semibold">{formatTime(timeElapsed)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePause}
                    className="p-1 h-auto hover:bg-gray-600/30"
                  >
                    {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShuffle}
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Shuffle className="h-4 w-4 mr-1" />
                    Shuffle
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFocusMode(!focusMode)}
                    className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-white hover:bg-gray-700/30"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Exit
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Progress Information */}
              <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
                <div className="flex items-center gap-4 text-gray-300">
                  <span>Progress: {progress.answered}/{progress.total} questions</span>
                  <span>•</span>
                  <span>{progress.percentage.toFixed(1)}% complete</span>
                  {avgTimePerQuestion > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {avgTimePerQuestion}s avg
                      </span>
                    </>
                  )}
                </div>
                
                <div className="text-gray-400">
                  Question {currentQuestionIndex + 1} of {currentTest.questions.length}
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <Progress 
                  value={progress.percentage} 
                  className="h-3 bg-gray-700 overflow-hidden"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold mix-blend-difference">
                    {progress.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Question Status Indicators */}
              {!focusMode && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentTest.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestionIndex 
                          ? 'default' 
                          : getAnswerForQuestion(currentTest.questions[index].id)
                            ? 'secondary'
                            : 'outline'
                      }
                      size="sm"
                      className={`relative w-10 h-10 text-xs transition-all duration-200 hover:scale-110 ${
                        index === currentQuestionIndex 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
                          : getAnswerForQuestion(currentTest.questions[index].id)
                            ? 'bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-600/30'
                            : 'border-gray-600/50 text-gray-400 hover:border-gray-500/70'
                      }`}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                      {getQuestionStatusIcon(index) && (
                        <div className="absolute -top-1 -right-1">
                          {getQuestionStatusIcon(index)}
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Section */}
        <div className={`transform transition-all duration-700 delay-200 ${
          animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="relative">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentTest.questions.length}
              userAnswer={getAnswerForQuestion(currentQuestion.id)}
              onAnswerSelect={handleAnswerSelect}
            />
            
            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className={`absolute top-4 right-4 p-2 transition-all duration-300 ${
                bookmarkedQuestions.has(currentQuestion.id)
                  ? 'text-yellow-400 hover:text-yellow-300'
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
                          >
              {bookmarkedQuestions.has(currentQuestion.id) ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Question Insights Panel */}
        {!focusMode && (
          <Card className={`bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border-blue-500/20 shadow-xl transform transition-all duration-700 delay-400 ${
            animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-blue-300 mb-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Quick Stats</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">
                      {Math.round((progress.answered / progress.total) * 100)}%
                    </div>
                    <div className="text-sm text-gray-400">Completion Rate</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-300 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Pace</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">
                      {avgTimePerQuestion > 0 ? `${avgTimePerQuestion}s` : '--'}
                    </div>
                    <div className="text-sm text-gray-400">Per Question</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-purple-300 mb-2">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">Focus</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">
                      {currentTest.questions.length - progress.answered}
                    </div>
                    <div className="text-sm text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hints Panel */}
        {showHints && currentQuestion.explanation && (
          <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm border-yellow-500/20 shadow-xl animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Lightbulb className="h-5 w-5" />
                Hint for Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-200 leading-relaxed">{currentQuestion.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Section */}
        <Card className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-xl transform transition-all duration-700 delay-600 ${
          animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Previous Button */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={!canGoPrev}
                  className="group px-6 py-3 border-gray-600/50 text-gray-300 hover:bg-gray-700/30 hover:border-gray-500/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </Button>

                {/* Question Hint Toggle */}
                {currentQuestion.explanation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {showHints ? 'Hide Hint' : 'Show Hint'}
                  </Button>
                )}
              </div>

              {/* Center Status */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${
                    isQuestionAnswered ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {isQuestionAnswered ? 'Answered' : 'Select Answer'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Question {currentQuestionIndex + 1} of {currentTest.questions.length}
                  </div>
                </div>

                {isQuestionAnswered && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Saved</span>
                  </div>
                )}
              </div>

              {/* Next/Submit Button */}
              <div className="flex items-center gap-4">
                {/* Flag/Review Button */}
                {bookmarkedQuestions.has(currentQuestion.id) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Review Later
                  </Button>
                )}

                {canGoNext ? (
                  <Button
                    onClick={handleNext}
                    className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Ready to submit?</div>
                      <div className="text-xs text-gray-500">
                        {progress.answered}/{progress.total} answered
                      </div>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="group px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 rounded-xl"
                    >
                      <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit Test
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        {!focusMode && (
          <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border-gray-700/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Go to first unanswered question
                    const firstUnanswered = currentTest.questions.findIndex(q => 
                      !getAnswerForQuestion(q.id)
                    );
                    if (firstUnanswered !== -1) {
                      goToQuestion(firstUnanswered);
                    } else {
                      toast({
                        title: "All questions answered! ✅",
                        description: "You can now submit your test",
                      });
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Find Unanswered
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Go to first bookmarked question
                    const bookmarkedArray = Array.from(bookmarkedQuestions);
                    if (bookmarkedArray.length > 0) {
                      const firstBookmarked = currentTest.questions.findIndex(q => 
                        q.id === bookmarkedArray[0]
                      );
                      if (firstBookmarked !== -1) {
                        goToQuestion(firstBookmarked);
                      }
                    } else {
                      toast({
                        title: "No bookmarked questions",
                        description: "Use the bookmark icon to mark questions for review",
                      });
                    }
                  }}
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  disabled={bookmarkedQuestions.size === 0}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Review Bookmarks ({bookmarkedQuestions.size})
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToQuestion(0)}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                  disabled={currentQuestionIndex === 0}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Start Over
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * currentTest.questions.length);
                    goToQuestion(randomIndex);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  <Shuffle className="h-4 w-4 mr-1" />
                  Random Question
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Reminder */}
        {progress.answered > 0 && progress.answered < progress.total && (
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border-green-500/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Great Progress!</span>
                </div>
                <p className="text-green-200">
                  You've answered {progress.answered} out of {progress.total} questions. 
                  Only {progress.total - progress.answered} more to go!
                </p>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-sm text-green-400">
                    {Math.round((progress.answered / progress.total) * 100)}% complete
                  </div>
                  <div className="text-sm text-gray-400">
                    Time: {formatTime(timeElapsed)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Completion Prompt */}
        {progress.answered === progress.total && (
          <Card className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-sm border-emerald-500/30 shadow-2xl animate-pulse-glow">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full shadow-lg">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-emerald-300">
                    All Questions Completed! 🎉
                  </h3>
                  <p className="text-emerald-200 max-w-md mx-auto">
                    Excellent work! You've answered all {progress.total} questions. 
                    Review your answers or submit your test when you're ready.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Go to first question for review
                      goToQuestion(0);
                    }}
                    className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Answers
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}