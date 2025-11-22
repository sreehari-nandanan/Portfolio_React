import { useState, useEffect } from 'react';

export const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet };
};

export const disableMobileAnimations = () => {
  if (window.innerWidth <= 768) {
    document.body.classList.add('mobile-device');
  }
};

export const optimizeMobilePerformance = () => {
  if (window.innerWidth <= 768) {
    // Disable GSAP animations on mobile
    const style = document.createElement('style');
    style.innerHTML = `
      .mobile-device * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
};
