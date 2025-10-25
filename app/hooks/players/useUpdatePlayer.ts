import { useState } from 'react';
import type { UpdatePlayerRequest, Player } from '../../interfaces/server';
import { updateSinglePlayer } from '../../services/players/player.service';

interface UseUpdatePlayerProps {
  onSuccess?: (_player: Player) => void;
  onError?: (_error: string) => void;
}

interface UseUpdatePlayerReturn {
  loading: boolean;
  error: string | null;
  updatePlayer: (
    _playerId: string,
    _playerData: UpdatePlayerRequest
  ) => Promise<Player | null>;
  resetState: () => void;
}

type UseUpdatePlayerHook = (
  _props?: UseUpdatePlayerProps
) => UseUpdatePlayerReturn;
type UpdatePlayerFunction = (
  _playerId: string,
  _playerData: UpdatePlayerRequest
) => Promise<Player | null>;
type ResetStateFunction = () => void;

export const useUpdatePlayer: UseUpdatePlayerHook = (
  props?: UseUpdatePlayerProps
): UseUpdatePlayerReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updatePlayer: UpdatePlayerFunction = async (
    playerId: string,
    playerData: UpdatePlayerRequest
  ): Promise<Player | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPlayer: Player = await updateSinglePlayer(
        playerId,
        playerData
      );
      props?.onSuccess?.(updatedPlayer);
      return updatedPlayer;
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to update player';
      setError(errorMessage);
      props?.onError?.(errorMessage);
      return null;
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
    updatePlayer,
    resetState
  };
};
