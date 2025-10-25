import { useState, useEffect } from 'react';
import type { Player } from '../../interfaces/server';
import { retrieveAllPlayers } from '../../services/players/player.service';
import { useToast } from '../useToast';

interface UsePlayerReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  getPlayers: () => Promise<void>;
  toasts: any[];
  removeToast: (_id: string) => void;
}

export const usePlayer = (): UsePlayerReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toasts, showToast, removeToast, clearAllToasts } = useToast();

  const getPlayers = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    // Clear any existing toasts first
    clearAllToasts();

    // Show loading toast
    const loadingToastId = `loading-${Date.now()}`;
    showToast('info', 'Loading players...', 0, loadingToastId);

    try {
      const data = await retrieveAllPlayers();
      setPlayers(data);

      // Remove loading toast and show success
      removeToast(loadingToastId);
      showToast('success', `Successfully loaded ${data.length} players!`, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      // Remove loading toast and show error
      removeToast(loadingToastId);
      showToast('error', `Failed to load players: ${errorMessage}`, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    getPlayers,
    toasts,
    removeToast
  };
};
