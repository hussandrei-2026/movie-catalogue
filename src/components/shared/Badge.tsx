interface BadgeProps {
  label: string;
  variant?: 'genre' | 'movie' | 'tv' | 'watched' | 'wishlist';
}

const variantStyles: Record<string, string> = {
  genre: 'bg-gray-700 text-gray-300',
  movie: 'bg-blue-900 text-blue-300',
  tv: 'bg-purple-900 text-purple-300',
  watched: 'bg-green-900 text-green-300',
  wishlist: 'bg-pink-900 text-pink-300',
};

export default function Badge({ label, variant = 'genre' }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
