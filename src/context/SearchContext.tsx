'use client';

import React, { createContext, useContext, useState } from 'react';

type FilterTab = 'categories' | 'all-apis' | 'bookmarks' | 'recommended' | 'no-auth';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeTab: FilterTab;
  setActiveTab: (tab: FilterTab) => void;
  triggerSearch: (q: string, categoryId?: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedCategory: 'all',
  setSelectedCategory: () => {},
  activeTab: 'categories',
  setActiveTab: () => {},
  triggerSearch: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<FilterTab>('categories');

  const triggerSearch = (q: string, categoryId?: string) => {
    setSearchQuery(q);
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    const el = document.getElementById('explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeTab,
        setActiveTab,
        triggerSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
