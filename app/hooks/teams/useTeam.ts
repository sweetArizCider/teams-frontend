import { useState, useEffect, useRef, type RefObject } from 'react';
import type { Team } from '../../interfaces/server';
import { retrieveAllTeams } from '../../services/teams/team.service';
import { useToast } from '../useToast';

interface UseTeamReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  getTeams: () => Promise<void>;
  toasts: any[];
  removeToast: (_id: string) => void;
  showToast: (
    _type: 'success' | 'error' | 'warning' | 'info',
    _message: string,
    _duration?: number
  ) => void;
}

type UseTeamHook = () => UseTeamReturn;
type GetTeamsFunction = () => Promise<void>;
type ShowToastFunction = (
  _type: 'success' | 'error' | 'warning' | 'info',
  _message: string,
  _duration?: number
) => string;

export const useTeam: UseTeamHook = (): UseTeamReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    toasts,
    showToast: showToastFromContext,
    removeToast,
    clearAllToasts
  } = useToast();
  const loadingToastRef: RefObject<string | null> = useRef<string | null>(null);

  const showToast: ShowToastFunction = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ): string => {
    const id: string = `team-toast-${Date.now()}-${Math.random().toString()}`;
    showToastFromContext(type, message, duration, id);
    return id;
  };

  const getTeams: GetTeamsFunction = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    clearAllToasts();

    loadingToastRef.current = showToast('info', 'Loading teams...', 0);

    try {
      const data: Team[] = await retrieveAllTeams();
      setTeams(data);

      if (loadingToastRef.current) {
        removeToast(loadingToastRef.current);
        loadingToastRef.current = null;
      }
      showToast('success', `Successfully loaded ${data.length} teams!`, 2000);
    } catch (err) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      if (loadingToastRef.current) {
        removeToast(loadingToastRef.current);
        loadingToastRef.current = null;
      }
      showToast('error', `Failed to load teams: ${errorMessage}`, 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect((): void => {
    getTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    getTeams,
    toasts,
    removeToast,
    showToast
  };
};
