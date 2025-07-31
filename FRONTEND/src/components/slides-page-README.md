# Slides Page Implementation

## Overview

This implementation provides a professional slides page with deterministic mesh gradient backgrounds, responsive layout, and proper typography hierarchy as specified in the requirements.

## Components

### 1. `SlideCard` (`slide-card-new.tsx`)

**Features:**
- Deterministic mesh gradient backgrounds based on project ID
- Two-column layout (text + visual) with responsive behavior
- Proper typography hierarchy (36-48px title, 16-18px body, 12-14px footer)
- Contact information with icons in footer
- Abstract placeholder when no hero image is provided
- Accessibility features (keyboard navigation, focus rings)

**Props:**
```typescript
interface SlideCardProps {
  project: Project;
  forcePalette?: string;
  forceSeed?: string;
  showNoise?: boolean;
  layout?: 'two-column' | 'single';
}
```

**Usage:**
```typescript
import { SlideCard } from './slide-card-new';

const project = {
  id: 'unique-project-id',
  title: 'Problem Statement',
  body: 'Detailed problem description...',
  heroImageUrl: 'https://example.com/image.jpg',
  contacts: [
    { type: 'email', label: 'hello@example.com', href: 'mailto:hello@example.com' },
    { type: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' }
  ]
};

<SlideCard project={project} layout="two-column" showNoise={true} />
```

### 2. `SlidesPage` (`slides-page.tsx`)

**Features:**
- Renders multiple SlideCard instances
- Responsive spacing and layout
- Clean background with proper padding

**Props:**
```typescript
interface SlidesPageProps {
  projects: Project[];
  layout?: 'two-column' | 'single';
  showNoise?: boolean;
}
```

### 3. Gradient Utilities (`gradient-utils.ts`)

**Features:**
- Deterministic gradient generation using project ID as seed
- 4 predefined color palettes (cool-professional, vibrant, tech, bold)
- Responsive blob count (3 on mobile, 4 on desktop)
- Seeded random number generation for consistent results

**Key Functions:**
- `generateGradientConfig(projectId, isMobile)` - Creates gradient configuration
- `generateThemeTokens(palette)` - Generates theme tokens from palette
- `hashString(str)` - Simple hash function for seeding

## Data Model

### Project Interface
```typescript
interface Project {
  id: string;           // Used as seed for gradient generation
  title: string;        // Slide header (36-48px)
  body: string;         // Main content (16-18px)
  heroImageUrl?: string; // Optional visual asset
  contacts: Contact[];   // Footer contact information
}

interface Contact {
  type: 'email' | 'phone' | 'linkedin';
  label: string;
  href: string;
}
```

## Gradient System

### Deterministic Generation
- Each project ID generates a unique but consistent gradient
- Uses seeded random number generation for reproducibility
- Palette selection is deterministic based on project ID hash

### Blob Configuration
- **Desktop**: 4 blobs, positioned 20-80% from edges
- **Mobile**: 3 blobs, reduced blur for performance
- **Size Range**: 20-28rem for optimal visual impact
- **Colors**: Selected from predefined palettes

### Performance Optimizations
- Blob count scales with screen size
- Blur effects reduced on mobile
- No animations by default
- Efficient CSS transforms and opacity

## Typography Hierarchy

### Font Sizes (Responsive)
- **Title**: 36px (mobile) / 44px (desktop)
- **Body**: 16px (mobile) / 18px (desktop)  
- **Footer**: 12px (mobile) / 14px (desktop)

### Line Heights
- **Title**: 1.1 (tight)
- **Body**: 1.6 (comfortable reading)
- **Footer**: Default (compact)

## Responsive Behavior

### Breakpoints
- **≤640px**: Single column, reduced blobs, tighter spacing
- **641-1024px**: Two columns with balanced spacing
- **≥1025px**: Full layout with larger title and four blobs

### Layout Changes
- **Desktop**: 12-col grid (7+5 split)
- **Tablet**: Stacked but maintains spacing rhythm
- **Mobile**: Single column, hero below header

## Accessibility Features

### WCAG AA Compliance
- All text meets contrast requirements
- Semi-transparent overlays added when needed
- Focus rings visible on interactive elements

### Keyboard Navigation
- Logical tab order through content
- Focusable contact links with visible focus rings
- Proper ARIA labels and alt text

### Reduced Motion
- Respects `prefers-reduced-motion`
- No animations by default
- Smooth transitions only when appropriate

## Usage Examples

### Basic Usage
```typescript
import { SlidesPage } from './slides-page';

const projects = [
  {
    id: 'project-1',
    title: 'Executive Summary',
    body: 'Our revolutionary AI platform...',
    contacts: [
      { type: 'email', label: 'contact@company.com', href: 'mailto:contact@company.com' }
    ]
  }
];

<SlidesPage projects={projects} />
```

### With Custom Configuration
```typescript
<SlidesPage 
  projects={projects}
  layout="single"
  showNoise={false}
/>
```

### Individual Slide Card
```typescript
import { SlideCard } from './slide-card-new';

<SlideCard 
  project={project}
  forceSeed="custom-seed"
  showNoise={true}
  layout="two-column"
/>
```

## Demo Page

Visit `/slides-demo` to see the implementation in action with:
- Interactive controls for layout and noise
- Sample projects with different configurations
- Real-time responsive behavior
- Deterministic gradient verification

## Technical Notes

### Seeding Logic
The gradient generation uses a simple but effective hashing algorithm:
1. Convert project ID string to numeric hash
2. Use hash as seed for pseudo-random number generator
3. Generate deterministic positions, sizes, and palette selection
4. Ensure consistent results across reloads and routes

### Performance Considerations
- Blob count scales with device capability
- Blur effects optimized for mobile GPUs
- Efficient CSS transforms and opacity
- No heavy animations or effects

### Browser Compatibility
- Modern CSS features (backdrop-blur, grid)
- Graceful fallbacks for older browsers
- Progressive enhancement approach

## Testing Checklist

- [ ] Gradient determinism verified (same project ID = same gradient)
- [ ] Contrast tested on all generated palettes
- [ ] Mobile performance acceptable (no jank)
- [ ] Keyboard navigation works end-to-end
- [ ] Long text wraps properly
- [ ] Missing hero image shows placeholder
- [ ] No horizontal scrollbars at common widths
- [ ] Responsive behavior at all breakpoints 