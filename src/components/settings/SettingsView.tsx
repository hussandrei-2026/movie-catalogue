import PlexSettings from './PlexSettings';
import type { PlexConfig } from '../../types';
import type { PlexSyncStatus } from '../../hooks/usePlex';

interface SettingsViewProps {
  config: PlexConfig | null;
  syncStatus: PlexSyncStatus;
  syncError: string | null;
  onSaveConfig: (config: PlexConfig) => void;
  onClearConfig: () => void;
  onSync: () => Promise<void>;
  onTestConnection: (serverUrl: string, token: string) => Promise<void>;
}

export default function SettingsView({
  config,
  syncStatus,
  syncError,
  onSaveConfig,
  onClearConfig,
  onSync,
  onTestConnection,
}: SettingsViewProps) {
  return (
    <div className="flex flex-col px-4 pt-6 pb-8 gap-6">
      <div>
        <h1 className="text-white text-xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure integrations for your collection.</p>
      </div>
      <PlexSettings
        config={config}
        syncStatus={syncStatus}
        syncError={syncError}
        onSave={onSaveConfig}
        onClear={onClearConfig}
        onSync={onSync}
        onTest={onTestConnection}
      />
    </div>
  );
}
