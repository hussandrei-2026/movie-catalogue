import type { CollectionFilter, CollectionItem } from '../../types';

const FILTERS: { key: CollectionFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Shows' },
  { key: 'watched', label: 'Watched' },
  { key: 'unwatched', label: 'Unwatched' },
  { key: 'wishlist', label: 'Wishlist' },
];

function countFor(items: CollectionItem[], filter: CollectionFilter): number {
  switch (filter) {
    case 'all': return items.length;
    case 'movies': return items.filter(i => i.mediaType === 'movie').length;
    case 'tv': return items.filter(i => i.mediaType === 'tv').length;
    case 'watched': return items.filter(i => i.watched).length;
    case 'unwatched': return items.filter(i => !i.watched && !i.wishlist).length;
    case 'wishlist': return items.filter(i => i.wishlist).length;
  }
}

interface FilterTabsProps {
  active: CollectionFilter;
  items: CollectionItem[];
  onChange: (f: CollectionFilter) => void;
}

export default function FilterTabs({ active, items, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
      {FILTERS.map(({ key, label }) => {
        const count = countFor(items, key);
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
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
