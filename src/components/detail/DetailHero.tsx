import { buildImageUrl } from '../../api/tmdb';
import type { TMDBConfig } from '../../types';

interface DetailHeroProps {
  backdropPath: string | null;
  logoPath: string | null;
  config: TMDBConfig | null;
}

export default function DetailHero({ backdropPath, logoPath, config }: DetailHeroProps) {
  const baseUrl = config?.images.secure_base_url ?? 'https://image.tmdb.org/t/p';
  const backdropUrl = buildImageUrl(backdropPath, 'w1280', baseUrl);
  const logoUrl = buildImageUrl(logoPath, 'w300', baseUrl);

  return (
    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt="backdrop"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      {/* Logo */}
      {logoUrl && (
        <div className="absolute bottom-4 left-4">
          <img src={logoUrl} alt="logo" className="max-h-12 max-w-48 object-contain drop-shadow-lg" />
        </div>
      )}
    </div>
  );
}
