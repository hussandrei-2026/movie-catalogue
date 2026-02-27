import { Library, Search, Settings } from 'lucide-react';
import type { AppView } from '../../types';

interface BottomNavProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
}

export default function BottomNav({ view, onViewChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t border-gray-800 bg-black shrink-0 z-40">
      <button
        onClick={() => onViewChange('collection')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer ${
          view === 'collection' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Library size={22} />
        <span>Collection</span>
      </button>
      <button
        onClick={() => onViewChange('search')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer ${
          view === 'search' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Search size={22} />
        <span>Search</span>
      </button>
      <button
        onClick={() => onViewChange('settings')}
        className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors cursor-pointer ${
          view === 'settings' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Settings size={22} />
        <span>Settings</span>
      </button>
    </nav>
  );
}
