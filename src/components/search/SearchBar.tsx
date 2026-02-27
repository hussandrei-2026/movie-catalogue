import { useState, useEffect, useRef } from 'react';
import { Search, Barcode, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies & TV shows..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-9 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <button
        onClick={() => alert('Camera barcode scanning coming soon!')}
        className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl transition-colors cursor-pointer"
        title="Scan barcode"
      >
        <Barcode size={20} />
      </button>
      {loading && (
        <div className="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin shrink-0" />
      )}
    </div>
  );
}
