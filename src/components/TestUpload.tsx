import React, { useState, useRef } from 'react';
import { Upload, Type, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { parseQuestionsFromText, SAMPLE_TEXT } from '@/lib/parser';
import { useTestStore } from '@/hooks/useTestStore';
import { useToast } from '@/hooks/use-toast';

interface TestUploadProps {
  onTestParsed: () => void;
}

export function TestUpload({ onTestParsed }: TestUploadProps) {
  const [inputText, setInputText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const setTest = useTestStore((state) => state.setTest);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const text = await file.text();
      setInputText(text);
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

  const parseTest = () => {
    if (!inputText.trim()) {
      toast({
        title: "No content to parse",
        description: "Please paste some text or upload a file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const parsedTest = parseQuestionsFromText(inputText);
      
      if (parsedTest.questions.length === 0) {
        toast({
          title: "No questions found",
          description: "Could not parse any valid questions from the text. Please check the format.",
          variant: "destructive",
        });
        return;
      }

      setTest(parsedTest);
      toast({
        title: "Questions parsed successfully!",
        description: `Found ${parsedTest.questions.length} questions`,
      });
      onTestParsed();
    } catch (error) {
      toast({
        title: "Parsing failed",
        description: "There was an error parsing your questions. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = () => {
    setInputText(SAMPLE_TEXT);
    toast({
      title: "Sample loaded",
      description: "Sample questions loaded successfully",
    });
  };

  const clearText = () => {
    setInputText('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <Card className="transition-smooth hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
            >
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop your .txt file here, or click to browse
              </p>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Text Input */}
        <Card className="transition-smooth hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Paste Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your multiple choice questions here..."
              value={inputText}
              onChange={handleTextChange}
              className="min-h-[200px] transition-smooth"
            />
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSample}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Load Sample
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearText}
                disabled={!inputText}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parse Button */}
      <div className="text-center">
        <Button 
          variant="hero" 
          size="lg" 
          onClick={parseTest}
          disabled={!inputText.trim() || isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? 'Parsing...' : 'Create Practice Test'}
        </Button>
      </div>

      {/* Help Text */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Supported Format:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Questions: Q1. or 1. followed by question text</p>
            <p>• Options: A. B. C. D. or a) b) c) d) followed by option text</p>
            <p>• Answers: 👉 Answer: C, Answer: C. Option text, or Answer: Option text</p>
            <p>• If you upload more than 20 questions, only 20 will be selected for practice (you can shuffle for a new set)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}