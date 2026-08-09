import { useState, useEffect } from 'react';

export default function MobileGate({ children }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };

    // Modern way to listen to matchMedia
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Set initial value just in case it changed before hydration
    setIsMobile(mediaQuery.matches);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  if (isMobile) {
    return children;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ig-black text-ig-text p-6 text-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mb-4 text-ig-muted"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>
      <h1 className="text-2xl font-semibold mb-2">Mobile only</h1>
      <p className="text-ig-muted max-w-sm">
        Open this on a phone or use device toolbar in DevTools (390 x 844).
      </p>
    </div>
  );
}
