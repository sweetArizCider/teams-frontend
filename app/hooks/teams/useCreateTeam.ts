import { useState } from 'react';
import type { CreateTeamRequest, Team } from '../../interfaces/server';
import { createSingleTeam } from '../../services/teams/team.service';

interface UseCreateTeamProps {
  onSuccess?: (_team: Team) => void;
  onError?: (_error: string) => void;
}

interface UseCreateTeamReturn {
  loading: boolean;
  error: string | null;
  createTeam: (_teamData: CreateTeamRequest) => Promise<Team | null>;
  resetState: () => void;
}

type UseCreateTeamHook = (_props?: UseCreateTeamProps) => UseCreateTeamReturn;
type CreateTeamFunction = (
  _teamData: CreateTeamRequest
) => Promise<Team | null>;
type ResetStateFunction = () => void;

export const useCreateTeam: UseCreateTeamHook = (
  props?: UseCreateTeamProps
): UseCreateTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createTeam: CreateTeamFunction = async (
    teamData: CreateTeamRequest
  ): Promise<Team | null> => {
    setLoading(true);
    setError(null);

    try {
      const newTeam: Team = await createSingleTeam(teamData);
      props?.onSuccess?.(newTeam);
      return newTeam;
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to create team';
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
    createTeam,
    resetState
  };
};
