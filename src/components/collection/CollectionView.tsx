import { useState, useMemo } from 'react';
import { useCollectionContext } from '../../context/CollectionContext';
import FilterTabs from './FilterTabs';
import MediaCard from './MediaCard';
import EmptyState from './EmptyState';
import type { CollectionFilter, CollectionItem } from '../../types';

interface CollectionViewProps {
  onItemClick: (item: CollectionItem) => void;
  onGoToSearch: () => void;
}

function applyFilter(items: CollectionItem[], filter: CollectionFilter): CollectionItem[] {
  switch (filter) {
    case 'all': return items;
    case 'movies': return items.filter(i => i.mediaType === 'movie');
    case 'tv': return items.filter(i => i.mediaType === 'tv');
    case 'watched': return items.filter(i => i.watched);
    case 'unwatched': return items.filter(i => !i.watched);
    case 'wishlist': return items.filter(i => i.wishlist);
    case 'inPlex': return items.filter(i => i.plexAvailable === true);
  }
}

export default function CollectionView({ onItemClick, onGoToSearch }: CollectionViewProps) {
  const { items } = useCollectionContext();
  const [filter, setFilter] = useState<CollectionFilter>('all');
  const filtered = useMemo(() => applyFilter(items, filter), [items, filter]);

  return (
    <div className="flex flex-col">
      <FilterTabs active={filter} items={items} onChange={setFilter} />
      {filtered.length === 0 ? (
        <EmptyState filter={filter} onGoToSearch={filter === 'all' ? onGoToSearch : undefined} />
      ) : (
        <div className="grid grid-cols-3 gap-3 px-4 pb-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filtered.map(item => (
            <MediaCard key={`${item.mediaType}-${item.tmdbId}`} item={item} onClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
}
