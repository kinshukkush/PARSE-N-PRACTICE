import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  FileText, 
  Compass, 
  RefreshCw,
  AlertTriangle,
  Clock,
  TrendingUp,
  BookOpen,
  Brain,
  Zap,
  Star,
  ChevronRight
} from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);
  const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  // Animation timing
  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 600),
      setTimeout(() => setAnimationPhase(3), 900),
      setTimeout(() => setAnimationPhase(4), 1200),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Generate floating elements
  useEffect(() => {
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
    }));
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularPages = [
    { name: "Create Test", path: "/", icon: FileText, description: "Upload and create practice tests" },
    { name: "Take Test", path: "/test", icon: Brain, description: "Practice with existing tests" },
    { name: "Results", path: "/result", icon: TrendingUp, description: "View your test results" },
    { name: "Dashboard", path: "/dashboard", icon: BookOpen, description: "Track your progress" },
  ];

  const quickActions = [
    {
      title: "Go Home",
      description: "Return to the main page",
      icon: Home,
      action: () => navigate("/"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Go Back",
      description: "Return to previous page",
      icon: ArrowLeft,
      action: () => window.history.back(),
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Refresh",
      description: "Try reloading this page",
      icon: RefreshCw,
      action: () => window.location.reload(),
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Floating geometric shapes */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute opacity-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.id * 0.2}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Large background elements */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Main 404 Display */}
          <div className={`space-y-8 transform transition-all duration-1000 ${
            animationPhase >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}>
            {/* Animated 404 Number */}
            <div className="relative">
              <div className="text-[12rem] lg:text-[16rem] font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-none animate-gradient-shift">
                404
              </div>
              
              {/* Glitch effect overlay */}
              <div className="absolute inset-0 text-[12rem] lg:text-[16rem] font-black text-red-500 opacity-20 animate-pulse">
                404
              </div>
              
              {/* Error icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <AlertTriangle className="h-16 w-16 text-yellow-400 animate-bounce-gentle opacity-75" />
              </div>
            </div>

            {/* Error message */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Oops! Page Not Found
              </h1>
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-xl text-gray-300 leading-relaxed">
                  The page you're looking for seems to have vanished into the digital void.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Attempted to access: <code className="bg-gray-800 px-2 py-1 rounded text-red-300">{location.pathname}</code></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer"
                  onClick={action.action}
                >
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-4 bg-gradient-to-br ${action.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Pages */}
          <div className={`transform transition-all duration-1000 delay-500 ${
            animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-center justify-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Compass className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Explore Popular Pages
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularPages.map((page, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="group p-4 h-auto flex items-center justify-between text-left hover:bg-gray-700/30 border border-gray-700/30 hover:border-gray-600/50 rounded-xl transition-all duration-300"
                      onClick={() => navigate(page.path)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                          <page.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                            {page.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {page.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Suggestion */}
          <div className={`transform transition-all duration-1000 delay-700 ${
            animationPhase >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm border-blue-500/20 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-blue-300">
                    <Search className="h-5 w-5" />
                    <span className="font-medium">Looking for something specific?</span>
                  </div>
                  <p className="text-blue-200 max-w-md mx-auto">
                    Try searching for tests, creating new practice materials, or exploring our features to enhance your learning experience.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/")}
                      className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/dashboard")}
                      className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/help")}
                      className="border-green-500/50 text-green-300 hover:bg-green-500/10"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fun Facts */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Star className="h-4 w-4" />
              <span className="text-sm">Did you know?</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              404 errors are named after Room 404 at CERN, where the first web server was located. 
              When researchers couldn't find the server, they'd say it was "not found" - hence 404!
            </p>
          </div>

          {/* Main CTA */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="group px-12 py-6 text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Home className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Take Me Home
              <Zap className="ml-3 h-6 w-6 group-hover:animate-pulse" />
            </Button>
          </div>

          {/* Footer Message */}
          <div className="pt-8 text-center">
            <p className="text-gray-500 text-sm">
              Error reported at {new Date().toLocaleTimeString()} • 
              <span className="ml-2">Redirecting you to safety</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}