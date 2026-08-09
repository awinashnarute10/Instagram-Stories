import { useEffect, useState, useRef } from 'react';
import useStoryTimer from '../hooks/useStoryTimer';
import ProgressBars from './ProgressBars';
import useImagePreload from '../hooks/useImagePreload';
import Spinner from './Spinner';

export default function StoryViewer({ users, userIndex, storyIndex, onClose, onNext, onPrev }) {
  const [visible, setVisible] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const user = users[userIndex];
  const story = user.stories[storyIndex];

  const { loaded, error } = useImagePreload(story.image);

  // Cross-fade state: Keep track of previous stories for smooth transition
  const [renderStories, setRenderStories] = useState([story]);
  const [prevStoryId, setPrevStoryId] = useState(story.id);

  if (story.id !== prevStoryId) {
    const last = renderStories[renderStories.length - 1];
    if (last.id !== story.id) {
      setRenderStories([last, story]);
    }
    setPrevStoryId(story.id);
  }

  // Auto-advance if error occurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onNext();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, onNext]);

  // Preload surrounding stories
  useEffect(() => {
    const urlsToPreload = [];
    if (storyIndex < user.stories.length - 1) {
      urlsToPreload.push(user.stories[storyIndex + 1].image);
    }
    if (storyIndex > 0) {
      urlsToPreload.push(user.stories[storyIndex - 1].image);
    }
    if (userIndex < users.length - 1) {
      urlsToPreload.push(users[userIndex + 1].stories[0].image);
    }

    urlsToPreload.forEach(url => {
      if (url) new Image().src = url;
    });
  }, [users, userIndex, storyIndex, user]);

  const progress = useStoryTimer({
    duration: 5000,
    running: loaded && !isHolding && !isDragging && !error,
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

  // Pointer interaction refs
  const pointerStartY = useRef(null);
  const pointerCurrentY = useRef(null);
  const holdTimerRef = useRef(null);
  const isHoldActive = useRef(false);

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;

    pointerStartY.current = e.clientY;
    pointerCurrentY.current = e.clientY;
    isHoldActive.current = false;
    setIsHolding(false);
    setIsDragging(false);
    setDragY(0);

    holdTimerRef.current = setTimeout(() => {
      isHoldActive.current = true;
      setIsHolding(true);
    }, 200);
  };

  const handlePointerMove = (e) => {
    if (pointerStartY.current === null) return;
    
    pointerCurrentY.current = e.clientY;
    const dy = pointerCurrentY.current - pointerStartY.current;

    if (!isDragging && Math.abs(dy) > 10) {
      setIsDragging(true);
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      setIsHolding(false);
      isHoldActive.current = false;
    }

    if (isDragging) {
      setDragY(dy > 0 ? dy : 0);
    }
  };

  const handlePointerUp = (e) => {
    if (pointerStartY.current === null) return;
    
    const dy = pointerCurrentY.current - pointerStartY.current;
    
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (isDragging) {
      if (dy > 80) {
        handleClose();
      } else {
        setDragY(0); // Spring back
      }
    } else {
      if (isHoldActive.current) {
        setIsHolding(false); // Just resume
      } else {
        // Tap
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width * 0.3) {
          onPrev();
        } else {
          onNext();
        }
      }
    }

    pointerStartY.current = null;
    pointerCurrentY.current = null;
    setIsDragging(false);
    isHoldActive.current = false;
  };

  const handlePointerCancel = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    setIsHolding(false);
    setDragY(0);
    setIsDragging(false);
    pointerStartY.current = null;
    isHoldActive.current = false;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black ${
          isDragging ? 'transition-none' : 'transition-opacity duration-[250ms] ease-out'
        }`}
        style={{ opacity: visible ? Math.max(0, 1 - dragY / 500) : 0 }}
      />
      
      {/* Content Container */}
      <div
        className={`fixed inset-0 z-50 flex flex-col h-[100dvh] select-none ${
          isDragging ? 'transition-none' : 'transition-transform duration-[250ms] ease-out'
        }`}
        style={{
          transform: isDragging 
            ? `translateY(${dragY}px) scale(${Math.max(0.8, 1 - dragY / 1000)})` 
            : visible ? 'translateY(0) scale(1)' : 'translateY(0) scale(0.92)',
          touchAction: 'manipulation'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Images Background & State */}
        <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">
          {!loaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Spinner size="32px" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
              <p className="text-white/70 text-[14px]">Couldn't load this story</p>
            </div>
          )}
          
          {renderStories.map((s, i) => {
            const isCurrent = i === renderStories.length - 1;
            const isReady = isCurrent ? loaded : true;
            return (
              <img
                key={s.id}
                src={s.image}
                alt="story"
                onContextMenu={(e) => e.preventDefault()}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                } ${isCurrent ? 'z-10' : 'z-0'}`}
              />
            );
          })}
        </div>

        {/* UI Chrome (Header + Progress Bars) */}
        <div 
          className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-200 ${
            isHolding ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ProgressBars 
            count={user.stories.length} 
            activeIndex={storyIndex} 
            progress={progress} 
          />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          
          <header className="absolute top-0 inset-x-0 pt-[env(safe-area-inset-top)] mt-8 px-3 flex items-center justify-between">
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
      </div>
    </>
  );
}
