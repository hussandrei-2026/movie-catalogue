import { useState, useCallback } from 'react';
import * as plexApi from '../api/plex';
import * as storage from '../storage';
import type { CollectionItem, PlexConfig } from '../types';

export type PlexSyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function usePlex(
  batchUpdateItems: (items: CollectionItem[]) => void,
  items: CollectionItem[]
) {
  const [config, setConfig] = useState<PlexConfig | null>(() => storage.loadPlexConfig());
  const [syncStatus, setSyncStatus] = useState<PlexSyncStatus>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  const saveConfig = useCallback((newConfig: PlexConfig) => {
    const cleaned: PlexConfig = {
      ...newConfig,
      serverUrl: newConfig.serverUrl.replace(/\/+$/, ''),
    };
    storage.savePlexConfig(cleaned);
    setConfig(cleaned);
  }, []);

  const clearConfig = useCallback(() => {
    storage.savePlexConfig({ serverUrl: '', token: '', lastSyncAt: null });
    setConfig(null);
    const cleared = items.map(i => ({
      ...i,
      plexAvailable: undefined,
      plexLibraryName: null,
      plexRatingKey: undefined,
    }));
    batchUpdateItems(cleared);
  }, [items, batchUpdateItems]);

  const testConnection = useCallback(async (serverUrl: string, token: string) => {
    await plexApi.testConnection(serverUrl, token); // throws on failure
  }, []);

  const sync = useCallback(async () => {
    if (!config?.serverUrl || !config?.token) return;
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      const [tmdbMap, machineIdentifier] = await Promise.all([
        plexApi.buildPlexTmdbSet(config.serverUrl, config.token),
        config.machineIdentifier
          ? Promise.resolve(config.machineIdentifier)
          : plexApi.fetchMachineIdentifier(config.serverUrl, config.token),
      ]);
      const updated = items.map(item => {
        const match = tmdbMap.get(item.tmdbId);
        return {
          ...item,
          plexAvailable: match !== undefined,
          plexLibraryName: match?.libraryName ?? null,
          plexRatingKey: match?.ratingKey,
        };
      });
      batchUpdateItems(updated);
      const updatedConfig: PlexConfig = {
        ...config,
        lastSyncAt: new Date().toISOString(),
        machineIdentifier,
      };
      storage.savePlexConfig(updatedConfig);
      setConfig(updatedConfig);
      setSyncStatus('success');
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed');
      setSyncStatus('error');
    }
  }, [config, items, batchUpdateItems]);

  return { config, syncStatus, syncError, saveConfig, clearConfig, sync, testConnection };
}
