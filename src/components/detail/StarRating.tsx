import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number | null;
  onChange: (rating: number | null) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(value === star ? null : star)}
          className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer"
        >
          <Star
            size={22}
            fill={value !== null && star <= value ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
