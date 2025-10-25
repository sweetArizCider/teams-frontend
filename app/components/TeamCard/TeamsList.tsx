import React, { ReactElement } from 'react';
import { Pagination } from 'flowbite-react';
import type { Team } from '../../interfaces/server';
import { TeamCard } from './TeamCard';
import { usePagination } from '../../hooks/usePagination';

interface TeamsListProps {
  teams: Team[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onTeamClick?: (_team: Team) => void;
}

type TeamsListComponent = React.FC<TeamsListProps>;
type OnPageChangeFunction = (_page: number) => void;

export const TeamsList: TeamsListComponent = (
  props: TeamsListProps
): ReactElement => {
  const { teams, loading, onTeamClick }: TeamsListProps = props;

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange
  }: {
    currentPage: number;
    totalPages: number;
    paginatedData: Team[];
    onPageChange: OnPageChangeFunction;
  } = usePagination({
    data: teams,
    itemsPerPage: 18
  });

  if (loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          Loading teams...
        </div>
      </div>
    );
  }

  if (teams.length === 0 && !loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          No teams found
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col h-[600px]'>
      <div className='flex-1'>
        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {paginatedData.map(
            (team: Team): ReactElement => (
              <TeamCard
                key={team._id || team.name}
                team={team}
                onClick={onTeamClick}
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
