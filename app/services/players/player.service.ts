import {
  type Player,
  type CreatePlayerRequest,
  type GetAllPlayersResponse,
  type GetPlayerByIdResponse,
  type CreatePlayerResponse,
  ApiEndpoints
} from '../../interfaces/server';

const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

interface CreateSinglePlayerFunction {
  (_props: CreatePlayerRequest): Promise<Player>;
}

interface RetrieveSinglePlayerFunction {
  (_playerId: string): Promise<Player>;
}

interface RetrieveAllPlayersFunction {
  (): Promise<Player[]>;
}

export const retrieveSinglePlayer: RetrieveSinglePlayerFunction = async (
  playerId: string
): Promise<Player> => {
  const response: Response = await fetch(
    `${BACKEND_URL}${ApiEndpoints.GET_PLAYER_BY_ID.replace('{player_id}', playerId)}`,
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

  const json: GetPlayerByIdResponse = await response.json();
  return json.data;
};

export const retrieveAllPlayers: RetrieveAllPlayersFunction = async (): Promise<
  Player[]
> => {
  const response: Response = await fetch(
    `${BACKEND_URL}${ApiEndpoints.GET_ALL_PLAYERS}`,
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

  const json: GetAllPlayersResponse = await response.json();
  return json.data;
};

export const createSinglePlayer: CreateSinglePlayerFunction = async (
  props: CreatePlayerRequest
): Promise<Player> => {
  const response: Response = await fetch(
    `${BACKEND_URL}${ApiEndpoints.CREATE_PLAYER}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: CreatePlayerResponse = await response.json();
  return json.data;
};
