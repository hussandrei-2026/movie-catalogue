import { useMemo } from 'react';
import type { CollectionFilter, CollectionItem } from '../../types';

const FILTERS: { key: CollectionFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'watched', label: 'Watched' },
  { key: 'unwatched', label: 'Unwatched' },
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'inPlex', label: 'In Plex' },
];

interface FilterTabsProps {
  active: CollectionFilter;
  items: CollectionItem[];
  onChange: (f: CollectionFilter) => void;
}

export default function FilterTabs({ active, items, onChange }: FilterTabsProps) {
  const counts = useMemo(() => ({
    all: items.length,
    movies: items.filter(i => i.mediaType === 'movie').length,
    tv: items.filter(i => i.mediaType === 'tv').length,
    watched: items.filter(i => i.watched).length,
    unwatched: items.filter(i => !i.watched).length,
    wishlist: items.filter(i => i.wishlist).length,
    inPlex: items.filter(i => i.plexAvailable === true).length,
  }), [items]);

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {label}
            <span
              className={`text-xs rounded-full px-1.5 py-0.5 ${
                isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
