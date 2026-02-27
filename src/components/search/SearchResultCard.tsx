import { Plus, Check } from 'lucide-react';
import { buildImageUrl } from '../../api/tmdb';
import ImageWithFallback from '../shared/ImageWithFallback';
import Badge from '../shared/Badge';
import type { TMDBSearchResult, TMDBConfig } from '../../types';

interface SearchResultCardProps {
  result: TMDBSearchResult;
  config: TMDBConfig | null;
  alreadyAdded: boolean;
  adding: boolean;
  onAdd: () => void;
  onViewDetail: () => void;
}

export default function SearchResultCard({
  result,
  config,
  alreadyAdded,
  adding,
  onAdd,
  onViewDetail,
}: SearchResultCardProps) {
  const baseUrl = config?.images.secure_base_url ?? 'https://image.tmdb.org/t/p';
  const posterUrl = buildImageUrl(result.poster_path, 'w342', baseUrl);
  const title = result.title ?? result.name ?? 'Unknown';
  const rawDate = result.release_date ?? result.first_air_date ?? '';
  const year = rawDate ? rawDate.slice(0, 4) : '';
  const mediaType = result.media_type as 'movie' | 'tv';

  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
      {/* Poster — clickable for detail */}
      <button
        onClick={onViewDetail}
        className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer"
      >
        <ImageWithFallback
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </button>

      {/* Info */}
      <div className="p-2 flex flex-col gap-1.5">
        <p className="text-white text-xs font-medium leading-tight line-clamp-2">{title}</p>
        <div className="flex items-center gap-1 flex-wrap">
          {year && <span className="text-gray-500 text-xs">{year}</span>}
          <Badge label={mediaType === 'movie' ? 'Movie' : 'TV'} variant={mediaType} />
        </div>
        <button
          onClick={onAdd}
          disabled={alreadyAdded || adding}
          className={`flex items-center justify-center gap-1 w-full py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            alreadyAdded
              ? 'bg-green-900/50 text-green-400 cursor-default'
              : adding
              ? 'bg-gray-700 text-gray-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {alreadyAdded ? (
            <>
              <Check size={12} />
              Added
            </>
          ) : (
            <>
              <Plus size={12} />
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
