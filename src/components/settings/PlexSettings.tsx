import { useState, useEffect } from 'react';
import { Server, CheckCircle, RefreshCw, Trash2, Wifi, XCircle } from 'lucide-react';
import ErrorMessage from '../shared/ErrorMessage';
import type { PlexConfig } from '../../types';
import type { PlexSyncStatus } from '../../hooks/usePlex';

function formatSyncAge(iso: string | null): string {
  if (!iso) return 'Never synced';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface PlexSettingsProps {
  config: PlexConfig | null;
  syncStatus: PlexSyncStatus;
  syncError: string | null;
  onSave: (config: PlexConfig) => void;
  onClear: () => void;
  onSync: () => Promise<void>;
  onTest: (serverUrl: string, token: string) => Promise<void>;
}

export default function PlexSettings({
  config,
  syncStatus,
  syncError,
  onSave,
  onClear,
  onSync,
  onTest,
}: PlexSettingsProps) {
  const [serverUrl, setServerUrl] = useState(config?.serverUrl ?? '');
  const [token, setToken] = useState(config?.token ?? '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Keep form in sync if parent config changes
  useEffect(() => {
    setServerUrl(config?.serverUrl ?? '');
    setToken(config?.token ?? '');
    setIsDirty(false);
    setTestResult(null);
  }, [config]);

  function handleUrlChange(val: string) {
    setServerUrl(val);
    setIsDirty(true);
    setTestResult(null);
  }

  function handleTokenChange(val: string) {
    setToken(val);
    setIsDirty(true);
    setTestResult(null);
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    setTestError(null);
    try {
      await onTest(serverUrl.trim(), token.trim());
      setTestResult('success');
    } catch (err) {
      setTestResult('error');
      setTestError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setTesting(false);
    }
  }

  function handleSave() {
    onSave({ serverUrl: serverUrl.trim(), token: token.trim(), lastSyncAt: config?.lastSyncAt ?? null });
    setIsDirty(false);
    onSync();
  }

  const isSaved = !!(config?.serverUrl && config?.token);
  const canTest = !!(serverUrl.trim() && token.trim()) && !testing;
  const canSave = isDirty && !!(serverUrl.trim() && token.trim());
  const isSyncing = syncStatus === 'syncing';

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Server size={18} style={{ color: '#E5A00D' }} />
          <span className="text-white font-semibold text-sm">Plex</span>
        </div>
        {isSaved ? (
          <span className="flex items-center gap-1 text-xs text-green-400 bg-green-900/40 border border-green-800/50 px-2 py-0.5 rounded-full">
            <CheckCircle size={11} />
            Connected
          </span>
        ) : (
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
            Not configured
          </span>
        )}
      </div>

      {/* Form */}
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            Server URL
          </label>
          <input
            type="url"
            value={serverUrl}
            onChange={e => handleUrlChange(e.target.value)}
            placeholder="http://192.168.1.100:32400"
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            Plex Token
          </label>
          <input
            type="password"
            value={token}
            onChange={e => handleTokenChange(e.target.value)}
            placeholder="X-Plex-Token"
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-gray-600 text-xs">
            Find your token at plex.tv/claim or in Plex Web app preferences.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleTest}
            disabled={!canTest}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            <Wifi size={13} />
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Save & Sync
          </button>
        </div>

        {/* Test result */}
        {testResult === 'success' && (
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <CheckCircle size={13} />
            Connection successful
          </div>
        )}
        {testResult === 'error' && testError && (
          <ErrorMessage message={testError} />
        )}
      </div>

      {/* Sync section */}
      {isSaved && (
        <div className="px-4 py-4 border-t border-gray-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">
              {formatSyncAge(config?.lastSyncAt ?? null)}
            </span>
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync with Plex'}
            </button>
          </div>
          {syncStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-400 text-xs">
              <CheckCircle size={13} />
              Sync complete
            </div>
          )}
          {syncError && <ErrorMessage message={syncError} />}
        </div>
      )}

      {/* Danger zone */}
      {isSaved && (
        <div className="px-4 py-3 border-t border-gray-800">
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-red-300 text-xs">Remove Plex config?</span>
              <button
                onClick={() => { onClear(); setConfirmClear(false); }}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg cursor-pointer"
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
            >
              <Trash2 size={12} />
              <XCircle size={12} className="hidden" />
              Clear Plex config
            </button>
          )}
        </div>
      )}
    </div>
  );
}
