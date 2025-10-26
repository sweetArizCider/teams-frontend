import { useState, useEffect, useRef } from 'react';
import type { PlayerTeam } from '../../interfaces/server';
import { playerTeamService } from '../../services/playersTeam/playerTeam.service';

interface UsePlayerTeamReturn {
  playerTeams: PlayerTeam[];
  loading: boolean;
  error: string | null;
  getPlayerTeams: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const usePlayerTeam = (): UsePlayerTeamReturn => {
  const [playerTeams, setPlayerTeams] = useState<PlayerTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef<boolean>(false);

  const getPlayerTeams = async (): Promise<void> => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await playerTeamService.getAllPlayerTeams();
      setPlayerTeams(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch player teams';
      setError(errorMessage);
      console.error('Error fetching player teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await getPlayerTeams();
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      getPlayerTeams();
    }
  }, []);

  return {
    playerTeams,
    loading,
    error,
    getPlayerTeams,
    refetch
  };
};
