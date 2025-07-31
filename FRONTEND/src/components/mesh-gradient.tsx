import { useMemo } from 'react';

interface MeshGradientProps {
  slideId: string;
  className?: string;
  children?: React.ReactNode;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function seedRandom(seed: number) {
  return {
    next: function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }
  };
}

export function MeshGradient({ slideId, className = '', children }: MeshGradientProps) {
  const gradientStyle = useMemo(() => {
    const hash = hashString(slideId);
    const rng = seedRandom(hash);
    
    // Select palette based on hash
    const paletteIndex = Math.floor(rng.next() * 4) + 1;
    
    // Generate blob positions and sizes
    const blobs = [];
    const blobCount = window.innerWidth <= 640 ? 3 : 4;
    
    for (let i = 0; i < blobCount; i++) {
      const x = Math.floor(rng.next() * 60) + 20; // 20-80% (more contained)
      const y = Math.floor(rng.next() * 60) + 20; // 20-80% (more contained)
      const size = Math.floor(rng.next() * 8) + 20; // 20-28rem (smaller blobs)
      
      blobs.push({
        x,
        y,
        size,
        color: ['a', 'b', 'c'][i % 3]
      });
    }
    
    const gradients = blobs.map((blob, index) => 
      `radial-gradient(circle at ${blob.x}% ${blob.y}%, hsl(var(--mesh-palette-${paletteIndex}-${blob.color})) 0%, transparent 40%)`
    ).join(', ');
    
    return {
      background: gradients,
      opacity: 0.15,
      mixBlendMode: 'multiply' as const
    };
  }, [slideId]);
  
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Mesh gradient background */}
      <div 
        className="absolute inset-0 animate-mesh-float rounded-2xl"
        style={gradientStyle}
      />
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}