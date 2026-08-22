'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getClientApiBySlug, ClientApiItem } from '@/lib/client-api-lookup';

interface StackContextType {
  selectedSlugs: string[];
  selectedApis: ClientApiItem[];
  addToStack: (slug: string) => void;
  removeFromStack: (slug: string) => void;
  toggleStack: (slug: string) => void;
  isInStack: (slug: string) => boolean;
  clearStack: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
  openExport: () => void;
}

const StackContext = createContext<StackContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'freeapi_custom_stack';

export function StackProvider({ children }: { children: React.ReactNode }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Initial Load from LocalStorage or URL params
  useEffect(() => {
    try {
      // Check URL query first (e.g. ?apis=coingecko,open-meteo)
      const params = new URLSearchParams(window.location.search);
      const urlApis = params.get('apis');
      if (urlApis) {
        const slugsFromUrl = urlApis.split(',').map((s) => s.trim()).filter(Boolean);
        if (slugsFromUrl.length > 0) {
          setSelectedSlugs(slugsFromUrl);
          setIsMounted(true);
          return;
        }
      }

      // Check LocalStorage
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedSlugs(parsed);
        }
      }
    } catch {
      // ignore
    }
    setIsMounted(true);
  }, []);

  // 2. Persist to LocalStorage on changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedSlugs));
    } catch {
      // ignore
    }
  }, [selectedSlugs, isMounted]);

  const addToStack = (slug: string) => {
    if (!slug) return;
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  };

  const removeFromStack = (slug: string) => {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const toggleStack = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isInStack = (slug: string) => selectedSlugs.includes(slug);

  const clearStack = () => {
    setSelectedSlugs([]);
  };

  const openExport = () => {
    setIsDrawerOpen(false);
    setIsExportOpen(true);
  };

  // Resolve full API items from slugs
  const selectedApis = useMemo(() => {
    return selectedSlugs
      .map((slug) => getClientApiBySlug(slug))
      .filter((api): api is ClientApiItem => api !== undefined);
  }, [selectedSlugs]);

  return (
    <StackContext.Provider
      value={{
        selectedSlugs,
        selectedApis,
        addToStack,
        removeFromStack,
        toggleStack,
        isInStack,
        clearStack,
        isDrawerOpen,
        setIsDrawerOpen,
        isExportOpen,
        setIsExportOpen,
        openExport,
      }}
    >
      {children}
    </StackContext.Provider>
  );
}

export function useStack() {
  const context = useContext(StackContext);
  if (!context) {
    throw new Error('useStack must be used within a StackProvider');
  }
  return context;
}
