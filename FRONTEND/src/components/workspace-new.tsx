import { useState, useMemo } from 'react';
import { Slide, ChatMessage } from '@/types/slide';
import { SlideList } from './slide-list';
import { ChatSidebarEnhanced } from './chat-sidebar-enhanced';
import { MinimalNavBar } from './minimal-nav-bar';
import { SlidesPage } from './slides-page';
import { Project } from './slide-card-new';
import { detectSlideIcon } from '@/lib/slide-icons';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockSlides: Slide[] = [
  {
    id: 'slide-1',
    position: 1,
    title: 'Executive Summary',
    content: 'Our AI-powered platform revolutionizes customer service by providing instant, accurate responses using advanced natural language processing. We\'ve achieved 95% customer satisfaction rates and reduced response times by 80%.',
    layout: 'hero',
    icon: 'executive-summary'
  },
  {
    id: 'slide-2',
    position: 2,
    title: 'The Problem',
    content: 'Traditional customer service is slow, expensive, and inconsistent. Companies struggle with:\n• High response times (24-48 hours average)\n• Inconsistent service quality\n• Expensive human-only support teams\n• Limited availability (business hours only)',
    layout: 'list',
    icon: 'problem'
  },
  {
    id: 'slide-3',
    position: 3,
    title: 'Our Solution',
    content: 'We provide an AI-powered customer service platform that delivers instant, accurate responses 24/7. Our solution combines machine learning with human oversight to ensure quality while reducing costs.',
    layout: 'two-column',
    icon: 'solution',
    heroImageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'slide-4',
    position: 4,
    title: 'Market Analysis',
    content: 'Total Addressable Market\n$50B customer service software market\n\nServiceable Addressable Market\n$15B AI-powered solutions segment\n\nTarget Market\n$2B SMB customer service automation',
    layout: 'grid',
    icon: 'market-analysis'
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hi! I\'m here to help you improve your pitch deck. What would you like to work on?',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Can you help me make the problem slide more compelling?',
    timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    slideId: 'slide-2'
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: 'Absolutely! For the problem slide, consider adding specific statistics or customer pain points. You could also include a real customer quote or case study to make it more relatable.',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    slideId: 'slide-2'
  }
];

// Convert Slide to Project format
function convertSlideToProject(slide: Slide, projectId: string = 'default-project'): Project {
  return {
    id: slide.id,
    title: slide.title,
    body: slide.content,
    heroImageUrl: slide.heroImageUrl,
    contacts: [
      { type: 'email', label: 'hello@example.com', href: 'mailto:hello@example.com' },
      { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
      { type: 'linkedin', label: 'linkedin.com', href: 'https://linkedin.com' }
    ]
  };
}

// Convert Project back to Slide format
function convertProjectToSlide(project: Project): Slide {
  return {
    id: project.id,
    position: 0, // Will be set by parent
    title: project.title,
    content: project.body,
    heroImageUrl: project.heroImageUrl,
    layout: 'two-column',
    icon: 'default'
  };
}

export function WorkspaceNew({ initialSlides }: { initialSlides?: any[] }) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides ? 
    initialSlides.map((slide, index) => ({
      id: slide.id || `slide-${index}`,
      position: index + 1,
      title: slide.title,
      content: slide.content,
      layout: slide.type === 'hero' ? 'hero' : 'full-width',
      icon: slide.type || 'default'
    })) : mockSlides
  );
  const [activeSlideId, setActiveSlideId] = useState(slides[0]?.id || '');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [viewMode, setViewMode] = useState<'slides' | 'workspace'>('slides');
  const { updateSlide, loading, error } = useApi();

  const activeSlide = slides.find(slide => slide.id === activeSlideId);

  // Convert slides to projects for the slides page
  const projects = useMemo(() => {
    return slides.map(slide => convertSlideToProject(slide, 'pitch-deck-project'));
  }, [slides]);

  const handleSlideAdd = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      position: slides.length + 1,
      title: 'New Slide',
      content: 'Add your content here...',
      layout: 'full-width'
    };
    
    // Auto-detect icon based on content
    const iconMapping = detectSlideIcon(newSlide.title, newSlide.content);
    newSlide.icon = iconMapping.key;
    
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide.id);
  };

  const handleSlideUpdate = (updatedSlide: Slide) => {
    setSlides(slides.map(slide => 
      slide.id === updatedSlide.id ? updatedSlide : slide
    ));
  };

  const handleSlideUpdateFromChat = (slideId: string, updates: any) => {
    setSlides(slides.map(slide => {
      if (slide.id === slideId) {
        return {
          ...slide,
          ...updates
        };
      }
      return slide;
    }));
  };

  const handleSlideReorder = (reorderedSlides: Slide[]) => {
    // Update positions based on new order
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      position: index + 1
    }));
    setSlides(updatedSlides);
  };

  const handleSendMessage = async (content: string, slideId?: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      slideId
    };

    setMessages(prev => [...prev, userMessage]);

    // TODO: Implement actual chat API call
    // For now, simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: 'Great question! Here are some suggestions to improve that section...',
        timestamp: new Date(),
        slideId
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleExport = () => {
    console.log('Exporting presentation...');
    // TODO: Implement export functionality
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // TODO: Implement settings modal
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'slides' ? 'workspace' : 'slides');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <MinimalNavBar
        projectTitle="AI Customer Service Platform"
        onExport={handleExport}
        onSettings={handleSettings}
      />
      
      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('slides')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'slides' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Slides View
            </button>
            <button
              onClick={() => setViewMode('workspace')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'workspace' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Workspace View
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {slides.length} slides • {viewMode === 'slides' ? 'Full presentation view' : 'Edit mode'}
          </div>
        </div>
      </div>

      {viewMode === 'slides' ? (
        // Slides Page View
        <div className="flex-1 overflow-hidden">
          <SlidesPage projects={projects} layout="two-column" showNoise={true} />
        </div>
      ) : (
        // Original Workspace View
        <div className="flex-1 flex overflow-hidden">
          {/* Slide List */}
          <SlideList
            slides={slides}
            activeSlideId={activeSlideId}
            onSlideSelect={setActiveSlideId}
            onSlideAdd={handleSlideAdd}
            onSlideReorder={handleSlideReorder}
            onSlideUpdate={handleSlideUpdate}
          />
          
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            {activeSlide ? (
              <div className="animate-fade-in">
                {/* Convert slide to project for display */}
                <SlidesPage 
                  projects={[convertSlideToProject(activeSlide)]} 
                  layout="two-column" 
                  showNoise={true} 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p className="text-section mb-2">No slide selected</p>
                  <p className="text-body">Choose a slide from the sidebar to get started</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat Sidebar */}
          <ChatSidebarEnhanced
            messages={messages}
            activeSlide={activeSlide}
            onSendMessage={handleSendMessage}
            onSlideUpdate={handleSlideUpdateFromChat}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
} 