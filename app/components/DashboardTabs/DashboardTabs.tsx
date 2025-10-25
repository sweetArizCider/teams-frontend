import React, { ReactElement, useState } from 'react';
import { TabItem, Tabs, Button } from 'flowbite-react';
import { HiUsers, HiUserGroup, HiPlus } from 'react-icons/hi';
import { MdGroup } from 'react-icons/md';
import { PlayersList } from '../PlayerCard';
import { CreatePlayerModal } from '../CreatePlayerModal';
import { UpdatePlayerModal } from '../UpdatePlayerModal';
import { TeamsList } from '../TeamCard';
import { CreateTeamModal } from '../CreateTeamModal';
import { UpdateTeamModal } from '../UpdateTeamModal';
import type { Player, Team } from '../../interfaces/server';

interface DashboardTabsProps {
  players: Player[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPlayerClick?: (_player: Player) => void;
  onTeamClick?: (team: Team) => void;
  onPlayerCreated: (_newPlayer: Player) => Promise<void>;
  onTeamCreated: (newTeam: Team) => Promise<void>;
  showToast: (
    _type: 'success' | 'error' | 'warning' | 'info',
    _message: string,
    _duration?: number
  ) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  players,
  teams,
  loading,
  error,
  onRetry,
  onPlayerClick,
  onTeamClick,
  onPlayerCreated,
  onTeamCreated,
  showToast
}): ReactElement => {
  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
  const [isUpdatePlayerModalOpen, setIsUpdatePlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isUpdateTeamModalOpen, setIsUpdateTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Player handlers
  const handlePlayerCreatedWithToast = async (
    newPlayer: Player
  ): Promise<void> => {
    showToast(
      'success',
      `Player "${newPlayer.name}" created successfully!`,
      3000
    );
    await onPlayerCreated(newPlayer);
  };

  const handlePlayerUpdatedWithToast = async (
    updatedPlayer: Player
  ): Promise<void> => {
    showToast(
      'success',
      `Player "${updatedPlayer.name}" updated successfully!`,
      3000
    );
    await onPlayerCreated(updatedPlayer);
  };

  const handlePlayerDeletedWithToast = async (): Promise<void> => {
    showToast('success', 'Player deleted successfully!', 3000);
    await onPlayerCreated({} as Player);
  };

  const handlePlayerCreationError = (error: string): void => {
    showToast('error', `Failed to create player: ${error}`, 5000);
  };

  const handlePlayerUpdateError = (error: string): void => {
    showToast('error', `Failed to update player: ${error}`, 5000);
  };

  const handlePlayerDeleteError = (error: string): void => {
    showToast('error', `Failed to delete player: ${error}`, 5000);
  };

  // Team handlers
  const handleTeamCreatedWithToast = async (newTeam: Team): Promise<void> => {
    showToast('success', `Team "${newTeam.name}" created successfully!`, 3000);
    await onTeamCreated(newTeam);
  };

  const handleTeamUpdatedWithToast = async (
    updatedTeam: Team
  ): Promise<void> => {
    showToast(
      'success',
      `Team "${updatedTeam.name}" updated successfully!`,
      3000
    );
    await onTeamCreated(updatedTeam);
  };

  const handleTeamDeletedWithToast = async (): Promise<void> => {
    showToast('success', 'Team deleted successfully!', 3000);
    await onTeamCreated({} as Team);
  };

  const handleTeamCreationError = (error: string): void => {
    showToast('error', `Failed to create team: ${error}`, 5000);
  };

  const handleTeamUpdateError = (error: string): void => {
    showToast('error', `Failed to update team: ${error}`, 5000);
  };

  const handleTeamDeleteError = (error: string): void => {
    showToast('error', `Failed to delete team: ${error}`, 5000);
  };

  // Click handlers
  const handlePlayerCardClick = (player: Player): void => {
    setSelectedPlayer(player);
    setIsUpdatePlayerModalOpen(true);
    onPlayerClick?.(player);
  };

  const handleTeamCardClick = (team: Team): void => {
    setSelectedTeam(team);
    setIsUpdateTeamModalOpen(true);
    onTeamClick?.(team);
  };

  // Modal close handlers
  const handleUpdatePlayerModalClose = (): void => {
    setIsUpdatePlayerModalOpen(false);
    setSelectedPlayer(null);
  };

  const handleUpdateTeamModalClose = (): void => {
    setIsUpdateTeamModalOpen(false);
    setSelectedTeam(null);
  };

  return (
    <>
      <div className='w-full'>
        <Tabs aria-label='Dashboard tabs' variant='underline'>
          <TabItem active title={'Players'} icon={HiUsers}>
            <div className='flex w-full justify-end mb-6'>
              <Button
                pill
                className={'hover:cursor-pointer'}
                onClick={() => setIsCreatePlayerModalOpen(true)}
              >
                <HiPlus className='mr-2 h-5 w-5' />
                Add Player
              </Button>
            </div>

            <PlayersList
              players={players}
              loading={loading}
              error={error}
              onRetry={onRetry}
              onPlayerClick={handlePlayerCardClick}
            />
          </TabItem>

          <TabItem title='Teams' icon={MdGroup}>
            <div className='flex w-full justify-end mb-6'>
              <Button
                pill
                className={'hover:cursor-pointer'}
                onClick={() => setIsCreateTeamModalOpen(true)}
              >
                <HiPlus className='mr-2 h-5 w-5' />
                Add Team
              </Button>
            </div>

            <TeamsList
              teams={teams}
              loading={loading}
              error={error}
              onRetry={onRetry}
              onTeamClick={handleTeamCardClick}
            />
          </TabItem>

          <TabItem title='Player Teams' icon={HiUserGroup}>
            <div className='w-full text-center py-12'>
              <div className='text-lg text-gray-600 dark:text-gray-400'>
                Player Teams goes here
              </div>
            </div>
          </TabItem>
        </Tabs>
      </div>

      {/* Player Modals */}
      <CreatePlayerModal
        isOpen={isCreatePlayerModalOpen}
        onClose={() => setIsCreatePlayerModalOpen(false)}
        onPlayerCreated={handlePlayerCreatedWithToast}
        onError={handlePlayerCreationError}
      />

      <UpdatePlayerModal
        isOpen={isUpdatePlayerModalOpen}
        onClose={handleUpdatePlayerModalClose}
        player={selectedPlayer}
        onPlayerUpdated={handlePlayerUpdatedWithToast}
        onPlayerDeleted={handlePlayerDeletedWithToast}
        onError={handlePlayerDeleteError}
      />

      {/* Team Modals */}
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        onTeamCreated={handleTeamCreatedWithToast}
        onError={handleTeamCreationError}
      />

      <UpdateTeamModal
        isOpen={isUpdateTeamModalOpen}
        onClose={handleUpdateTeamModalClose}
        team={selectedTeam}
        onTeamUpdated={handleTeamUpdatedWithToast}
        onTeamDeleted={handleTeamDeletedWithToast}
        onError={handleTeamDeleteError}
      />
    </>
  );
};
