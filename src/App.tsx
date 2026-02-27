import { useState, useEffect } from 'react';
import { CollectionProvider, useCollectionContext } from './context/CollectionContext';
import { usePlex } from './hooks/usePlex';
import AppShell from './components/layout/AppShell';
import CollectionView from './components/collection/CollectionView';
import SearchView from './components/search/SearchView';
import SettingsView from './components/settings/SettingsView';
import DetailModal from './components/detail/DetailModal';
import type { AppView, CollectionItem } from './types';

// AppContent is an inner component so it can access CollectionContext
function AppContent() {
  const { items, batchUpdateItems } = useCollectionContext();
  const [view, setView] = useState<AppView>('collection');
  const [detailItem, setDetailItem] = useState<CollectionItem | null>(null);

  const { config, syncStatus, syncError, saveConfig, clearConfig, sync, testConnection } =
    usePlex(batchUpdateItems, items);

  // Auto-sync once on startup if Plex is configured
  useEffect(() => {
    if (config?.serverUrl && config?.token) {
      sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount only

  return (
    <>
      <AppShell view={view} onViewChange={setView}>
        {view === 'collection' && (
          <CollectionView
            onItemClick={setDetailItem}
            onGoToSearch={() => setView('search')}
          />
        )}
        {view === 'search' && <SearchView />}
        {view === 'settings' && (
          <SettingsView
            config={config}
            syncStatus={syncStatus}
            syncError={syncError}
            onSaveConfig={saveConfig}
            onClearConfig={clearConfig}
            onSync={sync}
            onTestConnection={testConnection}
          />
        )}
      </AppShell>

      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <CollectionProvider>
      <AppContent />
    </CollectionProvider>
  );
}
