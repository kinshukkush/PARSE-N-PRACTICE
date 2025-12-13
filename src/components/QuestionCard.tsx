import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/parser';
import { UserAnswer } from '@/hooks/useTestStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

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
  
  const getOptionStyles = (optionIndex: number) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300";
    
    if (!showCorrectAnswer && !isReviewMode) {
      return userAnswer?.selectedIndex === optionIndex 
        ? `${baseStyles} bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/10` 
        : `${baseStyles} bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50 hover:border-slate-500/50`;
    }

    if (showCorrectAnswer) {
      const isCorrectAnswer = optionIndex === question.answerIndex;
      const isUserSelection = userAnswer?.selectedIndex === optionIndex;

      if (isCorrectAnswer) {
        return `${baseStyles} bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/10`;
      } else if (isUserSelection && !isCorrectAnswer) {
        return `${baseStyles} bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/50 shadow-lg shadow-red-500/10`;
      } else {
        return `${baseStyles} bg-slate-800/30 border-slate-700/50 opacity-60`;
      }
    }

    return userAnswer?.selectedIndex === optionIndex 
      ? `${baseStyles} bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-400/50 shadow-lg shadow-indigo-500/10` 
      : `${baseStyles} bg-slate-700/50 hover:bg-slate-600/50 border-slate-600/50 hover:border-slate-500/50`;
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showCorrectAnswer) {
      return userAnswer?.selectedIndex === optionIndex 
        ? <Circle className="w-5 h-5 fill-indigo-400 text-indigo-400" />
        : <Circle className="w-5 h-5 text-slate-500" />;
    }

    const isCorrectAnswer = optionIndex === question.answerIndex;
    const isUserSelection = userAnswer?.selectedIndex === optionIndex;

    if (isCorrectAnswer) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-glow-green" />;
    } else if (isUserSelection && !isCorrectAnswer) {
      return <XCircle className="w-5 h-5 text-red-400 drop-shadow-glow-red" />;
    }
    
    return <Circle className="w-5 h-5 text-slate-600" />;
  };

  const getStatusBadge = () => {
    if (!showCorrectAnswer || !userAnswer) return null;

    const isCorrect = userAnswer.selectedIndex === question.answerIndex;
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Badge 
          className={`ml-auto ${isCorrect 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
            : 'bg-red-500/20 text-red-300 border-red-400/50'}`}
        >
          {isCorrect ? "✓ Correct" : "✗ Incorrect"}
        </Badge>
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="w-full bg-slate-800 border-slate-700 shadow-2xl shadow-black/50">
        <CardHeader className="pb-6 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-t-lg border-b border-slate-700">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-xl font-bold text-slate-100">
                Question {questionNumber} of {totalQuestions}
              </CardTitle>
            </motion.div>
            {getStatusBadge()}
          </div>
          {!showCorrectAnswer && (
            <motion.div 
              className="w-full bg-slate-700/50 rounded-full h-3 mt-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ 
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                }}
              />
            </motion.div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 pt-8 px-8 pb-8">
          {/* Question Text */}
          <motion.div 
            variants={itemVariants}
            className="text-xl font-medium leading-relaxed text-slate-100 mb-8"
          >
            {question.question}
          </motion.div>

          {/* Options */}
          <motion.div className="space-y-4" variants={containerVariants}>
            <AnimatePresence>
              {question.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={!isReviewMode ? { scale: 1.02 } : {}}
                    whileTap={!isReviewMode ? { scale: 0.98 } : {}}
                  >
                    <button
                      className={`
                        w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left backdrop-blur-sm
                        ${getOptionStyles(index)}
                        ${!isReviewMode ? 'cursor-pointer' : 'cursor-not-allowed'}
                        transition-all duration-300
                      `}
                      onClick={() => !isReviewMode && onAnswerSelect?.(index, option)}
                      disabled={isReviewMode}
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/50 border border-slate-600/50 flex-shrink-0 font-bold text-slate-300">
                        {optionLetter}
                      </span>
                      <span className="flex-1 text-slate-200 text-lg leading-relaxed pt-2">
                        {option}
                      </span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="mt-2"
                      >
                        {getOptionIcon(index)}
                      </motion.div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Show correct answer in review mode */}
          <AnimatePresence>
            {showCorrectAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-2 border-slate-700 rounded-xl p-6 mt-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5 drop-shadow-glow-green" />
                      <div className="flex-1">
                        <span className="font-bold text-emerald-300">Correct Answer:</span>
                        <p className="text-slate-200 mt-1">
                          {String.fromCharCode(65 + question.answerIndex)}. {question.answer}
                        </p>
                      </div>
                    </div>
                    
                    {userAnswer && userAnswer.selectedIndex !== question.answerIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-3 pt-4 border-t border-slate-700"
                      >
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 drop-shadow-glow-red" />
                        <div className="flex-1">
                          <span className="font-bold text-red-300">Your Answer:</span>
                          <p className="text-slate-200 mt-1">
                            {String.fromCharCode(65 + userAnswer.selectedIndex)}. {userAnswer.selectedOption}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}