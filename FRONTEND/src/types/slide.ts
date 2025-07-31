export interface Slide {
  id: string;
  position: number;
  title: string;
  content: string;
  heroImageUrl?: string;
  icon?: string;
  layout?: 'two-column' | 'full-width' | 'hero' | 'list' | 'grid';
}

export interface PitchDeck {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  slideId?: string;
}