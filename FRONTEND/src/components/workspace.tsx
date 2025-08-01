import { useState } from 'react';
import { Slide, ChatMessage } from '@/types/slide';
import { SlideCard } from './slide-card';
import { SlideList } from './slide-list';
import { ChatSidebar } from './chat-sidebar';
import { MinimalNavBar } from './minimal-nav-bar';
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
    content: 'I\'m here to help you improve your pitch deck. I can only edit the active slide you have selected. What would you like to work on?',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  }
];

export function Workspace({ initialSlides }: { initialSlides?: any[] }) {
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
  const { updateSlide, loading, error } = useApi();

  const activeSlide = slides.find(slide => slide.id === activeSlideId);

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

  const handleSlideReorder = (reorderedSlides: Slide[]) => {
    // Update positions based on new order
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      position: index + 1
    }));
    setSlides(updatedSlides);

    // Note: This component doesn't have projectId, so we can't save to backend
    // The workspace-new.tsx component handles the actual saving
    // For this demo component, we just update the local state
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
        content: 'Working on your request...',
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <MinimalNavBar
        projectTitle="AI Customer Service Platform"
        onExport={handleExport}
        onSettings={handleSettings}
      />
      
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
            <SlideCard 
              slide={activeSlide} 
              className="animate-fade-in"
              onSlideUpdate={handleSlideUpdate}
            />
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
        <ChatSidebar
          messages={messages}
          activeSlideId={activeSlideId}
          onSendMessage={handleSendMessage}
          isLoading={loading}
        />
      </div>
    </div>
  );
}