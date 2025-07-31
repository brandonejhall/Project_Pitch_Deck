import {
  BarChart3,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Trophy,
  BarChart,
  Users,
  Target,
  FileText,
  type LucideIcon
} from 'lucide-react';

export interface SlideIconMapping {
  key: string;
  icon: LucideIcon;
  colorClass: string;
  category: string;
}

export const slideIcons: SlideIconMapping[] = [
  {
    key: 'executive-summary',
    icon: BarChart3,
    colorClass: 'icon-overview',
    category: 'overview'
  },
  {
    key: 'problem',
    icon: AlertTriangle,
    colorClass: 'icon-problem',
    category: 'problem'
  },
  {
    key: 'solution',
    icon: Lightbulb,
    colorClass: 'icon-solution',
    category: 'solution'
  },
  {
    key: 'market-analysis',
    icon: TrendingUp,
    colorClass: 'icon-analysis',
    category: 'analysis'
  },
  {
    key: 'business-model',
    icon: DollarSign,
    colorClass: 'icon-financial',
    category: 'financial'
  },
  {
    key: 'competitive-advantage',
    icon: Trophy,
    colorClass: 'icon-advantage',
    category: 'advantage'
  },
  {
    key: 'financial-projections',
    icon: BarChart,
    colorClass: 'icon-financial',
    category: 'financial'
  },
  {
    key: 'team',
    icon: Users,
    colorClass: 'icon-people',
    category: 'people'
  },
  {
    key: 'call-to-action',
    icon: Target,
    colorClass: 'icon-action',
    category: 'action'
  }
];

// Keywords to detect slide types
const slideKeywords = {
  'executive-summary': ['executive', 'summary', 'overview', 'introduction'],
  'problem': ['problem', 'challenge', 'issue', 'pain', 'struggle'],
  'solution': ['solution', 'solve', 'fix', 'approach', 'method'],
  'market-analysis': ['market', 'analysis', 'research', 'size', 'opportunity'],
  'business-model': ['business', 'model', 'revenue', 'monetization', 'pricing'],
  'competitive-advantage': ['competitive', 'advantage', 'differentiation', 'unique'],
  'financial-projections': ['financial', 'projections', 'forecast', 'revenue', 'growth'],
  'team': ['team', 'founder', 'leadership', 'staff', 'people'],
  'call-to-action': ['action', 'invest', 'contact', 'next', 'steps']
};

export function detectSlideIcon(title: string, content: string): SlideIconMapping {
  const text = `${title} ${content}`.toLowerCase();
  
  for (const [key, keywords] of Object.entries(slideKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      const mapping = slideIcons.find(icon => icon.key === key);
      if (mapping) return mapping;
    }
  }
  
  // Fallback to generic document icon
  return {
    key: 'default',
    icon: FileText,
    colorClass: 'icon-overview',
    category: 'default'
  };
}

export function getSlideIcon(iconKey?: string): SlideIconMapping {
  if (!iconKey) {
    return slideIcons[0]; // Default to executive summary
  }
  
  return slideIcons.find(icon => icon.key === iconKey) || slideIcons[0];
}