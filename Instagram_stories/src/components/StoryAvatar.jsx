export default function StoryAvatar({ user, seen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 active:scale-95 transition-transform duration-150 focus:outline-none shrink-0"
    >
      {/* Outer Ring */}
      <div 
        className={`w-[74px] h-[74px] rounded-full flex items-center justify-center transition-[background] duration-300 shrink-0 ${
          seen 
            ? 'bg-ig-border' 
            : 'bg-[conic-gradient(from_180deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5,#feda75)]'
        }`}
      >
        {/* Inner Black Gap */}
        <div className="w-[68px] h-[68px] bg-ig-black rounded-full flex items-center justify-center shrink-0">
          {/* Avatar Image */}
          <img
            src={user.avatar}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover block shrink-0"
          />
        </div>
      </div>
      
      {/* Username */}
      <span className="text-[11px] text-ig-muted max-w-[64px] truncate text-center leading-tight">
        {user.username}
      </span>
    </button>
  );
}
