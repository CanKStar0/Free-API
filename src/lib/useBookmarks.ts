'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';

const LOCAL_STORAGE_KEY = 'api_showcase_bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { data: session } = useSession();

  // 1. Load initial bookmarks from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // 2. Sync with Supabase DB when user is logged in
  useEffect(() => {
    if (!session?.user?.id) return;

    async function syncWithDb() {
      try {
        // First, push any existing local bookmarks to the database
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        const localList: string[] = saved ? JSON.parse(saved) : [];

        if (localList.length > 0) {
          await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slugs: localList }),
          });
        }

        // Fetch authoritative list from DB
        const res = await fetch('/api/bookmarks');
        const data = await res.json();
        if (res.ok && Array.isArray(data.bookmarks)) {
          setBookmarks(data.bookmarks);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.bookmarks));
        }
      } catch (err) {
        console.error('Failed to sync bookmarks with cloud:', err);
      }
    }

    syncWithDb();
  }, [session?.user?.id]);

  // 3. Toggle Bookmark
  const toggleBookmark = useCallback(
    async (apiName: string) => {
      setBookmarks((prev) => {
        const isCurrentlyBookmarked = prev.includes(apiName);
        const next = isCurrentlyBookmarked
          ? prev.filter((name) => name !== apiName)
          : [...prev, apiName];

        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        // If logged in, update DB in background
        if (session?.user?.id) {
          if (isCurrentlyBookmarked) {
            fetch('/api/bookmarks', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiSlug: apiName }),
            }).catch(console.error);
          } else {
            fetch('/api/bookmarks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apiSlug: apiName }),
            }).catch(console.error);
          }
        }

        return next;
      });
    },
    [session?.user?.id]
  );

  const isBookmarked = useCallback(
    (apiName: string) => bookmarks.includes(apiName),
    [bookmarks]
  );

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
  };
}
