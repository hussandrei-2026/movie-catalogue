import { useState, useCallback, useEffect } from 'react';
import * as tmdb from '../api/tmdb';
import * as storage from '../storage';
import type { TMDBSearchResult, TMDBConfig } from '../types';

export function useTMDB() {
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<TMDBConfig | null>(() => storage.loadTMDBConfig());

  useEffect(() => {
    if (config) return;
    tmdb
      .getConfig()
      .then(cfg => {
        setConfig(cfg);
        storage.saveTMDBConfig(cfg);
      })
      .catch(console.error);
  }, [config]);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await tmdb.searchMulti(query.trim());
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => setResults([]), []);

  return { results, loading, error, config, search, clearResults };
}
