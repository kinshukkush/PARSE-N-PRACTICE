import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, FileText, Play, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestUpload } from '@/components/TestUpload';
import { useTestStore } from '@/hooks/useTestStore';

export default function Index() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const currentTest = useTestStore((state) => state.currentTest);

  const handleGetStarted = () => {
    setShowUpload(true);
  };

  const handleTestParsed = () => {
    navigate('/test');
  };

  const features = [
    {
      icon: FileText,
      title: "Smart Parsing",
      description: "Automatically detect questions, options, and answers from text"
    },
    {
      icon: Play,
      title: "Interactive Testing",
      description: "Take practice tests with real-time progress tracking"
    },
    {
      icon: CheckCircle,
      title: "Detailed Results",
      description: "Review answers with explanations and performance analysis"
    }
  ];

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowUpload(false)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-gradient">Create Your Practice Test</h1>
            <p className="text-xl text-muted-foreground">
              Upload a file or paste your questions to get started
            </p>
          </div>

          {/* Upload Component */}
          <TestUpload onTestParsed={handleTestParsed} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gradient">
              Practice Test Generator
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your multiple-choice questions into interactive practice tests. 
              Upload, parse, and practice with AI-powered question detection.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-4"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            {currentTest && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/test')}
                className="text-lg px-8 py-4"
              >
                <Play className="mr-2 h-5 w-5" />
                Continue Last Test
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to create your practice test
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center transition-smooth hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Example Section */}
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Supported Format</h2>
            <p className="text-lg text-muted-foreground">
              Our AI can parse various question formats automatically
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Example Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
{`Q1. Which of the following is NOT a characteristic of a project?
A. Temporary in nature
B. Unique deliverables
C. Ongoing and repetitive
D. Has defined start and end dates
👉 Answer: C. Ongoing and repetitive

Q2. What is the primary purpose of project management?
A. To increase company profits
B. To deliver project objectives within scope, time, and budget
C. To manage team conflicts
D. To create detailed documentation
👉 Answer: B. To deliver project objectives within scope, time, and budget`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Create unlimited practice tests • Export as JSON • Track your progress
          </p>
        </div>
      </div>
    </div>
  );
}