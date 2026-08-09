export default function ProgressBars({ count, activeIndex, progress }) {
  return (
    <div 
      className="absolute top-0 inset-x-0 z-50 flex gap-1 px-2 pointer-events-none"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 8px)' }}
    >
      {Array.from({ length: count }).map((_, i) => {
        let fillWidth = '0%';
        if (i < activeIndex) fillWidth = '100%';
        else if (i === activeIndex) fillWidth = `${progress * 100}%`;

        return (
          <div key={i} className="flex-1 h-[2px] rounded-full bg-white/30 overflow-hidden">
            <div 
              className="h-full bg-white"
              style={{ width: fillWidth }} // No transition intentionally
            />
          </div>
        );
      })}
    </div>
  );
}
