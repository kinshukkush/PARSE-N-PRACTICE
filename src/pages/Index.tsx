import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  FileText, 
  Play, 
  Sparkles, 
  CheckCircle, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronDown,
  ArrowRight,
  Download,
  BarChart3
} from 'lucide-react';
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
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI automatically detects questions and formats",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Generate practice tests in seconds from any text",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Adaptive Testing",
      description: "Personalized questions based on your performance",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed insights and progress tracking",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Timed Practice",
      description: "Simulate real exam conditions",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Unlock badges as you progress",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Questions Generated", icon: FileText },
    { number: "10K+", label: "Active Users", icon: TrendingUp },
    { number: "95%", label: "Accuracy Rate", icon: Target },
    { number: "24/7", label: "AI Support", icon: Brain }
  ];

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gradient-dark p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 animate-fade-in"
          >
            <nav className="flex items-center justify-center space-x-2 text-sm text-slate-400 mb-6">
              <button
                onClick={() => setShowUpload(false)}
                className="flex items-center space-x-1 hover:text-indigo-400 transition-colors duration-300"
              >
                <span>Home</span>
              </button>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-indigo-400">Create Test</span>
            </nav>

            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full glass-dark">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-300 text-sm font-medium">AI-Powered Test Generation</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gradient-primary">
                Create Your Practice Test
              </h1>
              
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Upload your study material and let our AI generate personalized practice questions
              </p>
            </div>
                    </motion.div>

          {/* Upload Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="animate-scale-up"
          >
            <TestUpload onTestParsed={handleTestParsed} />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-slate-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          {/* Logo & Title */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center"
          >
            <div className="relative p-6 bg-gradient-primary rounded-3xl shadow-2xl shadow-indigo-500/25 animate-pulse-glow">
              <GraduationCap className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm glass-dark">
              <Brain className="h-5 w-5 text-indigo-400 animate-pulse" />
              <span className="text-indigo-300 font-medium">Next-Generation AI Learning Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gradient-primary animate-fade-in">
              Practice Test
              <br />
              <span className="text-gradient">
                Generator
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              Transform your study materials into interactive practice tests with our advanced AI. 
              Experience adaptive learning, real-time analytics, and personalized question generation.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button
              onClick={handleGetStarted}
              className="group relative px-10 py-6 text-lg font-semibold bg-gradient-primary hover:scale-105 rounded-2xl shadow-2xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40"
            >
              <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
              Get Started Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {currentTest && (
              <Button
                onClick={() => navigate('/test')}
                variant="outline"
                className="px-10 py-6 text-lg font-semibold border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <Play className="mr-3 h-6 w-6" />
                Continue Last Test
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center p-6 bg-gradient-card-dark glass-dark rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover:scale-105 group hover-lift"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-indigo-400" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full mb-6 glass-dark">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gradient-primary">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with intuitive design
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className={`stagger-${index + 1}`}
              >
                <Card className="group relative bg-gradient-card-dark glass-dark border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-105 hover:-translate-y-2 rounded-2xl overflow-hidden hover-lift">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative">
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-center text-white group-hover:text-indigo-200 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-slate-300 text-center leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Call to Action Section */}
      <section className="px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-3xl p-12 border border-indigo-500/20 glass-dark animate-pulse-glow">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gradient-primary">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students and professionals who have revolutionized their study routine
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                className="group px-8 py-4 text-lg font-semibold bg-gradient-primary hover:shadow-indigo-500/40 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Start Creating Tests
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-2 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm animate-bounce-in stagger-1"
                onClick={() => navigate('/demo')}
              >
                <Play className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="px-4 py-12 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="grid md:grid-cols-3 gap-8 mb-8"
          >
            <div className="text-center md:text-left animate-slide-in-left">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 drop-shadow-glow-green" />
                  Unlimited practice tests
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 drop-shadow-glow-green" />
                  AI-powered question generation
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400 drop-shadow-glow-green" />
                  Real-time performance analytics
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-left animate-fade-in">
              <h3 className="text-lg font-semibold text-white mb-3">Export Options</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <Download className="h-4 w-4 text-blue-400" />
                  Export as JSON
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <Download className="h-4 w-4 text-blue-400" />
                  Export as PDF
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <Download className="h-4 w-4 text-blue-400" />
                  Share test links
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-left animate-slide-in-right">
              <h3 className="text-lg font-semibold text-white mb-3">Analytics</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  Progress tracking
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  Performance insights
                </li>
                <li className="flex items-center gap-2 hover:text-slate-300 transition-colors">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  Learning recommendations
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="text-center pt-8 border-t border-slate-800/50"
          >
            <p className="text-slate-400">
              © 2024 Practice Test Generator • Powered by Advanced AI • 
              <span className="text-indigo-400 ml-1">Transforming Education</span>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}