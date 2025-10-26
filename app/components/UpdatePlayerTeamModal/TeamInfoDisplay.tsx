import React from 'react';
import type { TeamInfoDisplayProps } from '../../interfaces/playerTeam';

export const TeamInfoDisplay: React.FC<TeamInfoDisplayProps> = ({ team }) => {
  return (
    <div className='mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
        {team.name}
      </h3>
      <p className='text-sm text-gray-600 dark:text-gray-400'>
        {team.sport} • {team.city}
      </p>
    </div>
  );
};
