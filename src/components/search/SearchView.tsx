import { useState } from 'react';
import { useTMDB } from '../../hooks/useTMDB';
import { useCollectionContext } from '../../context/CollectionContext';
import { getMovieDetail, getTVDetail, getMovieImages, getTVImages, pickBestLogo } from '../../api/tmdb';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import ErrorMessage from '../shared/ErrorMessage';
import type { TMDBSearchResult, CollectionItem } from '../../types';

export default function SearchView() {
  const { results, loading, error, config, search } = useTMDB();
  const { addItem, isInCollection } = useCollectionContext();
  const [addingId, setAddingId] = useState<number | null>(null);

  async function handleAdd(result: TMDBSearchResult) {
    const mediaType = result.media_type as 'movie' | 'tv';
    setAddingId(result.id);
    try {
      const [detail, images] = await Promise.all([
        mediaType === 'movie' ? getMovieDetail(result.id) : getTVDetail(result.id),
        mediaType === 'movie' ? getMovieImages(result.id) : getTVImages(result.id),
      ]);

      const item: CollectionItem = {
        tmdbId: detail.id,
        mediaType,
        title: detail.title ?? detail.name ?? '',
        overview: detail.overview,
        posterPath: detail.poster_path,
        backdropPath: detail.backdrop_path,
        releaseDate: detail.release_date ?? detail.first_air_date ?? '',
        genres: detail.genres.map(g => g.name),
        logoPath: pickBestLogo(images),
        watched: false,
        wishlist: false,
        rating: null,
        notes: '',
        location: '',
        addedAt: new Date().toISOString(),
      };
      addItem(item);
    } catch (err) {
      console.error('Failed to add item:', err);
    } finally {
      setAddingId(null);
    }
  }

  function handleViewDetail(result: TMDBSearchResult) {
    // Future: open detail for search results before adding
    void result;
    alert('Tip: Add the item first, then click it in your collection to view full details.');
  }

  return (
    <div className="flex flex-col">
      <SearchBar onSearch={search} loading={loading} />
      {error && (
        <div className="px-4 mb-3">
          <ErrorMessage message={error} />
        </div>
      )}
      <SearchResults
        results={results}
        config={config}
        addingId={addingId}
        onAdd={handleAdd}
        onViewDetail={handleViewDetail}
        isInCollection={isInCollection}
      />
      {!loading && results.length === 0 && !error && (
        <p className="text-center text-gray-600 text-sm py-12">
          Search for a movie or TV show above
        </p>
      )}
    </div>
  );
}
