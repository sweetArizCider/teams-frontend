import React, { ReactElement } from 'react';
import type { Team } from '../../interfaces/server';
import { TeamIcon } from '../TeamCard/TeamIcon';

interface PlayerTeamCardProps {
  team: Team;
  playerCount: number;
  onClick?: (_team: Team) => void;
}

interface GetTeamDetailsFunction {
  (_team: Team, _playerCount: number): string;
}

type HandleClickFunction = () => void;
type PlayerTeamCardComponent = React.FC<PlayerTeamCardProps>;

export const PlayerTeamCard: PlayerTeamCardComponent = (
  props: PlayerTeamCardProps
): ReactElement => {
  const { team, playerCount, onClick } = props;

  const getTeamDetails: GetTeamDetailsFunction = (
    team: Team,
    playerCount: number
  ): string => {
    const playerText = playerCount === 1 ? 'player' : 'players';
    return `${team.sport} • ${team.city} • ${playerCount} ${playerText}`;
  };

  const handleClick: HandleClickFunction = (): void => {
    if (onClick) {
      onClick(team);
    }
  };

  return (
    <div
      key={team._id || team.name}
      className='outline-primary-600 dark:outline-primary-500 group hover:border-primary-600 dark:hover:border-primary-500 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gray-50 outline-offset-2 focus:outline-2 dark:border-gray-700 dark:bg-gray-800'
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
    >
      <div className='flex items-center gap-6 p-4'>
        <div className='flex flex-1 items-center gap-2'>
          <div className='size-9'>
            <TeamIcon />
          </div>

          <div className='flex flex-1 flex-col items-start justify-center gap-1.5 border-l border-gray-200 pl-3.5 dark:border-gray-700'>
            <div className='w-full font-sans text-lg leading-4 font-semibold text-gray-900 dark:text-gray-200'>
              {team.name}
            </div>

            <div className='w-full font-sans text-sm leading-5 font-normal text-gray-500 dark:text-gray-400'>
              {getTeamDetails(team, playerCount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
