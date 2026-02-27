import SearchResultCard from './SearchResultCard';
import type { TMDBSearchResult, TMDBConfig } from '../../types';

interface SearchResultsProps {
  results: TMDBSearchResult[];
  config: TMDBConfig | null;
  addingId: number | null;
  onAdd: (result: TMDBSearchResult) => void;
  onViewDetail: (result: TMDBSearchResult) => void;
  isInCollection: (id: number, mediaType: 'movie' | 'tv') => boolean;
}

export default function SearchResults({
  results,
  config,
  addingId,
  onAdd,
  onViewDetail,
  isInCollection,
}: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 px-4 pb-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {results.map(result => {
        const mediaType = result.media_type as 'movie' | 'tv';
        return (
          <SearchResultCard
            key={`${mediaType}-${result.id}`}
            result={result}
            config={config}
            alreadyAdded={isInCollection(result.id, mediaType)}
            adding={addingId === result.id}
            onAdd={() => onAdd(result)}
            onViewDetail={() => onViewDetail(result)}
          />
        );
      })}
    </div>
  );
}
