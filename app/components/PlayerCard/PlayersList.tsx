import React, { type ReactElement, type FC } from 'react';
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

export const PlayersList: FC<PlayersListProps> = (
  props: PlayersListProps
): ReactElement => {
  const { players, loading, onPlayerClick } = props;

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
    <div className='w-full flex flex-col min-h-[700px]'>
      <div className='flex-1'>
        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {paginatedData.map(
            (player: Player): ReactElement => (
              <PlayerCard
                key={player._id || player.name}
                player={player}
                onClick={onPlayerClick}
              />
            )
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className='flex mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 justify-center'>
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
