import { useState, useCallback } from 'react';
import * as storage from '../storage';
import type { CollectionItem } from '../types';

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>(() => storage.loadCollection());

  const addItem = useCallback((item: CollectionItem) => {
    setItems(storage.addItem(item));
  }, []);

  const updateItem = useCallback(
    (tmdbId: number, mediaType: 'movie' | 'tv', patch: Partial<CollectionItem>) => {
      setItems(storage.updateItem(tmdbId, mediaType, patch));
    },
    []
  );

  const removeItem = useCallback((tmdbId: number, mediaType: 'movie' | 'tv') => {
    setItems(storage.removeItem(tmdbId, mediaType));
  }, []);

  const isInCollection = useCallback(
    (tmdbId: number, mediaType: 'movie' | 'tv') =>
      items.some(i => i.tmdbId === tmdbId && i.mediaType === mediaType),
    [items]
  );

  const getItem = useCallback(
    (tmdbId: number, mediaType: 'movie' | 'tv') =>
      items.find(i => i.tmdbId === tmdbId && i.mediaType === mediaType) ?? null,
    [items]
  );

  const batchUpdateItems = useCallback((newItems: CollectionItem[]) => {
    storage.saveCollection(newItems);
    setItems(newItems);
  }, []);

  return { items, addItem, updateItem, removeItem, isInCollection, getItem, batchUpdateItems };
}
