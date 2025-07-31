// Deterministic gradient generation utilities
// Uses project ID as seed for consistent gradients per project

export interface GradientBlob {
  color: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  size: number; // rem units
}

export interface GradientPalette {
  name: string;
  colors: string[];
  accent: string; // for links/CTAs
}

// Predefined palettes for consistent theming
export const GRADIENT_PALETTES: GradientPalette[] = [
  {
    name: 'cool-professional',
    colors: ['#3b82f6', '#10b981', '#ec4899'],
    accent: '#3b82f6'
  },
  {
    name: 'vibrant',
    colors: ['#14b8a6', '#8b5cf6', '#f59e0b'],
    accent: '#14b8a6'
  },
  {
    name: 'tech',
    colors: ['#06b6d4', '#6366f1', '#f43f5e'],
    accent: '#06b6d4'
  },
  {
    name: 'bold',
    colors: ['#10b981', '#8b5cf6', '#ef4444'],
    accent: '#10b981'
  }
];

// Simple hash function to convert string to number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

// Generate deterministic gradient configuration from project ID
export function generateGradientConfig(projectId: string, isMobile: boolean = false) {
  const hash = hashString(projectId);
  const random = seededRandom(hash);
  
  // Select palette deterministically
  const paletteIndex = Math.floor(random() * GRADIENT_PALETTES.length);
  const palette = GRADIENT_PALETTES[paletteIndex];
  
  // Generate blobs
  const blobCount = isMobile ? 3 : 4;
  const blobs: GradientBlob[] = [];
  
  for (let i = 0; i < blobCount; i++) {
    // Ensure blobs don't overlap too much and stay away from edges
    let attempts = 0;
    let x: number, y: number;
    
    do {
      x = 20 + random() * 60; // 20-80% range
      y = 20 + random() * 60; // 20-80% range
      attempts++;
    } while (
      attempts < 10 && 
      blobs.some(blob => 
        Math.sqrt((blob.x - x) ** 2 + (blob.y - y) ** 2) < 30
      )
    );
    
    const color = palette.colors[i % palette.colors.length];
    const size = 20 + random() * 8; // 20-28rem range
    
    blobs.push({ color, x, y, size });
  }
  
  return {
    palette,
    blobs,
    noise: random() > 0.5 // 50% chance of noise overlay
  };
}

// Generate theme tokens from palette
export function generateThemeTokens(palette: GradientPalette) {
  return {
    accent: palette.accent,
    surface: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(0, 0, 0, 0.1)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280'
  };
} 