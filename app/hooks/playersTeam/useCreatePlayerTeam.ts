import { useState } from 'react';
import type { PlayerTeam, CreatePlayerTeamRequest } from '../../interfaces/server';
import { playerTeamService } from '../../services/playersTeam/playerTeam.service';

interface UseCreatePlayerTeamReturn {
  createPlayerTeam: (_playerTeamData: CreatePlayerTeamRequest) => Promise<PlayerTeam | null>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useCreatePlayerTeam = (): UseCreatePlayerTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createPlayerTeam = async (playerTeamData: CreatePlayerTeamRequest): Promise<PlayerTeam | null> => {
    setLoading(true);
    setError(null);

    try {
      const newPlayerTeam = await playerTeamService.createPlayerTeam(playerTeamData);
      return newPlayerTeam;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create player team';
      setError(errorMessage);
      console.error('Error creating player team:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    createPlayerTeam,
    loading,
    error,
    clearError
  };
};
