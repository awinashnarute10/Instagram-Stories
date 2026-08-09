import { useState, useEffect, useRef } from 'react';

export default function useStoryTimer({ duration = 5000, running, onComplete, resetKey }) {
  const [progress, setProgress] = useState(0);
  
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;

    lastTimeRef.current = performance.now();

    const loop = (time) => {
      const delta = time - (lastTimeRef.current || time);
      lastTimeRef.current = time;

      elapsedRef.current += delta;
      
      const p = Math.min(elapsedRef.current / duration, 1);
      setProgress(p);

      if (p >= 1) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        onCompleteRef.current?.();
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, duration, resetKey]);

  return progress;
}
