'use client';
import { ReactElement } from 'react';
import { usePlayer } from './hooks/players/usePlayer';
import { useTeam } from './hooks/teams/useTeam';
import { ToastContainer } from './components/ToastContainer';
import { DashboardTabs } from './components/DashboardTabs';
import { SwitchDarkMode } from '@/app/components/SwitchDarkMode/SwitchDarkMode';

// Type definitions for the Home component
type ShowToastFunction = (
  _type: 'success' | 'error' | 'warning' | 'info',
  _message: string,
  _duration?: number
) => void;

type RemoveToastFunction = (_id: string) => void;
type HandlePlayerCreatedFunction = () => Promise<void>;
type HandleTeamCreatedFunction = () => Promise<void>;
type HandleRetryFunction = () => void;

export default function Home(): ReactElement {
  const {
    players,
    loading: playersLoading,
    error: playersError,
    getPlayers,
    toasts: playerToasts,
    removeToast: removePlayerToast,
    showToast: showPlayerToast
  } = usePlayer();

  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    getTeams,
    toasts: teamToasts,
    removeToast: removeTeamToast
  } = useTeam();

  // Combine toasts from both hooks
  const allToasts: any[] = [...playerToasts, ...teamToasts];

  // Combined loading state
  const loading: boolean = playersLoading || teamsLoading;

  // Combined error state
  const error: string | null = playersError || teamsError;

  // Universal toast function that uses player toast system as primary
  const showToast: ShowToastFunction = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ): void => {
    showPlayerToast(type, message, duration);
  };

  // Universal toast removal function
  const removeToast: RemoveToastFunction = (id: string): void => {
    removePlayerToast(id);
    removeTeamToast(id);
  };

  const handlePlayerCreated: HandlePlayerCreatedFunction =
    async (): Promise<void> => {
      await getPlayers();
    };

  const handleTeamCreated: HandleTeamCreatedFunction =
    async (): Promise<void> => {
      await getTeams();
    };

  const handleRetry: HandleRetryFunction = (): void => {
    getPlayers();
    getTeams();
  };

  return (
    <main className='flex min-h-screen flex-col items-center bg-white px-4 py-8 dark:bg-gray-900'>
      <SwitchDarkMode />
      <div className='relative flex w-full max-w-5xl flex-col items-center gap-4'>
        <div className='relative flex flex-col items-center gap-6'>
          <h1 className='relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200'>
            Sports Management Dashboard
          </h1>
        </div>

        <div className='relative flex w-full flex-col items-center gap-4 self-stretch'>
          <DashboardTabs
            players={players}
            teams={teams}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            onPlayerCreated={handlePlayerCreated}
            onTeamCreated={handleTeamCreated}
            showToast={showToast}
          />
        </div>
      </div>

      <ToastContainer toasts={allToasts} onRemoveToast={removeToast} />
    </main>
  );
}
