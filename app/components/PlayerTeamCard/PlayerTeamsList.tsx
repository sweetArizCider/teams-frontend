import React from 'react';
import { Pagination } from 'flowbite-react';
import type { PlayerTeam, Player, Team } from '../../interfaces/server';
import { PlayerTeamCard } from './PlayerTeamCard';
import { usePagination } from '../../hooks/usePagination';

interface PlayerTeamsListProps {
  playerTeams: PlayerTeam[];
  players: Player[];
  teams: Team[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onPlayerTeamClick?: (_team: Team) => void;
}

interface TeamWithPlayerCount {
  team: Team;
  playerCount: number;
}

// Extended interface to handle the actual API response structure
interface ApiPlayerTeamResponse {
  _id: string;
  team: {
    name: string;
    sport: string;
    city: string;
    _id?: string;
  };
  players: {
    is_array: boolean;
    object_array: Array<{
      name: string;
      age: number;
      number: number;
      nationality: string;
      position: string;
      _id?: string;
    }> | null;
  };
  position: string;
  jersey_number: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export const PlayerTeamsList: React.FC<PlayerTeamsListProps> = (
  props: PlayerTeamsListProps
) => {
  const { playerTeams, players, teams, loading, onPlayerTeamClick } = props;

  // Handle the actual API response structure
  const processPlayerTeams = (): TeamWithPlayerCount[] => {
    const teamMap = new Map<string, TeamWithPlayerCount>();

    // Convert playerTeams to the expected format and group by team
    (playerTeams as any[]).forEach((pt: ApiPlayerTeamResponse) => {
      if (pt.team && pt.players && pt.players.object_array) {
        const teamName = pt.team.name;
        const playerCount = pt.players.object_array.length;

        // Create a team object that matches our Team interface
        const team: Team = {
          _id: pt.team._id || teamName, // Use team name as fallback ID
          name: pt.team.name,
          sport: pt.team.sport,
          city: pt.team.city
        };

        if (teamMap.has(teamName)) {
          // Add to existing team's player count
          const existing = teamMap.get(teamName)!;
          existing.playerCount += playerCount;
        } else {
          // Create new team entry
          teamMap.set(teamName, {
            team,
            playerCount
          });
        }
      }
    });

    return Array.from(teamMap.values()).filter(item => item.playerCount > 0);
  };

  const teamsWithPlayerCounts = processPlayerTeams();

  const { currentPage, totalPages, paginatedData, onPageChange } =
    usePagination({
      data: teamsWithPlayerCounts,
      itemsPerPage: 18
    });

  if (loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          Loading player teams...
        </div>
      </div>
    );
  }

  if (teamsWithPlayerCounts.length === 0 && !loading) {
    return (
      <div className='w-full text-center'>
        <div className='text-lg text-gray-600 dark:text-gray-400'>
          No teams with players found
        </div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col min-h-[700px]'>
      <div className='flex-1'>
        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {paginatedData.map((item: TeamWithPlayerCount) => (
            <PlayerTeamCard
              key={item.team._id || item.team.name}
              team={item.team}
              playerCount={item.playerCount}
              onClick={onPlayerTeamClick}
            />
          ))}
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
