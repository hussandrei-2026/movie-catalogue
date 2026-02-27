const TIMEOUT_MS = 15000;

// Internal Plex API shapes
interface PlexGuid {
  id: string; // e.g. "tmdb://27205"
}

interface PlexMetadataItem {
  ratingKey: string;
  title: string;
  year?: number;
  Guid?: PlexGuid[];
}

interface PlexSection {
  key: string;
  title: string;
  type: string;
}

interface PlexSectionsResponse {
  MediaContainer: {
    Directory: PlexSection[];
  };
}

interface PlexLibraryResponse {
  MediaContainer: {
    Metadata?: PlexMetadataItem[];
  };
}

async function get<T>(serverUrl: string, token: string, path: string): Promise<T> {
  const base = serverUrl.replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, {
      signal: controller.signal,
      headers: {
        'X-Plex-Token': token,
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error(`Plex ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error('Plex request timed out — is the server reachable?');
    }
    if (err instanceof TypeError) {
      throw new Error(
        'Cannot reach Plex server. Check the URL is correct and the server is running. ' +
          'Note: Plex Cloud relay URLs may not work due to browser CORS restrictions — use your local server URL instead.'
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Exported types

export interface PlexLibrarySection {
  key: string;
  title: string;
  type: 'movie' | 'show';
}

// Exported functions

export async function testConnection(serverUrl: string, token: string): Promise<void> {
  await get<PlexSectionsResponse>(serverUrl, token, '/library/sections');
}

export async function fetchLibrarySections(
  serverUrl: string,
  token: string
): Promise<PlexLibrarySection[]> {
  const data = await get<PlexSectionsResponse>(serverUrl, token, '/library/sections');
  return data.MediaContainer.Directory.filter(
    d => d.type === 'movie' || d.type === 'show'
  ).map(d => ({ key: d.key, title: d.title, type: d.type as 'movie' | 'show' }));
}

export async function fetchSectionItems(
  serverUrl: string,
  token: string,
  sectionKey: string
): Promise<PlexMetadataItem[]> {
  const data = await get<PlexLibraryResponse>(
    serverUrl,
    token,
    `/library/sections/${sectionKey}/all`
  );
  return data.MediaContainer.Metadata ?? [];
}

// Returns Map<tmdbId, libraryName> for all Plex items with a TMDB guid
export async function buildPlexTmdbSet(
  serverUrl: string,
  token: string
): Promise<Map<number, string>> {
  const sections = await fetchLibrarySections(serverUrl, token);

  const sectionResults = await Promise.all(
    sections.map(async section => {
      const items = await fetchSectionItems(serverUrl, token, section.key);
      return { section, items };
    })
  );

  const tmdbMap = new Map<number, string>();
  for (const { section, items } of sectionResults) {
    for (const item of items) {
      if (!item.Guid) continue;
      for (const guid of item.Guid) {
        if (guid.id.startsWith('tmdb://')) {
          const tmdbId = parseInt(guid.id.replace('tmdb://', ''), 10);
          if (!isNaN(tmdbId)) {
            tmdbMap.set(tmdbId, section.title);
          }
        }
      }
    }
  }
  return tmdbMap;
}
