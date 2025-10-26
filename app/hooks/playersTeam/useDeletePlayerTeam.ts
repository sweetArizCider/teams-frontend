import { useState } from 'react';
import { playerTeamService } from '../../services/playersTeam/playerTeam.service';

interface UseDeletePlayerTeamReturn {
  deletePlayerTeam: (_id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useDeletePlayerTeam = (): UseDeletePlayerTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deletePlayerTeam = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await playerTeamService.deletePlayerTeam(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete player team';
      setError(errorMessage);
      console.error('Error deleting player team:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    deletePlayerTeam,
    loading,
    error,
    clearError
  };
};
