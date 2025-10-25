import { useState } from 'react';
import { deleteSingleTeam } from '../../services/teams/team.service';

interface UseDeleteTeamProps {
  onSuccess?: () => void;
  onError?: (_error: string) => void;
}

interface UseDeleteTeamReturn {
  loading: boolean;
  error: string | null;
  deleteTeam: (_teamId: string) => Promise<boolean>;
  resetState: () => void;
}

type UseDeleteTeamHook = (_props?: UseDeleteTeamProps) => UseDeleteTeamReturn;
type DeleteTeamFunction = (_teamId: string) => Promise<boolean>;
type ResetStateFunction = () => void;

export const useDeleteTeam: UseDeleteTeamHook = (
  props?: UseDeleteTeamProps
): UseDeleteTeamReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTeam: DeleteTeamFunction = async (
    teamId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteSingleTeam(teamId);
      props?.onSuccess?.();
      return true;
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to delete team';
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
    deleteTeam,
    resetState
  };
};
