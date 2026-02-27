import type { CollectionItem, TMDBConfig } from './types';

const COLLECTION_KEY = 'movie_catalogue_v1';
const TMDB_CONFIG_KEY = 'tmdb_config_v1';

export function loadCollection(): CollectionItem[] {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    return raw ? (JSON.parse(raw) as CollectionItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCollection(items: CollectionItem[]): void {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(items));
}

export function addItem(item: CollectionItem): CollectionItem[] {
  const current = loadCollection();
  if (current.some(i => i.tmdbId === item.tmdbId && i.mediaType === item.mediaType)) {
    return current;
  }
  const updated = [item, ...current];
  saveCollection(updated);
  return updated;
}

export function updateItem(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  patch: Partial<CollectionItem>
): CollectionItem[] {
  const updated = loadCollection().map(i =>
    i.tmdbId === tmdbId && i.mediaType === mediaType ? { ...i, ...patch } : i
  );
  saveCollection(updated);
  return updated;
}

export function removeItem(tmdbId: number, mediaType: 'movie' | 'tv'): CollectionItem[] {
  const updated = loadCollection().filter(
    i => !(i.tmdbId === tmdbId && i.mediaType === mediaType)
  );
  saveCollection(updated);
  return updated;
}

export function loadTMDBConfig(): TMDBConfig | null {
  try {
    const raw = localStorage.getItem(TMDB_CONFIG_KEY);
    return raw ? (JSON.parse(raw) as TMDBConfig) : null;
  } catch {
    return null;
  }
}

export function saveTMDBConfig(config: TMDBConfig): void {
  localStorage.setItem(TMDB_CONFIG_KEY, JSON.stringify(config));
}
