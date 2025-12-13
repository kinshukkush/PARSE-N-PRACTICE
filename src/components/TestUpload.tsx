import React, { useState, useRef } from 'react';
import { Upload, Type, FileText, Sparkles, FileCheck, X, Info, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseQuestionsWithAI, Question } from '@/lib/parser';
import { useTestStore } from '@/hooks/useTestStore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatInterface } from './AIChatInterface';
import { QuestionCountSelector } from './QuestionCountSelector';
import { PuterStatus } from './PuterStatus';

interface TestUploadProps {
  onTestParsed: () => void;
}

export function TestUpload({ onTestParsed }: TestUploadProps) {
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatContent, setChatContent] = useState('');
  const [chatSummary, setChatSummary] = useState('');
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [totalQuestionsFound, setTotalQuestionsFound] = useState(0);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const setTest = useTestStore((state) => state.setTest);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (e.target.value && uploadedFileName) {
      setUploadedFileName(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const text = await file.text();
      setInputText(text);
      setUploadedFileName(file.name);
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error reading file",
        description: "Please make sure the file is a valid text file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => 
      file.type === 'text/plain' || 
      file.name.endsWith('.txt') ||
      file.name.endsWith('.docx')
    );
    
    if (textFile) {
      handleFileUpload(textFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt or .docx file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const parseTest = async () => {
    console.log('🚀 parseTest function called');
    
    if (!inputText.trim()) {
      console.log('❌ No input text');
      toast({
        title: "No content to parse",
        description: "Please paste some text or upload a file first.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Input text length:', inputText.length);
    setIsLoading(true);
    setLoadingMessage('🤖 AI is analyzing your content...');
    
    try {
      console.log('📤 Calling parseQuestionsWithAI...');
      // Use AI to parse questions
      setLoadingMessage('🔍 Detecting questions and answers...');
      const result = await parseQuestionsWithAI(inputText);
      console.log('📥 Received result:', result);
      
      if (!result.hasQuestions) {
        // No questions found - open chat interface
        setChatContent(inputText);
        setChatSummary(result.summary || "No questions found in the content. Let's chat about it!");
        setShowChat(true);
        toast({
          title: "No Questions Detected",
          description: "Let's chat about this content instead!",
        });
      } else if (result.questions) {
        const questionCount = result.questions.length;
        
        if (questionCount === 0) {
          toast({
            title: "No questions found",
            description: "Could not extract any valid questions from the text.",
            variant: "destructive",
          });
          return;
        }

        // Check if more than 30 questions
        if (questionCount > 30) {
          setAllQuestions(result.questions);
          setTotalQuestionsFound(questionCount);
          setShowQuestionSelector(true);
        } else {
          // Less than or equal to 30, create test directly
          setTest({
            questions: result.questions,
            title: `Practice Test (${questionCount} questions)`
          });
          toast({
            title: "Test created successfully!",
            description: `Created practice test with ${questionCount} questions`,
          });
          onTestParsed();
        }
      }
    } catch (error) {
      console.error("Parsing error:", error);
      toast({
        title: "AI Processing Failed",
        description: "There was an error processing your content with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionCountSelect = (count: number) => {
    // Randomly select the requested number of questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    setTest({
      questions: selected,
      title: `Practice Test (${count} of ${totalQuestionsFound} questions)`
    });
    
    toast({
      title: "Test created successfully!",
      description: `Created practice test with ${count} randomly selected questions`,
    });
    
    setShowQuestionSelector(false);
    onTestParsed();
  };

  const clearText = () => {
    setInputText('');
    setUploadedFileName(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 20
      }
    }
  };

  return (
    <>
      <motion.div 
        className="w-full max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI Badge */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full backdrop-blur-sm">
            <Brain className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-sm font-medium">
              AI-Powered Question Detection & Chat
            </span>
          </div>
          <PuterStatus />
        </motion.div>

        {/* Upload Options */}
        <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800 border-slate-700 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Upload className="h-5 w-5 text-indigo-400" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-600 hover:border-indigo-400/50 bg-slate-700/30'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {uploadedFileName ? (
                    <motion.div
                      key="uploaded"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <FileCheck className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
                      <p className="text-sm text-emerald-300 mb-2 font-medium">
                        {uploadedFileName}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearText();
                        }}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                      <p className="text-sm text-slate-400 mb-4">
                          Drag & drop your text file here
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10 text-slate-200"
                      >
                        Choose File
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Text Input */}
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800 border-slate-700 transition-all hover:shadow-2xl hover:shadow-purple-500/10 hover:border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Type className="h-5 w-5 text-purple-400" />
                Paste Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Paste any text content here - questions, articles, notes, etc..."
                value={inputText}
                onChange={handleTextChange}
                className="min-h-[200px] bg-slate-700/50 border-slate-600 text-slate-100 placeholder:text-slate-500 focus:border-purple-400 transition-all w-full rounded-md p-3"
              />
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearText}
                  disabled={!inputText}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analyze Button */}
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg" 
            onClick={() => {
              console.log('🖱️ Button clicked!');
              parseTest();
            }}
            disabled={!inputText.trim() || isLoading}
            className="min-w-[250px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6 text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {loadingMessage}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyze with AI
              </span>
            )}
          </Button>
        </motion.div>
      </motion.div>

      {/* Help Text */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <h3 className="font-semibold text-slate-100">How it works:</h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-indigo-400">🤖</span>
                    <span><strong>AI Detection:</strong> Automatically detects if your content contains questions and answers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400">📝</span>
                    <span><strong>Smart Extraction:</strong> If questions found, AI creates a practice test (you can choose count if {'>'} 30)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-pink-400">💬</span>
                    <span><strong>AI Chat:</strong> If no questions found, you can chat with AI about your content</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {/* Chat Interface Modal */}
    <AnimatePresence>
      {showChat && (
        <AIChatInterface
          content={chatContent}
          summary={chatSummary}
          onClose={() => setShowChat(false)}
        />
      )}
    </AnimatePresence>

    {/* Question Count Selector Modal */}
    <AnimatePresence>
      {showQuestionSelector && (
        <QuestionCountSelector
          totalQuestions={totalQuestionsFound}
          onSelect={handleQuestionCountSelect}
          onCancel={() => setShowQuestionSelector(false)}
        />
      )}
    </AnimatePresence>
  </>
  );
}