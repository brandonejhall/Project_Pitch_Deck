import React, { useState } from 'react';
import { signIn, signUp } from '../lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from '../hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome Back",
          description: "You have been signed in successfully!",
        });
      }
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white md:min-h-screen">
        <div className="max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
            <span className="text-3xl font-extrabold tracking-tight drop-shadow-lg">PitchDeck AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">AI-Powered Pitch Decks in Minutes</h1>
          <p className="mb-6 text-blue-100 text-lg">
            Instantly generate, edit, and manage stunning investor pitch decks with the help of AI. Save hours, impress investors, and focus on your business.
          </p>
          <div className="bg-white/10 rounded-lg p-4 mb-6 shadow-lg">
            <p className="text-blue-100 italic text-sm">
              “PitchDeck AI helped us raise our first round. The AI-generated slides were better than what we could have done ourselves!”
            </p>
            <div className="mt-2 text-xs text-blue-200">— Startup Founder</div>
          </div>
          <ul className="text-blue-100 text-sm space-y-2">
            <li>✅ Generate a full deck from your idea</li>
            <li>✅ Edit slides with AI suggestions</li>
            <li>✅ Drag-and-drop reordering</li>
            <li>✅ Secure, private, and fast</li>
          </ul>
        </div>
      </div>
      {/* Login Card Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Create a new account to get started' 
                : 'Sign in to your account to continue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 