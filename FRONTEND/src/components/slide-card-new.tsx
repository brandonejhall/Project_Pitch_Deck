import React, { useMemo, useState, useRef } from 'react';
import { Mail, Phone, Linkedin, Edit3, Check, X } from 'lucide-react';
import { generateGradientConfig, generateThemeTokens } from '../lib/gradient-utils';
import { useResponsive } from '../hooks/use-responsive';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export interface Contact {
  type: 'email' | 'phone' | 'linkedin';
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  body: string;
  heroImageUrl?: string;
  contacts: Contact[];
}

interface SlideCardProps {
  project: Project;
  forcePalette?: string;
  forceSeed?: string;
  showNoise?: boolean;
  layout?: 'two-column' | 'single';
  onProjectUpdate?: (updatedProject: Project) => void;
  editable?: boolean;
}

// Mesh gradient component with deterministic blobs
function MeshGradient({ blobs, noise }: { blobs: any[], noise: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
      
      {/* Blob layers */}
      {blobs.map((blob, index) => (
        <div
          key={index}
          className="absolute rounded-full blur-3xl opacity-15"
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}rem`,
            height: `${blob.size}rem`,
            backgroundColor: blob.color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Optional noise overlay */}
      {noise && (
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
}

// Contact icon component
function ContactIcon({ type }: { type: Contact['type'] }) {
  switch (type) {
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'phone':
      return <Phone className="w-4 h-4" />;
    case 'linkedin':
      return <Linkedin className="w-4 h-4" />;
    default:
      return null;
  }
}

// Abstract placeholder for when no hero image is provided
function AbstractPlaceholder({ accentColor }: { accentColor: string }) {
  return (
    <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <div 
        className="w-24 h-24 rounded-full opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div 
        className="absolute top-4 right-4 w-12 h-12 rounded-lg opacity-15"
        style={{ backgroundColor: accentColor }}
      />
      <div 
        className="absolute bottom-4 left-4 w-16 h-8 rounded-full opacity-10"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

export function SlideCard({ 
  project, 
  forcePalette, 
  forceSeed, 
  showNoise, 
  layout = 'two-column',
  onProjectUpdate,
  editable = false
}: SlideCardProps) {
  const { isMobile } = useResponsive();
  
  // Editing state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingBody, setEditingBody] = useState(false);
  const [titleValue, setTitleValue] = useState(project.title);
  const [bodyValue, setBodyValue] = useState(project.body);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate deterministic gradient configuration
  const gradientConfig = useMemo(() => {
    const seed = forceSeed || project.id;
    return generateGradientConfig(seed, isMobile);
  }, [project.id, forceSeed, isMobile]);
  
  const theme = useMemo(() => 
    generateThemeTokens(gradientConfig.palette), 
    [gradientConfig.palette]
  );
  
  const noise = showNoise !== undefined ? showNoise : gradientConfig.noise;
  
  // Editing functions
  const handleTitleSave = () => {
    if (onProjectUpdate && titleValue.trim() !== project.title) {
      onProjectUpdate({ ...project, title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  const handleBodySave = () => {
    if (onProjectUpdate && bodyValue.trim() !== project.body) {
      onProjectUpdate({ ...project, body: bodyValue.trim() });
    }
    setEditingBody(false);
  };

  const handleTitleCancel = () => {
    setTitleValue(project.title);
    setEditingTitle(false);
  };

  const handleBodyCancel = () => {
    setBodyValue(project.body);
    setEditingBody(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'title' | 'body') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'title') handleTitleSave();
      else handleBodySave();
    } else if (e.key === 'Escape') {
      if (type === 'title') handleTitleCancel();
      else handleBodyCancel();
    }
  };

  const renderEditableTitle = () => {
    if (editingTitle && editable) {
      return (
        <div className="flex items-center gap-2">
          <Textarea
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            onBlur={handleTitleSave}
            className="font-semibold text-gray-900 leading-tight resize-none border-none bg-transparent focus:bg-gray-50 p-0"
            style={{ 
              fontSize: isMobile ? '2.25rem' : '2.75rem',
              lineHeight: 1.1
            }}
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
        <h1 
          className="font-semibold text-gray-900 leading-tight"
          style={{ 
            fontSize: isMobile ? '2.25rem' : '2.75rem',
            lineHeight: 1.1
          }}
        >
          {project.title}
        </h1>
        {editable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingTitle(true)}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };

  const renderEditableBody = () => {
    if (editingBody && editable) {
      return (
        <div className="space-y-2">
          <Textarea
            ref={bodyRef}
            value={bodyValue}
            onChange={(e) => setBodyValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'body')}
            onBlur={handleBodySave}
            className="text-gray-700 leading-relaxed resize-none border-none bg-transparent focus:bg-gray-50 p-0"
            style={{ 
              fontSize: isMobile ? '1rem' : '1.125rem',
              lineHeight: 1.6
            }}
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleBodySave} className="h-6 w-6 p-0">
              <Check className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleBodyCancel} className="h-6 w-6 p-0">
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="group relative">
        <p 
          className="text-gray-700 leading-relaxed"
          style={{ 
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.6
          }}
        >
          {project.body}
        </p>
        {editable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingBody(true)}
            className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="relative rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Mesh gradient background */}
        <MeshGradient blobs={gradientConfig.blobs} noise={noise} />
        
        {/* Content overlay with backdrop blur */}
        <div className="relative bg-white/90 backdrop-blur-sm p-6 sm:p-8">
          <div className={`grid gap-6 sm:gap-8 ${
            layout === 'two-column' 
              ? 'lg:grid-cols-12 lg:gap-8' 
              : 'grid-cols-1'
          }`}>
            
            {/* Left Column - Text Content */}
            <div className={`${
              layout === 'two-column' ? 'lg:col-span-7' : 'col-span-1'
            }`}>
              {/* Header */}
              <div className="mb-6">
                {renderEditableTitle()}
              </div>
              
              {/* Body */}
              <div className="space-y-4">
                {renderEditableBody()}
              </div>
            </div>
            
            {/* Right Column - Visual/Hero */}
            {layout === 'two-column' && (
              <div className="lg:col-span-5">
                <div className="aspect-square rounded-xl overflow-hidden">
                  {project.heroImageUrl ? (
                    <img
                      src={project.heroImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AbstractPlaceholder accentColor={theme.accent} />
                  )}
                </div>
              </div>
            )}
            
            {/* Mobile: Hero below header */}
            {layout === 'two-column' && isMobile && project.heroImageUrl && (
              <div className="col-span-1 mt-6">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={project.heroImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Footer - Contact Information */}
          {project.contacts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {project.contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                    style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }} // 12px mobile, 14px desktop
                  >
                    <ContactIcon type={contact.type} />
                    <span>{contact.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 