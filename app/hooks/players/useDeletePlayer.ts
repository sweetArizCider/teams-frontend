import { useState } from 'react';
import { deleteSinglePlayer } from '../../services/players/player.service';

interface UseDeletePlayerProps {
  onSuccess?: () => void;
  onError?: (_error: string) => void;
}

interface UseDeletePlayerReturn {
  loading: boolean;
  error: string | null;
  deletePlayer: (_playerId: string) => Promise<boolean>;
  resetState: () => void;
}

type UseDeletePlayerHook = (
  _props?: UseDeletePlayerProps
) => UseDeletePlayerReturn;
type DeletePlayerFunction = (_playerId: string) => Promise<boolean>;
type ResetStateFunction = () => void;

export const useDeletePlayer: UseDeletePlayerHook = (
  props?: UseDeletePlayerProps
): UseDeletePlayerReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deletePlayer: DeletePlayerFunction = async (
    playerId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteSinglePlayer(playerId);
      props?.onSuccess?.();
      return true;
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to delete player';
      setError(errorMessage);
      props?.onError?.(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetState: ResetStateFunction = (): void => {
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    deletePlayer,
    resetState
  };
};
