import { useState, useEffect } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    function updateResponsive() {
      const width = window.innerWidth;
      setIsMobile(width <= 640);
      setIsTablet(width > 640 && width <= 1024);
      setIsDesktop(width > 1024);
    }

    // Set initial value
    updateResponsive();

    // Add event listener
    window.addEventListener('resize', updateResponsive);

    // Cleanup
    return () => window.removeEventListener('resize', updateResponsive);
  }, []);

  return { isMobile, isTablet, isDesktop };
} 