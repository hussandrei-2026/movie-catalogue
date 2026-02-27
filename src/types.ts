export interface CollectionItem {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  genres: string[];
  logoPath: string | null;
  // User metadata
  watched: boolean;
  wishlist: boolean;
  rating: number | null; // 1–5 or null
  notes: string;
  location: string; // e.g. "Living room shelf 2"
  addedAt: string; // ISO datetime
  // Plex integration
  plexAvailable?: boolean;
  plexLibraryName?: string | null;
}

export interface PlexConfig {
  serverUrl: string;       // e.g. "http://192.168.1.100:32400"
  token: string;           // X-Plex-Token
  lastSyncAt: string | null;
}

export interface TMDBSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

export interface TMDBDetail {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genres: Array<{ id: number; name: string }>;
  runtime?: number;
  number_of_seasons?: number;
}

export interface TMDBImages {
  logos: Array<{
    file_path: string;
    iso_639_1: string | null;
    vote_average: number;
  }>;
}

export interface TMDBConfig {
  images: {
    base_url: string;
    secure_base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
    logo_sizes: string[];
  };
}

export type CollectionFilter =
  | 'all'
  | 'movies'
  | 'tv'
  | 'watched'
  | 'unwatched'
  | 'wishlist'
  | 'inPlex';

export type AppView = 'collection' | 'search' | 'settings';
