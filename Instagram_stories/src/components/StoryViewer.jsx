import { useEffect, useState } from 'react';
import useStoryTimer from '../hooks/useStoryTimer';
import ProgressBars from './ProgressBars';
import useImagePreload from '../hooks/useImagePreload';
import Spinner from './Spinner';

export default function StoryViewer({ users, userIndex, storyIndex, onClose, onNext, onPrev }) {
  const [visible, setVisible] = useState(false);

  const user = users[userIndex];
  const story = user.stories[storyIndex];

  const { loaded, error } = useImagePreload(story.image);

  // Auto-advance if error occurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onNext();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, onNext]);

  // Preload surrounding stories for instant navigation
  useEffect(() => {
    const urlsToPreload = [];
    
    // Next story in current user
    if (storyIndex < user.stories.length - 1) {
      urlsToPreload.push(user.stories[storyIndex + 1].image);
    }
    // Previous story in current user
    if (storyIndex > 0) {
      urlsToPreload.push(user.stories[storyIndex - 1].image);
    }
    // Next user's first story
    if (userIndex < users.length - 1) {
      urlsToPreload.push(users[userIndex + 1].stories[0].image);
    }

    urlsToPreload.forEach(url => {
      if (url) {
        new Image().src = url;
      }
    });
  }, [users, userIndex, storyIndex, user]);

  const progress = useStoryTimer({
    duration: 5000,
    running: loaded,
    onComplete: onNext,
    resetKey: `${userIndex}-${storyIndex}`,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250); 
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex flex-col h-[100dvh] transition-all duration-[250ms] ease-out select-none ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.92]'
      }`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Spinner size="32px" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-0 px-6 text-center">
          <p className="text-white/70 text-[14px]">Couldn't load this story</p>
        </div>
      )}

      <img
        src={story.image}
        alt="story"
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Tap Zones */}
      <div className="absolute inset-y-0 left-0 w-[30%] z-10" onClick={onPrev} />
      <div className="absolute inset-y-0 right-0 w-[70%] z-10" onClick={onNext} />

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
