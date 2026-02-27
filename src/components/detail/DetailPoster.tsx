import { buildImageUrl } from '../../api/tmdb';
import ImageWithFallback from '../shared/ImageWithFallback';
import type { TMDBConfig } from '../../types';

interface DetailPosterProps {
  posterPath: string | null;
  config: TMDBConfig | null;
  title: string;
}

export default function DetailPoster({ posterPath, config, title }: DetailPosterProps) {
  const baseUrl = config?.images.secure_base_url ?? 'https://image.tmdb.org/t/p';
  const posterUrl = buildImageUrl(posterPath, 'w500', baseUrl);

  return (
    <div className="w-24 shrink-0 rounded-lg overflow-hidden shadow-xl border border-gray-700">
      <ImageWithFallback
        src={posterUrl}
        alt={title}
        className="w-full aspect-[2/3] object-cover"
      />
    </div>
  );
}
