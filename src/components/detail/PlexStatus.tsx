import { Server, ExternalLink } from 'lucide-react';
import type { CollectionItem } from '../../types';

interface PlexStatusProps {
  item: CollectionItem;
  machineIdentifier?: string;
}

export default function PlexStatus({ item, machineIdentifier }: PlexStatusProps) {
  // Don't render at all if Plex has never been synced
  if (item.plexAvailable === undefined) return null;

  const plexDeepLink =
    item.plexAvailable && item.plexRatingKey && machineIdentifier
      ? `plex://server/${machineIdentifier}/com.plexapp.plugins.library/library/metadata/${item.plexRatingKey}`
      : null;

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
        <Server size={12} style={{ color: '#E5A00D' }} />
        Plex
      </label>
      {item.plexAvailable ? (
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm"
            style={{
              backgroundColor: 'rgba(229,160,13,0.08)',
              borderColor: 'rgba(229,160,13,0.3)',
              color: '#E5A00D',
            }}
          >
            <Server size={14} style={{ color: '#E5A00D' }} />
            <span>
              Available in Plex
              {item.plexLibraryName ? ` — ${item.plexLibraryName}` : ''}
            </span>
          </div>
          {plexDeepLink && (
            <a
              href={plexDeepLink}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: 'rgba(229,160,13,0.12)',
                borderColor: 'rgba(229,160,13,0.4)',
                color: '#E5A00D',
              }}
            >
              <ExternalLink size={14} />
              Open in Plex
            </a>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-500 text-sm">
          <Server size={14} />
          <span>Not in Plex library</span>
        </div>
      )}
    </div>
  );
}
