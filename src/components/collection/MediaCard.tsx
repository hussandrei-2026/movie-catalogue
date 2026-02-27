import { Eye, Heart, Star, Server } from 'lucide-react';
import { buildImageUrl } from '../../api/tmdb';
import ImageWithFallback from '../shared/ImageWithFallback';
import type { CollectionItem } from '../../types';

interface MediaCardProps {
  item: CollectionItem;
  onClick: (item: CollectionItem) => void;
}

export default function MediaCard({ item, onClick }: MediaCardProps) {
  const posterUrl = buildImageUrl(item.posterPath, 'w342');
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : '';

  return (
    <button
      onClick={() => onClick(item)}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all hover:scale-[1.02] cursor-pointer text-left w-full"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <ImageWithFallback
          src={posterUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.watched && (
            <span className="flex items-center gap-1 bg-green-900/90 text-green-300 text-xs px-1.5 py-0.5 rounded-full">
              <Eye size={10} />
            </span>
          )}
          {item.wishlist && (
            <span className="flex items-center gap-1 bg-pink-900/90 text-pink-300 text-xs px-1.5 py-0.5 rounded-full">
              <Heart size={10} />
            </span>
          )}
          {item.plexAvailable && (
            <span
              className="flex items-center rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: 'rgba(229,160,13,0.25)', color: '#E5A00D' }}
              title="Available in Plex"
            >
              <Server size={10} />
            </span>
          )}
        </div>
        {/* Rating */}
        {item.rating !== null && (
          <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/70 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full">
            <Star size={10} fill="currentColor" />
            <span>{item.rating}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-2">
        <p className="text-white text-xs font-medium leading-tight line-clamp-2">{item.title}</p>
        {year && <p className="text-gray-500 text-xs mt-0.5">{year}</p>}
      </div>
    </button>
  );
}
