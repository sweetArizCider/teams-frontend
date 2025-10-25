import { useState } from 'react';
import type { CreatePlayerRequest, Player } from '../../interfaces/server';
import { createSinglePlayer } from '../../services/players/player.service';

interface UseCreatePlayerProps {
  onSuccess?: (_player: Player) => void;
  onError?: (_error: string) => void;
}

interface UseCreatePlayerReturn {
  loading: boolean;
  error: string | null;
  createPlayer: (_playerData: CreatePlayerRequest) => Promise<Player | null>;
  resetState: () => void;
}

export const useCreatePlayer = (
  _props?: UseCreatePlayerProps
): UseCreatePlayerReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlayer = async (
    playerData: CreatePlayerRequest
  ): Promise<Player | null> => {
    setLoading(true);
    setError(null);

    try {
      const newPlayer = await createSinglePlayer(playerData);
      _props?.onSuccess?.(newPlayer);
      return newPlayer;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create player';
      setError(errorMessage);
      _props?.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetState = (): void => {
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    createPlayer,
    resetState
  };
};
