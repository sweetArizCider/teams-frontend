import type { Team, CreatePlayerTeamRequest } from '@/app/interfaces/server';

export const createDeletePlayerTeamPayload = (selectedTeam: Team | null) => ({
  _id: 'temp-id',
  player_id: '',
  team_id: selectedTeam?._id || '',
  position: '',
  jersey_number: 0,
  start_date: '',
  is_active: true
});

export const createPlayerTeamPayload = (
  playerId: string,
  teamId: string
): CreatePlayerTeamRequest => ({
  player_id: playerId,
  team_id: teamId,
  position: '',
  jersey_number: 0,
  start_date: new Date().toISOString().split('T')[0],
  is_active: true
});
