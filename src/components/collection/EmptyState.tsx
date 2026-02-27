import { Film, Search } from 'lucide-react';
import type { CollectionFilter } from '../../types';

interface EmptyStateProps {
  filter: CollectionFilter;
  onGoToSearch?: () => void;
}

const messages: Record<CollectionFilter, string> = {
  all: 'Your collection is empty',
  movies: 'No movies in your collection',
  tv: 'No TV shows in your collection',
  watched: "You haven't marked anything as watched yet",
  unwatched: 'Nothing left to watch — nice!',
  wishlist: 'Your wishlist is empty',
  inPlex: 'None of your collection items were found in Plex',
};

export default function EmptyState({ filter, onGoToSearch }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
        <Film size={28} className="text-gray-500" />
      </div>
      <p className="text-gray-400 text-sm">{messages[filter]}</p>
      {filter === 'all' && onGoToSearch && (
        <button
          onClick={onGoToSearch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Search size={16} />
          Search for movies
        </button>
      )}
    </div>
  );
}
