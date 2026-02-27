import { useEffect, useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useCollectionContext } from '../../context/CollectionContext';
import { loadTMDBConfig } from '../../storage';
import DetailHero from './DetailHero';
import DetailPoster from './DetailPoster';
import DetailInfo from './DetailInfo';
import MetadataForm from './MetadataForm';
import PlexStatus from './PlexStatus';
import type { CollectionItem } from '../../types';

interface DetailModalProps {
  item: CollectionItem;
  onClose: () => void;
}

// Load config once per app session, not per modal open
const config = loadTMDBConfig();

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const { updateItem, removeItem, getItem } = useCollectionContext();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Always use fresh item from context
  const liveItem = getItem(item.tmdbId, item.mediaType) ?? item;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDelete) setConfirmDelete(false);
        else onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, confirmDelete]);

  function handleChange(patch: Partial<CollectionItem>) {
    updateItem(liveItem.tmdbId, liveItem.mediaType, patch);
  }

  function handleDelete() {
    removeItem(liveItem.tmdbId, liveItem.mediaType);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-lg bg-gray-950 rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[92vh] flex flex-col border border-gray-800">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-400 shrink-0" />
              <span className="text-red-300 text-sm">Remove from collection?</span>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-400 text-sm transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          <DetailHero
            backdropPath={liveItem.backdropPath}
            logoPath={liveItem.logoPath}
            config={config}
          />

          <div className="flex gap-4 px-4 -mt-8 relative z-10">
            <DetailPoster posterPath={liveItem.posterPath} config={config} title={liveItem.title} />
            <div className="flex-1 pt-10">
              <DetailInfo item={liveItem} />
            </div>
          </div>

          <div className="px-4 pb-8 mt-4">
            <MetadataForm item={liveItem} onChange={handleChange} />
            <div className="mt-4">
              <PlexStatus item={liveItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
