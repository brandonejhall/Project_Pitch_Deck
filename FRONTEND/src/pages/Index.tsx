import { useState } from 'react';
import { WorkspaceNew } from '@/components/workspace-new';
import { MeshGradient } from '@/components/mesh-gradient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ArrowRight, Lightbulb, Presentation, MessageSquare } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Index = () => {
  const [mode, setMode] = useState<'input' | 'workspace'>('input');
  const [idea, setIdea] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<any[]>([]);
  const { generateSlides, loading, error } = useApi();

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    
    try {
      const response = await generateSlides(idea);
      setGeneratedSlides(response.slides);
      setMode('workspace');
      toast({
        title: "Success!",
        description: `Generated ${response.slides.length} slides for your pitch deck.`,
      });
    } catch (err) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate slides. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  if (mode === 'workspace') {
    return <WorkspaceNew initialSlides={generatedSlides} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Hero section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-title text-gray-900">PitchDeck AI</h1>
            </div>
            <p className="text-body text-gray-600 max-w-lg mx-auto mb-8">
              Transform your business idea into a professional pitch deck in minutes. 
              Our AI creates compelling slides tailored to your vision.
            </p>
            
            {/* Demo links */}
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/slides-demo"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Presentation className="w-4 h-4" />
                View Slides Demo
              </Link>
              <Link
                to="/ai-chat-demo"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Try AI Chat
              </Link>
            </div>
          </div>

          {/* Input card */}
          <div className="glass-card p-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-accent" />
              <h2 className="text-section text-gray-900">Describe Your Business Idea</h2>
            </div>
            
            <div className="space-y-6">
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your business idea, target market, and key value proposition. The more details you provide, the better your pitch deck will be..."
                className="min-h-[150px] resize-none bg-gray-50 border-gray-200 focus:border-primary/50 text-body text-gray-900"
                disabled={loading}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-footer text-gray-500">
                  {idea.length > 50 ? (
                    <span className="text-accent">Great! More details will improve your deck.</span>
                  ) : (
                    <span>Tip: Press Cmd/Ctrl + Enter to generate</span>
                  )}
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={!idea.trim() || loading}
                  className="interactive-hover bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Slides
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Features preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-section text-gray-900">AI-Powered</h3>
              <p className="text-footer text-gray-600">Advanced AI creates compelling content and layouts</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-section text-gray-900">Instant Results</h3>
              <p className="text-footer text-gray-600">Get a complete pitch deck in under 2 minutes</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-section text-gray-900">Smart Layouts</h3>
              <p className="text-footer text-gray-600">Automatically optimized for maximum impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
