import { 
  AlertTriangle, Lightbulb, TrendingUp, Users, 
  DollarSign, Target, Calendar, Mail, FileText,
  BarChart3, Globe, Zap, Shield, Star, 
  Building, Rocket, Heart, Award, Briefcase
} from 'lucide-react';

export const slideIcons = {
  'problem': AlertTriangle,
  'solution': Lightbulb,
  'market': TrendingUp,
  'team': Users,
  'financials': DollarSign,
  'competition': Target,
  'timeline': Calendar,
  'contact': Mail,
  'analysis': BarChart3,
  'global': Globe,
  'innovation': Zap,
  'security': Shield,
  'achievement': Star,
  'company': Building,
  'launch': Rocket,
  'values': Heart,
  'awards': Award,
  'business': Briefcase,
  'default': FileText
};

export const iconStyles = {
  'problem': 'bg-red-100 text-red-600 border-red-200',
  'solution': 'bg-blue-100 text-blue-600 border-blue-200',
  'market': 'bg-green-100 text-green-600 border-green-200',
  'team': 'bg-purple-100 text-purple-600 border-purple-200',
  'financials': 'bg-yellow-100 text-yellow-600 border-yellow-200',
  'competition': 'bg-orange-100 text-orange-600 border-orange-200',
  'timeline': 'bg-indigo-100 text-indigo-600 border-indigo-200',
  'contact': 'bg-pink-100 text-pink-600 border-pink-200',
  'analysis': 'bg-cyan-100 text-cyan-600 border-cyan-200',
  'global': 'bg-teal-100 text-teal-600 border-teal-200',
  'innovation': 'bg-violet-100 text-violet-600 border-violet-200',
  'security': 'bg-emerald-100 text-emerald-600 border-emerald-200',
  'achievement': 'bg-amber-100 text-amber-600 border-amber-200',
  'company': 'bg-slate-100 text-slate-600 border-slate-200',
  'launch': 'bg-rose-100 text-rose-600 border-rose-200',
  'values': 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200',
  'awards': 'bg-lime-100 text-lime-600 border-lime-200',
  'business': 'bg-gray-100 text-gray-600 border-gray-200',
  'default': 'bg-gray-100 text-gray-600 border-gray-200'
};

export function detectSlideIcon(title: string, content: string): { key: string; icon: any } {
  const text = (title + ' ' + content).toLowerCase();
  
  // Problem-related keywords
  if (text.includes('problem') || text.includes('issue') || text.includes('pain') || 
      text.includes('challenge') || text.includes('difficulty') || text.includes('struggle')) {
    return { key: 'problem', icon: slideIcons.problem };
  }
  
  // Solution-related keywords
  if (text.includes('solution') || text.includes('product') || text.includes('innovation') ||
      text.includes('technology') || text.includes('platform') || text.includes('service')) {
    return { key: 'solution', icon: slideIcons.solution };
  }
  
  // Market-related keywords
  if (text.includes('market') || text.includes('industry') || text.includes('opportunity') ||
      text.includes('demand') || text.includes('growth') || text.includes('trend')) {
    return { key: 'market', icon: slideIcons.market };
  }
  
  // Team-related keywords
  if (text.includes('team') || text.includes('founder') || text.includes('leadership') ||
      text.includes('expertise') || text.includes('experience') || text.includes('background')) {
    return { key: 'team', icon: slideIcons.team };
  }
  
  // Financial-related keywords
  if (text.includes('financial') || text.includes('revenue') || text.includes('funding') ||
      text.includes('investment') || text.includes('profit') || text.includes('cost')) {
    return { key: 'financials', icon: slideIcons.financials };
  }
  
  // Competition-related keywords
  if (text.includes('competition') || text.includes('competitor') || text.includes('advantage') ||
      text.includes('differentiation') || text.includes('unique') || text.includes('edge')) {
    return { key: 'competition', icon: slideIcons.competition };
  }
  
  // Timeline-related keywords
  if (text.includes('timeline') || text.includes('roadmap') || text.includes('milestone') ||
      text.includes('schedule') || text.includes('plan') || text.includes('phase')) {
    return { key: 'timeline', icon: slideIcons.timeline };
  }
  
  // Analysis-related keywords
  if (text.includes('analysis') || text.includes('data') || text.includes('research') ||
      text.includes('study') || text.includes('survey') || text.includes('statistics')) {
    return { key: 'analysis', icon: slideIcons.analysis };
  }
  
  // Global-related keywords
  if (text.includes('global') || text.includes('international') || text.includes('worldwide') ||
      text.includes('expansion') || text.includes('scale') || text.includes('reach')) {
    return { key: 'global', icon: slideIcons.global };
  }
  
  // Innovation-related keywords
  if (text.includes('innovation') || text.includes('breakthrough') || text.includes('revolutionary') ||
      text.includes('cutting-edge') || text.includes('advanced') || text.includes('next-gen')) {
    return { key: 'innovation', icon: slideIcons.innovation };
  }
  
  // Security-related keywords
  if (text.includes('security') || text.includes('safety') || text.includes('protection') ||
      text.includes('secure') || text.includes('trust') || text.includes('reliable')) {
    return { key: 'security', icon: slideIcons.security };
  }
  
  // Achievement-related keywords
  if (text.includes('achievement') || text.includes('success') || text.includes('milestone') ||
      text.includes('accomplishment') || text.includes('win') || text.includes('trophy')) {
    return { key: 'achievement', icon: slideIcons.achievement };
  }
  
  // Company-related keywords
  if (text.includes('company') || text.includes('organization') || text.includes('business') ||
      text.includes('enterprise') || text.includes('corporation') || text.includes('firm')) {
    return { key: 'company', icon: slideIcons.company };
  }
  
  // Launch-related keywords
  if (text.includes('launch') || text.includes('release') || text.includes('deploy') ||
      text.includes('go-live') || text.includes('rollout') || text.includes('introduction')) {
    return { key: 'launch', icon: slideIcons.launch };
  }
  
  // Values-related keywords
  if (text.includes('values') || text.includes('mission') || text.includes('vision') ||
      text.includes('purpose') || text.includes('ethics') || text.includes('principles')) {
    return { key: 'values', icon: slideIcons.values };
  }
  
  // Awards-related keywords
  if (text.includes('awards') || text.includes('recognition') || text.includes('honors') ||
      text.includes('accolades') || text.includes('certification') || text.includes('accreditation')) {
    return { key: 'awards', icon: slideIcons.awards };
  }
  
  // Business-related keywords
  if (text.includes('business') || text.includes('strategy') || text.includes('model') ||
      text.includes('operations') || text.includes('management') || text.includes('execution')) {
    return { key: 'business', icon: slideIcons.business };
  }
  
  // Default fallback
  return { key: 'default', icon: slideIcons.default };
}