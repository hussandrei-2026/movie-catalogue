import { useState } from 'react';
import { CollectionProvider } from './context/CollectionContext';
import AppShell from './components/layout/AppShell';
import CollectionView from './components/collection/CollectionView';
import SearchView from './components/search/SearchView';
import DetailModal from './components/detail/DetailModal';
import type { AppView, CollectionItem } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('collection');
  const [detailItem, setDetailItem] = useState<CollectionItem | null>(null);

  return (
    <CollectionProvider>
      <AppShell view={view} onViewChange={setView}>
        {view === 'collection' && (
          <CollectionView
            onItemClick={setDetailItem}
            onGoToSearch={() => setView('search')}
          />
        )}
        {view === 'search' && <SearchView />}
      </AppShell>

      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </CollectionProvider>
  );
}
