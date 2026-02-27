import type { TMDBConfig, TMDBDetail, TMDBImages, TMDBSearchResult } from '../types';

const BASE = 'https://api.themoviedb.org/3';
const KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const IMG_BASE = 'https://image.tmdb.org/t/p';
const TIMEOUT_MS = 10000;

if (!KEY) {
  throw new Error('VITE_TMDB_API_KEY is not set — add it to your .env file');
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Request timed out — check your connection and try again');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function searchMulti(query: string): Promise<TMDBSearchResult[]> {
  const data = await get<{ results: TMDBSearchResult[] }>('/search/multi', { query });
  return data.results.filter(r => r.media_type === 'movie' || r.media_type === 'tv');
}

export async function getMovieDetail(id: number): Promise<TMDBDetail> {
  return get<TMDBDetail>(`/movie/${id}`);
}

export async function getTVDetail(id: number): Promise<TMDBDetail> {
  return get<TMDBDetail>(`/tv/${id}`);
}

export async function getMovieImages(id: number): Promise<TMDBImages> {
  return get<TMDBImages>(`/movie/${id}/images`, {
    include_image_language: 'en,null',
  });
}

export async function getTVImages(id: number): Promise<TMDBImages> {
  return get<TMDBImages>(`/tv/${id}/images`, {
    include_image_language: 'en,null',
  });
}

export async function getConfig(): Promise<TMDBConfig> {
  return get<TMDBConfig>('/configuration');
}

export function buildImageUrl(
  path: string | null,
  size: string = 'w500',
  baseUrl: string = IMG_BASE
): string | null {
  if (!path) return null;
  return `${baseUrl}/${size}${path}`;
}

export function pickBestLogo(images: TMDBImages): string | null {
  const sorted = [...images.logos]
    .filter(l => l.iso_639_1 === 'en' || l.iso_639_1 === null)
    .sort((a, b) => b.vote_average - a.vote_average);
  return sorted[0]?.file_path ?? null;
}
