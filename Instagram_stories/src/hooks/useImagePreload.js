import { useState, useEffect } from 'react';

export default function useImagePreload(src) {
  const [state, setState] = useState({ loaded: false, error: false, currentSrc: src });

  if (src !== state.currentSrc) {
    setState({ loaded: false, error: false, currentSrc: src });
  }

  useEffect(() => {
    if (!src) return;

    let isMounted = true;

    const img = new Image();
    img.onload = () => {
      if (isMounted) setState(s => ({ ...s, loaded: true, error: false }));
    };
    img.onerror = () => {
      if (isMounted) setState(s => ({ ...s, loaded: false, error: true }));
    };
    img.src = src;

    if (img.complete && img.naturalWidth !== 0) {
      if (isMounted) setState(s => ({ ...s, loaded: true, error: false }));
    }

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}
