import { useState } from 'react';
import { ChatMessage } from '@/types/slide';
import { detectSlideIcon, iconStyles } from '@/lib/slide-icons';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApi } from '@/hooks/use-api';
import { toast } from '@/hooks/use-toast';

interface ChatSidebarProps {
  messages: ChatMessage[];
  activeSlideId?: string;
  onSendMessage: (content: string, slideId?: string) => void;
  isLoading?: boolean;
}

export function ChatSidebar({ 
  messages, 
  activeSlideId, 
  onSendMessage, 
  isLoading = false 
}: ChatSidebarProps) {
  const [input, setInput] = useState('');
  const { loading: apiLoading } = useApi();

  const handleSend = () => {
    if (input.trim() && !isLoading && !apiLoading) {
      onSendMessage(input.trim(), activeSlideId);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeSlideIcon = activeSlideId ? detectSlideIcon('', '') : null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-section text-gray-900">AI Assistant</h2>
          {activeSlideId && activeSlideIcon && (
            <div className="flex items-center gap-2 text-footer text-gray-500">
              <div className={`w-3 h-3 p-0.5 rounded ${iconStyles[activeSlideIcon.key as keyof typeof iconStyles] || iconStyles.default}`}>
                <activeSlideIcon.icon className="w-full h-full" />
              </div>
              <span>Context: Active slide</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-footer">Ask me anything about your pitch deck!</p>
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
          placeholder="Ask about this slide or your pitch deck..."
          className="min-h-[80px] resize-none bg-gray-50 border-gray-200 focus:border-primary/50 text-gray-900"
          disabled={isLoading}
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