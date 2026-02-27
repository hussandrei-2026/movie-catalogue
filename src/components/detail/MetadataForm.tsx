import { Eye, Heart, MapPin, FileText } from 'lucide-react';
import StarRating from './StarRating';
import type { CollectionItem } from '../../types';

interface MetadataFormProps {
  item: CollectionItem;
  onChange: (patch: Partial<CollectionItem>) => void;
}

export default function MetadataForm({ item, onChange }: MetadataFormProps) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Watched + Wishlist row */}
      <div className="flex gap-3">
        <button
          onClick={() => onChange({ watched: !item.watched })}
          className={`flex items-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            item.watched
              ? 'bg-green-900/60 text-green-300 border border-green-700'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
          }`}
        >
          <Eye size={16} className="ml-3" />
          {item.watched ? 'Watched' : 'Mark Watched'}
        </button>
        <button
          onClick={() => onChange({ wishlist: !item.wishlist })}
          className={`flex items-center gap-2 flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            item.wishlist
              ? 'bg-pink-900/60 text-pink-300 border border-pink-700'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
          }`}
        >
          <Heart size={16} className="ml-3" fill={item.wishlist ? 'currentColor' : 'none'} />
          {item.wishlist ? 'Wishlisted' : 'Wishlist'}
        </button>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">Your Rating</label>
        <StarRating value={item.rating} onChange={rating => onChange({ rating })} />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
          <MapPin size={12} />
          Storage Location
        </label>
        <input
          type="text"
          value={item.location}
          onChange={e => onChange({ location: e.target.value })}
          placeholder="e.g. Living room shelf 2"
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide flex items-center gap-1">
          <FileText size={12} />
          Notes
        </label>
        <textarea
          value={item.notes}
          onChange={e => onChange({ notes: e.target.value })}
          placeholder="Add your thoughts..."
          rows={3}
          className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
