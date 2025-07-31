import { useState, useRef, useEffect } from 'react';
import { Slide } from '@/types/slide';
import { getSlideIcon } from '@/lib/slide-icons';
import { MeshGradient } from './mesh-gradient';
import { Mail, Phone, Linkedin, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SlideCardProps {
  slide: Slide;
  className?: string;
  onSlideUpdate?: (updatedSlide: Slide) => void;
}

export function SlideCard({ slide, className = '', onSlideUpdate }: SlideCardProps) {
  const iconMapping = getSlideIcon(slide.icon);
  const IconComponent = iconMapping.icon;
  
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [titleValue, setTitleValue] = useState(slide.title);
  const [contentValue, setContentValue] = useState(slide.content);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when slide prop changes
  useEffect(() => {
    setTitleValue(slide.title);
    setContentValue(slide.content);
  }, [slide.title, slide.content]);

  const handleTitleSave = () => {
    if (onSlideUpdate && titleValue.trim() !== slide.title) {
      onSlideUpdate({ ...slide, title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  const handleContentSave = () => {
    if (onSlideUpdate && contentValue.trim() !== slide.content) {
      onSlideUpdate({ ...slide, content: contentValue.trim() });
    }
    setEditingContent(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(slide.title);
    setEditingTitle(false);
  };

  const handleContentCancel = () => {
    setContentValue(slide.content);
    setEditingContent(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'title' | 'content') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'title') handleTitleSave();
      else handleContentSave();
    } else if (e.key === 'Escape') {
      if (type === 'title') handleTitleCancel();
      else handleContentCancel();
    }
  };

  const renderEditableTitle = () => {
    if (editingTitle) {
      return (
        <div className="flex items-center gap-2">
          <Textarea
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            onBlur={handleTitleSave}
            className="text-title font-semibold leading-tight resize-none border-none bg-transparent focus:bg-gray-50 p-0 text-gray-700"
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleTitleSave} className="h-6 w-6 p-0">
              <Check className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleTitleCancel} className="h-6 w-6 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 group">
        <h1 className="text-title text-gray-700">{slide.title}</h1>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditingTitle(true)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      </div>
    );
  };

  const renderEditableContent = () => {
    if (editingContent) {
      return (
        <div className="space-y-2">
          <Textarea
            ref={contentRef}
            value={contentValue}
            onChange={(e) => setContentValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'content')}
            onBlur={handleContentSave}
            className="text-body leading-relaxed resize-none border-none bg-transparent focus:bg-gray-50 p-0 text-gray-600"
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleContentSave} className="h-6 w-6 p-0">
              <Check className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleContentCancel} className="h-6 w-6 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="group relative">
        <div className="text-body text-gray-600 leading-relaxed">{slide.content}</div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditingContent(true)}
          className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      </div>
    );
  };
  
  const renderLayout = () => {
    switch (slide.layout) {
      case 'two-column':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <IconComponent className={`w-8 h-8 ${iconMapping.colorClass} flex-shrink-0`} />
                {renderEditableTitle()}
              </div>
              {renderEditableContent()}
            </div>
            <div className="flex items-center justify-center">
              {slide.heroImageUrl ? (
                <img 
                  src={slide.heroImageUrl} 
                  alt={slide.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl glass-card"
                />
              ) : (
                <div className="w-full h-64 lg:h-80 glass-card flex items-center justify-center">
                  <IconComponent className={`w-16 h-16 ${iconMapping.colorClass} opacity-50`} />
                </div>
              )}
            </div>
          </div>
        );
        
      case 'hero':
        return (
          <div className="flex items-center justify-center h-full text-center content-overlay">
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-8">
                <IconComponent className={`w-12 h-12 ${iconMapping.colorClass}`} />
              </div>
              {renderEditableTitle()}
              {renderEditableContent()}
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <IconComponent className={`w-8 h-8 ${iconMapping.colorClass}`} />
              {renderEditableTitle()}
            </div>
            {renderEditableContent()}
          </div>
        );
        
      case 'grid':
        const sections = slide.content.split('\n\n').filter(section => section.trim());
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <IconComponent className={`w-8 h-8 ${iconMapping.colorClass}`} />
              {renderEditableTitle()}
            </div>
            {renderEditableContent()}
          </div>
        );
        
      default: // 'full-width'
        return (
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <IconComponent className={`w-8 h-8 ${iconMapping.colorClass} flex-shrink-0 mt-1`} />
              {renderEditableTitle()}
            </div>
            {renderEditableContent()}
            {slide.heroImageUrl && (
              <div className="mt-8">
                <img 
                  src={slide.heroImageUrl} 
                  alt={slide.title}
                  className="w-full max-w-2xl h-64 object-cover rounded-xl glass-card mx-auto"
                />
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <div className={`min-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-lg ${className}`}>
      <MeshGradient slideId={slide.id} className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl" />
      </MeshGradient>
      <div className="relative z-10 p-8 lg:p-12 h-full">
        <div className="h-full flex flex-col">
          <div className="flex-1">
            {renderLayout()}
          </div>
          
          {/* Footer with contact info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-footer text-gray-600">
              <div className="flex items-center gap-2 interactive-hover">
                <Mail className="w-4 h-4" />
                <span>contact@company.com</span>
              </div>
              <div className="flex items-center gap-2 interactive-hover">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 interactive-hover">
                <Linkedin className="w-4 h-4" />
                <span>company-linkedin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}