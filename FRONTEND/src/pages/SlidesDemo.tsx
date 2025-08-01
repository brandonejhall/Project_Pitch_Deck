import React, { useState } from 'react';
import { SlidesPage, SlidesPageExample } from '../components/slides-page';
import { Project } from '../components/slide-card-new';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function SlidesDemo() {
  const [showNoise, setShowNoise] = useState(true);
  const [layout, setLayout] = useState<'two-column' | 'single'>('two-column');
  const { user, logout } = useAuth();

  const sampleProjects: Project[] = [
    {
      id: 'eco-fresh-001',
      title: 'Problem Statement',
      body: 'Restaurants and grocery chains struggle with high levels of food waste, which leads to losses in profit and sustainability. Current inventory management solutions don\'t effectively reduce waste and lack dynamic pricing capabilities.',
      heroImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
      contacts: [
        { type: 'email', label: 'hello@example.com', href: 'mailto:hello@example.com' },
        { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        { type: 'linkedin', label: 'linkedin.com', href: 'https://linkedin.com' }
      ]
    },
    {
      id: 'eco-fresh-002',
      title: 'Our Solution',
      body: 'Our app, EcoFresh, uses AI to manage inventory and implement dynamic pricing, helping businesses reduce food waste and increase their profits. We leverage machine learning algorithms to predict demand and optimize pricing in real-time.',
      heroImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      contacts: [
        { type: 'email', label: 'contact@company.com', href: 'mailto:contact@company.com' },
        { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        { type: 'linkedin', label: 'company-linkedin', href: 'https://linkedin.com/company' }
      ]
    },
    {
      id: 'eco-fresh-003',
      title: 'Market Analysis',
      body: 'The food waste management market is valued at $40 billion globally and growing at 5.2% annually. Our target market includes 50,000+ restaurants and grocery chains in North America alone, representing a $2.5 billion addressable market.',
      contacts: [
        { type: 'email', label: 'hello@example.com', href: 'mailto:hello@example.com' },
        { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' }
      ]
    },
    {
      id: 'eco-fresh-004',
      title: 'Business Model',
      body: 'EcoFresh operates on a SaaS subscription model, charging $299 per month per location. Additionally, we take a 2% commission on waste reduction savings, creating a win-win partnership with our customers.',
      contacts: [
        { type: 'email', label: 'contact@company.com', href: 'mailto:contact@company.com' },
        { type: 'linkedin', label: 'company-linkedin', href: 'https://linkedin.com/company' }
      ]
    },
    {
      id: 'eco-fresh-005',
      title: 'Competitive Advantage',
      body: 'We stand out from competitors with our proprietary AI algorithms trained on 2M+ food items, partnerships with major POS systems, and proven 30% waste reduction results. Our technology is 3x more accurate than existing solutions.',
      heroImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      contacts: [
        { type: 'email', label: 'hello@example.com', href: 'mailto:hello@example.com' },
        { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        { type: 'linkedin', label: 'linkedin.com', href: 'https://linkedin.com' }
      ]
    },
    {
      id: 'tech-startup-001',
      title: 'Executive Summary',
      body: 'We\'re building the future of AI-powered customer service with our revolutionary chatbot platform. Our solution reduces support costs by 60% while improving customer satisfaction scores by 40%.',
      heroImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
      contacts: [
        { type: 'email', label: 'hello@techstartup.com', href: 'mailto:hello@techstartup.com' },
        { type: 'phone', label: '+1 (555) 987-6543', href: 'tel:+15559876543' },
        { type: 'linkedin', label: 'techstartup-linkedin', href: 'https://linkedin.com/company/techstartup' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      {user && (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-section font-semibold text-gray-900">PitchDeck AI</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="interactive-hover text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>
      )}
      
      {/* Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="noise-toggle"
                checked={showNoise}
                onCheckedChange={setShowNoise}
              />
              <Label htmlFor="noise-toggle">Show Noise Overlay</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={layout === 'two-column' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('two-column')}
              >
                Two Column
              </Button>
              <Button
                variant={layout === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLayout('single')}
              >
                Single Column
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              {sampleProjects.length} slides • Deterministic gradients per project ID
            </div>
          </div>
        </div>
      </div>

      {/* Slides Page */}
      <SlidesPage 
        projects={sampleProjects} 
        layout={layout}
        showNoise={showNoise}
      />
    </div>
  );
} 