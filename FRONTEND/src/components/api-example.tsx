import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApi } from '@/hooks/use-api';

export const ApiExample = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<any[]>([]);
  const { 
    loading, 
    error, 
    clearError, 
    generateSlides, 
    isAuthenticated,
    login,
    logout 
  } = useApi();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      const response = await generateSlides(prompt);
      setGeneratedSlides(response.slides);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleLogin = async () => {
    try {
      await login({ email: 'test@example.com', password: 'password' });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            Test the connection between frontend and backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Authentication Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </span>
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button onClick={handleLogin}>
                Login (Dummy)
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
                <Button variant="link" onClick={clearError} className="ml-2 p-0 h-auto">
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Generate Slides */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Generate Pitch Deck Slides</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your pitch deck prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <Button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim() || !isAuthenticated}
              >
                {loading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </div>

          {/* Generated Slides */}
          {generatedSlides.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Generated Slides:</h3>
              <div className="space-y-2">
                {generatedSlides.map((slide, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-1">
                      <h4 className="font-medium">{slide.title}</h4>
                      <p className="text-sm text-muted-foreground">{slide.content}</p>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {slide.type}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 