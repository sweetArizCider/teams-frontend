import React, { ReactElement } from 'react';
import { Pagination } from 'flowbite-react';
import type { Player } from '../../interfaces/server';
import { PlayerCard } from './PlayerCard';
import { usePagination } from '../../hooks/usePagination';

interface PlayersListProps {
  players: Player[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPlayerClick?: (_player: Player) => void;
}

export const PlayersList: React.FC<PlayersListProps> = (
  props: PlayersListProps
): ReactElement => {
  const { players, loading, error, onRetry, onPlayerClick } = props;

  const { currentPage, totalPages, paginatedData, onPageChange } =
    usePagination({
      data: players,
      itemsPerPage: 18
    });

  if (loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          Loading players...
        </div>
      </div>
    );
  }

  if (players.length === 0 && !loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          No players found
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-6'>
      <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {paginatedData.map((player) => (
          <PlayerCard
            key={player._id || player.name}
            player={player}
            onClick={onPlayerClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className='flex overflow-x-auto sm:justify-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
    </div>
  );
};
