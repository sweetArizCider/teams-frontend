import React, { ReactElement } from 'react';
import type { Team } from '../../interfaces/server';
import { TeamIcon } from './TeamIcon';

interface TeamCardProps {
  team: Team;
  onClick?: (_team: Team) => void;
}

interface GetTeamDetailsFunction {
  (_team: Team): string;
}

type HandleClickFunction = () => void;
type TeamCardComponent = React.FC<TeamCardProps>;

export const TeamCard: TeamCardComponent = (
  props: TeamCardProps
): ReactElement => {
  const { team, onClick } = props;

  const getTeamDetails: GetTeamDetailsFunction = (team: Team): string => {
    return `${team.sport} • ${team.city}`;
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
              {getTeamDetails(team)}
            </div>
          </div>
        </div>

        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='group-hover:text-primary-600 dark:group-hover:text-primary-500 h-6 w-6 text-gray-500 transition-transform group-hover:translate-x-1'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M14.2929 7.29289C14.6834 6.90237 15.3166 6.90237 15.7071 7.29289L19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071L15.7071 16.7071C15.3166 17.0976 14.6834 17.0976 14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L14.2929 8.70711C13.9024 8.31658 13.9024 7.68342 14.2929 7.29289Z'
            fill='currentColor'
          />
        </svg>
      </div>
    </div>
  );
};
