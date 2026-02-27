import type { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import type { AppView } from '../../types';

interface AppShellProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
  children: ReactNode;
}

export default function AppShell({ view, onViewChange, children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav view={view} onViewChange={onViewChange} />
    </div>
  );
}
