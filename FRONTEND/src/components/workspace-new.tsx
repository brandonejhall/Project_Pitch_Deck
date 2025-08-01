import { useState, useMemo, useEffect } from 'react';
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

export function WorkspaceNew({ initialSlides, projectId }: { initialSlides?: any[], projectId?: number }) {
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
  const [triggerEditSlide, setTriggerEditSlide] = useState<{ slideId: string; fields: ('title' | 'content')[] } | null>(null);
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const { updateSlide, loading, error, getProject } = useApi();

  // Load project slides if projectId is provided
  useEffect(() => {
    if (projectId) {
      loadProjectSlides();
    }
  }, [projectId]);

  const loadProjectSlides = async () => {
    try {
      console.log('🔍 Loading project slides for projectId:', projectId);
      const project: any = await getProject(projectId);
      console.log('📋 Project data:', project);
      
      // Set the project title
      if (project.title) {
        setProjectTitle(project.title);
      }
      
      // Check if project has slides
      if (project.slides && project.slides.length > 0) {
        console.log(`✅ Found ${project.slides.length} slides in project`);
        // Convert backend slides to frontend format
        const loadedSlides: Slide[] = project.slides.map((slide: any) => ({
          id: slide.id, // This should be an integer from the backend
          position: slide.position,
          title: slide.title,
          content: slide.content,
          layout: 'two-column', // Default layout
          icon: 'default'
        }));
        
        console.log('🔄 Converted slides:', loadedSlides);
        setSlides(loadedSlides);
        setActiveSlideId(loadedSlides[0]?.id || '');
      } else {
        // No slides found, use mock slides
        console.log('❌ No slides found for project, using mock slides');
        console.log('📋 Project slides array:', project.slides);
      }
    } catch (error) {
      console.error('❌ Failed to load project slides:', error);
      toast({
        title: "Failed to load project",
        description: "Could not load project slides. Using default slides.",
        variant: "destructive",
      });
    }
  };

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

  const handleTriggerEdit = (slideId: string, field: 'title' | 'content', value: string) => {
    // Update the slide with the AI suggestion
    const updatedSlides = slides.map(slide => {
      if (slide.id === slideId) {
        return {
          ...slide,
          [field]: value
        };
      }
      return slide;
    });
    
    setSlides(updatedSlides);
    
    // Set the active slide to the one being edited
    setActiveSlideId(slideId);
    
    // Set the trigger state to activate edit mode for this field
    setTriggerEditSlide({ slideId, fields: [field] });
  };

  const handleMultipleFieldUpdates = (slideId: string, updates: any) => {
    // Update the slide with all AI suggestions
    const updatedSlides = slides.map(slide => {
      if (slide.id === slideId) {
        return {
          ...slide,
          ...updates
        };
      }
      return slide;
    });
    
    setSlides(updatedSlides);
    
    // Set the active slide to the one being edited
    setActiveSlideId(slideId);
    
    // Determine which fields were updated
    const updatedFields: ('title' | 'content')[] = [];
    if (updates.title) updatedFields.push('title');
    if (updates.content) updatedFields.push('content');
    
    // Set the trigger state to activate edit mode for all updated fields
    if (updatedFields.length > 0) {
      setTriggerEditSlide({ slideId, fields: updatedFields });
    }
  };

  const handleEditTriggered = () => {
    // Clear the trigger state after edit mode is activated
    setTriggerEditSlide(null);
  };

  const handleProjectUpdate = async (updatedProject: any) => {
    // Convert project back to slide and update
    const updatedSlide = convertProjectToSlide(updatedProject);
    
    // Update local state immediately for responsive UI
    setSlides(slides.map(slide => 
      slide.id === updatedSlide.id ? updatedSlide : slide
    ));
    
    // Save to backend
    try {
      // Check if slide ID is a number (real slide) or string (mock data)
      const slideId = typeof updatedSlide.id === 'string' ? 
        parseInt(updatedSlide.id.replace('slide-', '')) : 
        updatedSlide.id;
      
      await updateSlide(slideId, {
        title: updatedSlide.title,
        content: updatedSlide.content
      });
      
      // Show success feedback
      toast({
        title: "Changes Saved",
        description: "Your slide has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save slide update:', error);
      
      // Show error feedback
      toast({
        title: "Save Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
      
      // Optionally revert local state on error
      // setSlides(slides); // Revert to original state
    }
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

  const handleExport = async () => {
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Export Failed",
          description: "Please allow popups to export your presentation.",
          variant: "destructive",
        });
        return;
      }

      // Generate HTML content for each slide
      const slideHTML = slides.map((slide, index) => `
        <div style="page-break-after: always; padding: 40px; font-family: Arial, sans-serif;">
          <div style="margin-bottom: 30px;">
            <h1 style="font-size: 32px; color: #1f2937; margin: 0; font-weight: 600;">
              ${slide.title}
            </h1>
          </div>
          <div style="font-size: 18px; line-height: 1.6; color: #374151;">
            ${slide.content}
          </div>
          ${index < slides.length - 1 ? '<div style="page-break-after: always;"></div>' : ''}
        </div>
      `).join('');

      // Create the complete HTML document
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${projectTitle}</title>
          <style>
            @media print {
              body { margin: 0; }
              div { page-break-inside: avoid; }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
            }
          </style>
        </head>
        <body>
          <div style="padding: 20px;">
            <h1 style="text-align: center; color: #1f2937; margin-bottom: 40px; font-size: 24px;">
              ${projectTitle}
            </h1>
            ${slideHTML}
          </div>
        </body>
        </html>
      `;

      // Write the HTML to the new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      toast({
        title: "Export Started",
        description: "Your presentation is being prepared for export.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export presentation. Please try again.",
        variant: "destructive",
      });
    }
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
        projectTitle={projectTitle}
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
          <SlidesPage 
            projects={projects} 
            layout="two-column" 
            showNoise={true}
            onProjectUpdate={handleProjectUpdate}
            editable={true}
            triggerEditSlide={triggerEditSlide}
            onEditTriggered={handleEditTriggered}
          />
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
                  onProjectUpdate={handleProjectUpdate}
                  editable={true}
                  triggerEditSlide={triggerEditSlide}
                  onEditTriggered={handleEditTriggered}
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
            onTriggerEdit={handleTriggerEdit}
            onMultipleFieldUpdate={handleMultipleFieldUpdates}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
} 