import { useState, useEffect, useCallback } from 'react';

export default function useStories() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStories = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/stories.json', { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch stories');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchStories(controller.signal);
    return () => controller.abort();
  }, [fetchStories]);

  const reload = useCallback(() => {
    fetchStories();
  }, [fetchStories]);

  return { users, loading, error, reload };
}
