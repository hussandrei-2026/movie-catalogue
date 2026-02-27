import { Film } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center gap-2 px-4 py-3 bg-black border-b border-gray-800 shrink-0">
      <Film size={22} className="text-blue-500" />
      <span className="text-lg font-bold tracking-tight text-white">CineVault</span>
    </header>
  );
}
