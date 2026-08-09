import { useEffect, useState } from 'react';
import useStoryTimer from '../hooks/useStoryTimer';
import ProgressBars from './ProgressBars';

export default function StoryViewer({ users, userIndex, storyIndex, onClose, onNext, onPrev }) {
  const [visible, setVisible] = useState(false);

  const progress = useStoryTimer({
    duration: 5000,
    running: true, // we'll control this with image loading later
    onComplete: onNext,
    resetKey: `${userIndex}-${storyIndex}`,
  });

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Trigger enter animation on next frame to ensure starting styles are applied
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250); // wait for fade out
  };

  const user = users[userIndex];
  const story = user.stories[storyIndex];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex flex-col h-[100dvh] transition-all duration-[250ms] ease-out select-none ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.92]'
      }`}
    >
      <img
        key={story.id}
        src={story.image}
        alt="story"
        className="absolute inset-0 w-full h-full object-contain"
      />
      
      {/* Tap Zones */}
      <div 
        className="absolute inset-y-0 left-0 w-[30%] z-10" 
        onClick={onPrev}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[70%] z-10" 
        onClick={onNext}
      />

      <ProgressBars 
        count={user.stories.length} 
        activeIndex={storyIndex} 
        progress={progress} 
      />

      {/* Top Gradient Overlay */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Header */}
      <header className="absolute top-0 inset-x-0 z-20 pt-[env(safe-area-inset-top)] mt-8 px-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-8 h-8 rounded-full object-cover shrink-0" 
          />
          <span className="text-white text-[13px] font-semibold">{user.username}</span>
          <span className="text-ig-muted text-[13px]">{story.postedAt}</span>
        </div>
        
        <button 
          onClick={handleClose}
          className="w-11 h-11 flex items-center justify-center shrink-0 active:opacity-50 pointer-events-auto"
          aria-label="Close"
        >
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>
    </div>
  );
}
