import { useState, useEffect, useRef, RefObject } from 'react';
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
  showToast: (
    _type: 'success' | 'error' | 'warning' | 'info',
    _message: string,
    _duration?: number
  ) => void;
}

type UsePlayerHook = () => UsePlayerReturn;
type GetPlayersFunc = () => Promise<void>;

export const usePlayer: UsePlayerHook = (): UsePlayerReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    toasts,
    showToast: showToastFromContext,
    removeToast,
    clearAllToasts
  } = useToast();
  const loadingToastRef: RefObject<string | null> = useRef<string | null>(null);

  const showToast: string = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ): string => {
    const id = `player-toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    showToastFromContext(type, message, duration, id);
    return id;
  };

  const getPlayers: GetPlayersFunc = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    clearAllToasts();
    loadingToastRef.current = showToast('info', 'Loading players...', 0);

    try {
      const data: Player[] = await retrieveAllPlayers();
      setPlayers(data);

      if (loadingToastRef.current) {
        removeToast(loadingToastRef.current);
        loadingToastRef.current = null;
      }
      showToast('success', `Successfully loaded ${data.length} players!`, 2000);
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      if (loadingToastRef.current) {
        removeToast(loadingToastRef.current);
        loadingToastRef.current = null;
      }
      showToast('error', `Failed to load players: ${errorMessage}`, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect((): void => {
    getPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    getPlayers,
    toasts,
    removeToast,
    showToast
  };
};
