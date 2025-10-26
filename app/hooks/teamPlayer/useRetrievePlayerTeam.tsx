import {
  GetAllPlayersResponse,
  GetAllPlayerTeamResponse,
  PlayerTeam
} from '@/app/interfaces/server';
import { ToastData, useToast } from '@/app/hooks/useToast';
import { useState } from 'react';
import { retrieveAllPlayerTeam } from '@/app/services/playersTeam/playersTeam.service';

interface useRetrievePlayerTeamResult {
  playersTeams: PlayerTeam[];
  loading: boolean;
  error: string | null;
  getPlayersTeam: () => Promise<void>;
  toasts: ToastData[];
  removeToast: (_id: string) => void;
  showToast: (
    _type: 'success' | 'error' | 'warning' | 'info',
    _message: string,
    _duration?: number
  ) => void;
}

type UseRetrievePlayerTeamHook = () => useRetrievePlayerTeamResult;
type GetPlayersTeamFunc = () => Promise<void>;
type ShowToastFunction = (
  _type: 'success' | 'error' | 'warning' | 'info',
  _message: string,
  _duration?: number
) => void;

export const useRetrievePlayerTeam: UseRetrievePlayerTeamHook =
  (): useRetrievePlayerTeamResult => {
    const [playersTeam, setPlayerTeam] = useState([] as PlayerTeam[]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { toasts, showToast: showToastFromHook, removeToast } = useToast();

    const showToast: ShowToastFunction = (
      type: 'success' | 'error' | 'warning' | 'info',
      message: string,
      duration?: number
    ): void => {
      const id = `player-team-toast-${Date.now()}.${Math.random().toString()}`;
      showToastFromHook(type, message, duration, id);
    };

    const getPlayersTeam: GetPlayersTeamFunc = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: GetAllPlayerTeamResponse =
          await retrieveAllPlayerTeam();

        if (!response.data) {
          setPlayerTeam([]);
          showToast('info', 'No player team found.', 3000);
        }

        setPlayerTeam(response.data);
        showToast(
          'success',
          `Successfully fetched ${response.data.length} player teams.`,
          3000
        );
      } catch (e) {
        setError((e as Error).message);
        showToast(
          'error',
          `Error fetching player teams: ${(e as Error).message}`,
          5000
        );
      } finally {
        setLoading(false);
      }
    };

    return {
      playersTeams: playersTeam,
      loading: loading,
      error: error,
      getPlayersTeam,
      toasts: toasts,
      removeToast,
      showToast
    };
  };
