import { useState } from 'react';
import type {
  PlayerTeam,
  UpdatePlayerTeamRequest
} from '../../interfaces/server';
import { playerTeamService } from '../../services/playersTeam/playerTeam.service';

interface UseUpdatePlayerTeamReturn {
  updatePlayerTeam: (
    _id: string,
    _playerTeamData: UpdatePlayerTeamRequest
  ) => Promise<PlayerTeam | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useUpdatePlayerTeam = (): UseUpdatePlayerTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updatePlayerTeam = async (
    id: string,
    playerTeamData: UpdatePlayerTeamRequest
  ): Promise<PlayerTeam | null> => {
    setLoading(true);
    setError(null);

    try {
      return await playerTeamService.updatePlayerTeam(id, playerTeamData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update player team';
      setError(errorMessage);
      console.error('Error updating player team:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    updatePlayerTeam,
    loading,
    error,
    clearError
  };
};
