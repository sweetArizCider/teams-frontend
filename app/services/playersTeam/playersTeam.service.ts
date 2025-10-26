import {
  ApiEndpoints,
  CreatePlayerTeamResponse,
  GetAllPlayerTeamResponse,
  UpdatePlayerTeamResponse
} from '@/app/interfaces/server';

const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

interface RetrieveAllPlayerTeamFunction {
  (): Promise<GetAllPlayerTeamResponse>;
}
type CreatePlayersTeamFunction = (
  _playerIds: string[],
  _teamIds: string[]
) => Promise<CreatePlayerTeamResponse>;

type UpdatePlayersTeamFunction = (
  _playerTeamId: string,
  _playerIds: string[],
  _teamIds: string[]
) => Promise<UpdatePlayerTeamResponse>;

export const retrieveAllPlayerTeam: RetrieveAllPlayerTeamFunction =
  async (): Promise<GetAllPlayerTeamResponse> => {
    const response: Response = await fetch(
      `${BACKEND_URL}${ApiEndpoints.GET_ALL_PLAYER_TEAM}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as GetAllPlayerTeamResponse;
  };

export const CreatePlayersTeam: CreatePlayersTeamFunction = async (
  playerIds: string[],
  teamIds: string[]
): Promise<CreatePlayerTeamResponse> => {
  const response: Response = await fetch(
    `${BACKEND_URL}${ApiEndpoints.CREATE_PLAYER_TEAM}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_ids: playerIds, team_ids: teamIds })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as CreatePlayerTeamResponse;
};

export const UpdatePlayersTeam: UpdatePlayersTeamFunction = async (
  playerTeamId: string,
  playerIds: string[],
  teamIds: string[]
): Promise<UpdatePlayerTeamResponse> => {
  const endpoint: string = ApiEndpoints.UPDATE_PLAYER_TEAM.replace(
    '{relationship_id}',
    playerTeamId
  );

  const response: Response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ player_ids: playerIds, team_ids: teamIds })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as UpdatePlayerTeamResponse;
};
