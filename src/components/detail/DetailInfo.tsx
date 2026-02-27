import Badge from '../shared/Badge';
import type { CollectionItem } from '../../types';

interface DetailInfoProps {
  item: CollectionItem;
}

export default function DetailInfo({ item }: DetailInfoProps) {
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : '';

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-white text-xl font-bold leading-tight">{item.title}</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {year && <span className="text-gray-400 text-sm">{year}</span>}
        <Badge
          label={item.mediaType === 'movie' ? 'Movie' : 'TV Show'}
          variant={item.mediaType}
        />
        {item.genres.slice(0, 3).map(genre => (
          <Badge key={genre} label={genre} variant="genre" />
        ))}
      </div>
      {item.overview && (
        <p className="text-gray-400 text-sm leading-relaxed">{item.overview}</p>
      )}
    </div>
  );
}
