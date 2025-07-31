import React, { useState } from 'react';
import { ChatSidebarEnhanced } from './chat-sidebar-enhanced';
import { Slide } from '@/types/slide';
import { ChatMessage } from '@/types/slide';

// Sample slide for demo
const demoSlide: Slide = {
  id: 'demo-slide-1',
  position: 1,
  title: 'Problem Statement',
  content: 'Traditional customer service is slow, expensive, and inconsistent. Companies struggle with high response times and inconsistent service quality.',
  layout: 'two-column',
  icon: 'problem'
};

// Sample messages to show AI capabilities
const sampleMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: 'Hi! I\'m your AI slide editor. I can help you improve your slides by:\n\n• Making content more persuasive\n• Adding hero images\n• Improving titles and descriptions\n• Suggesting better layouts\n\nTry asking me to "make this slide more compelling" or "add a hero image"!',
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
  }
];

const samplePrompts = [
  "Make this slide more persuasive",
  "Add a hero image and make the title bolder",
  "Rewrite this with more impactful language",
  "Make the content more concise",
  "Add bullet points to the content",
  "Change the layout to a two-column design"
];

export function AiChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [slide, setSlide] = useState<Slide>(demoSlide);

  const handleSendMessage = (content: string, slideId?: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      slideId
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSlideUpdate = (slideId: string, updates: any) => {
    setSlide(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt, slide.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Agent Chat Demo
            </h1>
            <p className="text-gray-600 mb-6">
              This demo shows the AI agent's ability to understand slide context and provide intelligent suggestions.
            </p>
          </div>

          {/* Current Slide Display */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Slide</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{slide.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <p className="text-gray-900">{slide.content}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                <p className="text-gray-900">{slide.layout}</p>
              </div>
              {slide.heroImageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
                  <p className="text-gray-900">{slide.heroImageUrl}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Try These Prompts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm text-gray-900">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebarEnhanced
        messages={messages}
        activeSlide={slide}
        onSendMessage={handleSendMessage}
        onSlideUpdate={handleSlideUpdate}
        isLoading={false}
      />
    </div>
  );
} 