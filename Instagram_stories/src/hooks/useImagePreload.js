import { useState, useEffect } from 'react';

export default function useImagePreload(src) {
  const [state, setState] = useState({ loaded: false, error: false });

  useEffect(() => {
    if (!src) {
      setState({ loaded: false, error: false });
      return;
    }

    let isMounted = true;
    setState({ loaded: false, error: false });

    const img = new Image();
    img.onload = () => {
      if (isMounted) setState({ loaded: true, error: false });
    };
    img.onerror = () => {
      if (isMounted) setState({ loaded: false, error: true });
    };
    img.src = src;

    return () => {
      isMounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}
