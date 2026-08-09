import MobileGate from './components/MobileGate';
import useStories from './hooks/useStories';

function App() {
  const { users, loading, error, reload } = useStories();

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
        
        <main className="flex-1 flex flex-col pt-4 overflow-hidden">
          {loading && (
            <div className="flex gap-4 px-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-full animate-pulse bg-ig-surface shrink-0" />
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
            <div className="flex gap-4 px-4 overflow-x-auto pb-4 hide-scrollbar">
              {users.map(u => (
                <div key={u.id} className="text-ig-text shrink-0">{u.username}</div>
              ))}
            </div>
          )}
        </main>
      </div>
    </MobileGate>
  );
}

export default App;
