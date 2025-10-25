import {
  type Player,
  type CreatePlayerRequest,
  type UpdatePlayerRequest,
  type GetAllPlayersResponse,
  type CreatePlayerResponse,
  type UpdatePlayerResponse,
  ApiEndpoints
} from '../../interfaces/server';

const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

interface CreateSinglePlayerFunction {
  (_props: CreatePlayerRequest): Promise<Player>;
}

interface RetrieveAllPlayersFunction {
  (): Promise<Player[]>;
}

interface UpdateSinglePlayerFunction {
  (_playerId: string, _props: UpdatePlayerRequest): Promise<Player>;
}

interface DeleteSinglePlayerFunction {
  (_playerId: string): Promise<void>;
}

type FetchResponse = Response;

export const retrieveAllPlayers: RetrieveAllPlayersFunction = async (): Promise<
  Player[]
> => {
  const response: FetchResponse = await fetch(
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
  const response: FetchResponse = await fetch(
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

export const updateSinglePlayer: UpdateSinglePlayerFunction = async (
  playerId: string,
  props: UpdatePlayerRequest
): Promise<Player> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.UPDATE_PLAYER.replace('{player_id}', playerId)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json: UpdatePlayerResponse = await response.json();
  return json.data;
};

export const deleteSinglePlayer: DeleteSinglePlayerFunction = async (
  playerId: string
): Promise<void> => {
  const response: FetchResponse = await fetch(
    `${BACKEND_URL}${ApiEndpoints.DELETE_PLAYER.replace('{player_id}', playerId)}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};
