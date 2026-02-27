import { createContext, useContext, type ReactNode } from 'react';
import { useCollection } from '../hooks/useCollection';
import type { CollectionItem } from '../types';

interface CollectionContextValue {
  items: CollectionItem[];
  addItem: (item: CollectionItem) => void;
  updateItem: (
    tmdbId: number,
    mediaType: 'movie' | 'tv',
    patch: Partial<CollectionItem>
  ) => void;
  removeItem: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
  isInCollection: (tmdbId: number, mediaType: 'movie' | 'tv') => boolean;
  getItem: (tmdbId: number, mediaType: 'movie' | 'tv') => CollectionItem | null;
  batchUpdateItems: (items: CollectionItem[]) => void;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const value = useCollection();
  return (
    <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
  );
}

export function useCollectionContext(): CollectionContextValue {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollectionContext must be used within CollectionProvider');
  return ctx;
}
