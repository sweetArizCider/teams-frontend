import { useState } from 'react';
import type { UpdateTeamRequest, Team } from '../../interfaces/server';
import { updateSingleTeam } from '../../services/teams/team.service';

interface UseUpdateTeamProps {
  onSuccess?: (_team: Team) => void;
  onError?: (_error: string) => void;
}

interface UseUpdateTeamReturn {
  loading: boolean;
  error: string | null;
  updateTeam: (
    _teamId: string,
    _teamData: UpdateTeamRequest
  ) => Promise<Team | null>;
  resetState: () => void;
}

type UseUpdateTeamHook = (_props?: UseUpdateTeamProps) => UseUpdateTeamReturn;
type UpdateTeamFunction = (
  _teamId: string,
  _teamData: UpdateTeamRequest
) => Promise<Team | null>;
type ResetStateFunction = () => void;

export const useUpdateTeam: UseUpdateTeamHook = (
  props?: UseUpdateTeamProps
): UseUpdateTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateTeam: UpdateTeamFunction = async (
    teamId: string,
    teamData: UpdateTeamRequest
  ): Promise<Team | null> => {
    setLoading(true);
    setError(null);

    try {
      const updatedTeam: Team = await updateSingleTeam(teamId, teamData);
      props?.onSuccess?.(updatedTeam);
      return updatedTeam;
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to update team';
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
    updateTeam,
    resetState
  };
};
