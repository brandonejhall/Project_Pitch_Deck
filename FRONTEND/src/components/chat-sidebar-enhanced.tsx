import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/slide';
import { Slide } from '@/types/slide';
import { getSlideIcon } from '@/lib/slide-icons';
import { Send, Bot, User, Check, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

interface ChatSidebarEnhancedProps {
  messages: ChatMessage[];
  activeSlide?: Slide;
  onSendMessage: (content: string, slideId?: string) => void;
  onSlideUpdate?: (slideId: string, updates: any) => void;
  isLoading?: boolean;
}

interface PendingUpdate {
  slideId: string;
  updates: any;
  messageId: string;
}

export function ChatSidebarEnhanced({ 
  messages, 
  activeSlide, 
  onSendMessage, 
  onSlideUpdate,
  isLoading = false 
}: ChatSidebarEnhancedProps) {
  const [input, setInput] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);
  const { chatRequest, loading: apiLoading } = useApi();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading && !apiLoading) {
      const userMessage = input.trim();
      setInput('');
      
      // Add user message immediately
      onSendMessage(userMessage, activeSlide?.id);
      
      try {
        // Prepare slide data for context
        const slideData = activeSlide ? {
          id: activeSlide.id,
          title: activeSlide.title,
          content: activeSlide.content,
          heroImageUrl: activeSlide.heroImageUrl,
          layout: activeSlide.layout || 'two-column'
        } : undefined;

        // Send to AI agent
        const response = await chatRequest({
          prompt: userMessage,
          slide_id: activeSlide ? parseInt(activeSlide.id) : 1,
          slideData
        });

        // Add AI response
        onSendMessage(response.edit, activeSlide?.id);

        // Handle slide updates if provided
        if (response.slideUpdates && activeSlide && onSlideUpdate) {
          const updateId = `update-${Date.now()}`;
          setPendingUpdates(prev => [...prev, {
            slideId: activeSlide.id,
            updates: response.slideUpdates,
            messageId: updateId
          }]);

          // Auto-apply updates after a short delay
          setTimeout(() => {
            onSlideUpdate(activeSlide.id, response.slideUpdates);
            setPendingUpdates(prev => prev.filter(u => u.messageId !== updateId));
            toast({
              title: "Slide Updated",
              description: "AI suggestions have been applied to your slide.",
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Chat request failed:', error);
        onSendMessage("I'm having trouble processing your request. Please try again.", activeSlide?.id);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAcceptUpdate = (pendingUpdate: PendingUpdate) => {
    if (onSlideUpdate) {
      onSlideUpdate(pendingUpdate.slideId, pendingUpdate.updates);
      setPendingUpdates(prev => prev.filter(u => u.messageId !== pendingUpdate.messageId));
      toast({
        title: "Update Applied",
        description: "Changes have been applied to your slide.",
      });
    }
  };

  const handleRejectUpdate = (pendingUpdate: PendingUpdate) => {
    setPendingUpdates(prev => prev.filter(u => u.messageId !== pendingUpdate.messageId));
    toast({
      title: "Update Rejected",
      description: "Changes have been discarded.",
    });
  };

  const activeSlideIcon = activeSlide ? getSlideIcon() : null;

  const formatUpdateSummary = (updates: any) => {
    const changes = [];
    if (updates.title) changes.push('title');
    if (updates.content) changes.push('content');
    if (updates.heroImageUrl) changes.push('hero image');
    if (updates.layout) changes.push('layout');
    
    return changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No changes';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <h2 className="text-section text-gray-900">AI Assistant</h2>
          {activeSlide && activeSlideIcon && (
            <div className="flex items-center gap-2 text-footer text-gray-500">
              <activeSlideIcon.icon className={`w-3 h-3 ${activeSlideIcon.colorClass}`} />
              <span>Context: {activeSlide.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-footer">Start a conversation to improve your slides</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`flex-1 max-w-[85%] ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-3 rounded-lg text-body ${
                    message.role === 'user'
                      ? 'bg-primary/20 text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Pending Updates */}
          {pendingUpdates.map((pendingUpdate) => (
            <div key={pendingUpdate.messageId} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm text-blue-900 mb-2">
                    {formatUpdateSummary(pendingUpdate.updates)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptUpdate(pendingUpdate)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectUpdate(pendingUpdate)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-lg bg-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeSlide 
            ? `Ask me to improve "${activeSlide.title}"...` 
            : "Ask about your pitch deck..."
          }
          className="min-h-[80px] resize-none bg-gray-50 border-gray-200 focus:border-primary/50 text-gray-900"
          disabled={isLoading || apiLoading}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || apiLoading}
          className="w-full interactive-hover"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </div>
    </div>
  );
} 