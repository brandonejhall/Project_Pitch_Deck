import React from 'react';
import { SlideCard, Project } from './slide-card-new';

interface SlidesPageProps {
  projects: Project[];
  layout?: 'two-column' | 'single';
  showNoise?: boolean;
  onProjectUpdate?: (updatedProject: Project) => void;
  editable?: boolean;
}

export function SlidesPage({ projects, layout = 'two-column', showNoise, onProjectUpdate, editable }: SlidesPageProps) {
  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      <div className="py-8 sm:py-12 space-y-8 sm:space-y-12">
        {projects.map((project, index) => (
          <SlideCard
            key={project.id}
            project={project}
            layout={layout}
            showNoise={showNoise}
            onProjectUpdate={onProjectUpdate}
            editable={editable}
          />
        ))}
      </div>
    </div>
  );
}

// Example usage with sample data
export function SlidesPageExample() {
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
    }
  ];

  return <SlidesPage projects={sampleProjects} />;
} 