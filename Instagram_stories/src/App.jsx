import { useState, useEffect, useCallback } from 'react';
import MobileGate from './components/MobileGate';
import useStories from './hooks/useStories';
import StoryTray from './components/StoryTray';
import StoryViewer from './components/StoryViewer';

function App() {
  const { users, loading, error, reload } = useStories();
  const [seenUserIds, setSeenUserIds] = useState(new Set());
  const [viewer, setViewer] = useState(null); // null | { userIndex, storyIndex }

  // Preload first story of each user for instant initial open
  useEffect(() => {
    if (users) {
      users.forEach(u => {
        if (u.stories?.[0]?.image) {
          new Image().src = u.stories[0].image;
        }
      });
    }
  }, [users]);

  const handleUserClick = (user, index) => {
    setSeenUserIds(prev => {
      const next = new Set(prev);
      next.add(user.id);
      return next;
    });
    setViewer({
      userIndex: index,
      storyIndex: 0
    });
  };

  const handleCloseViewer = () => {
    setViewer(null);
  };

  const goNext = useCallback(() => {
    if (!viewer || !users) return;
    const { userIndex, storyIndex } = viewer;
    const currentUser = users[userIndex];
    
    if (storyIndex < currentUser.stories.length - 1) {
      setViewer({ userIndex, storyIndex: storyIndex + 1 });
    } else if (userIndex < users.length - 1) {
      const nextUser = users[userIndex + 1];
      setSeenUserIds(prev => new Set(prev).add(nextUser.id));
      setViewer({ userIndex: userIndex + 1, storyIndex: 0 });
    } else {
      handleCloseViewer();
    }
  }, [viewer, users]);

  const goPrev = useCallback(() => {
    if (!viewer || !users) return;
    const { userIndex, storyIndex } = viewer;
    
    if (storyIndex > 0) {
      setViewer({ userIndex, storyIndex: storyIndex - 1 });
    } else if (userIndex > 0) {
      const prevUser = users[userIndex - 1];
      setViewer({ userIndex: userIndex - 1, storyIndex: prevUser.stories.length - 1 });
    } else {
      setViewer({ userIndex, storyIndex: 0 });
    }
  }, [viewer, users]);

  useEffect(() => {
    if (!viewer) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') handleCloseViewer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewer, goNext, goPrev]);

  return (
    <MobileGate>
      <div className="h-[100dvh] bg-ig-black flex flex-col relative">
        <header className="flex-none h-[44px] flex items-center justify-between px-4 sticky top-0 z-10 bg-ig-black border-b border-ig-border">
          <div className="italic text-[22px] font-serif tracking-tight font-semibold text-ig-text">
            Insta Stories
          </div>
          <div className="flex items-center gap-4 text-ig-text">
            {/* Heart Icon */}
            <svg aria-label="Notifications" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {/* Send Icon */}
            <svg aria-label="Direct Messages" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col pt-0 overflow-hidden">
          {loading && (
            <div className="flex gap-4 px-3 py-3 overflow-hidden border-b border-ig-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-[74px] h-[74px] rounded-full animate-pulse bg-ig-surface" />
                  <div className="w-12 h-2.5 mt-1 rounded animate-pulse bg-ig-surface" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <p className="text-ig-text mb-4">Couldn't load stories</p>
              <button 
                onClick={reload}
                className="px-4 py-2 bg-ig-surface text-ig-text rounded-md border border-ig-border font-medium active:bg-ig-border transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && users && (
            <StoryTray 
              users={users} 
              seenUserIds={seenUserIds} 
              onUserClick={handleUserClick} 
            />
          )}
        </main>

        {viewer && (
          <StoryViewer
            users={users}
            userIndex={viewer.userIndex}
            storyIndex={viewer.storyIndex}
            onClose={handleCloseViewer}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </div>
    </MobileGate>
  );
}

export default App;
