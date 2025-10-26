import type {
  PlayerTeam,
  CreatePlayerTeamRequest,
  UpdatePlayerTeamRequest,
  ApiResponse
} from '../../interfaces/server';

interface PlayerTeamService {
  getAllPlayerTeams: () => Promise<PlayerTeam[]>;
  getPlayerTeamById: (_id: string) => Promise<PlayerTeam>;
  createPlayerTeam: (
    _playerTeamData: CreatePlayerTeamRequest
  ) => Promise<PlayerTeam>;
  updatePlayerTeam: (
    _id: string,
    _playerTeamData: UpdatePlayerTeamRequest
  ) => Promise<PlayerTeam>;
  deletePlayerTeam: (_id: string) => Promise<void>;
  getPlayerTeamsByTeam: (_teamId: string) => Promise<PlayerTeam[]>;
  getPlayerTeamsByPlayer: (_playerId: string) => Promise<PlayerTeam[]>;
}

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const BASE_URL: string = `${API_BASE_URL}/players_team`;

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: unknown = await response.json();
    throw new Error(
      (errorData as { message?: string })?.message ||
        `HTTP error! status: ${response.status}`
    );
  }
  return (await response.json()) as Promise<T>;
};

// Get all player teams
export const getAllPlayerTeams = async (): Promise<PlayerTeam[]> => {
  try {
    const response: Response = await fetch(`${BASE_URL}/`, {
      method: 'GET' as const,
      headers: {
        'Content-Type': 'application/json'
      } as const
    });

    const data: ApiResponse<PlayerTeam[]> =
      await handleResponse<ApiResponse<PlayerTeam[]>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error('Error fetching player teams:', error);
    throw error;
  }
};

// Get player team by ID
export const getPlayerTeamById = async (id: string): Promise<PlayerTeam> => {
  try {
    const response: Response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET' as const,
      headers: {
        'Content-Type': 'application/json'
      } as const
    });

    const data: ApiResponse<PlayerTeam> =
      await handleResponse<ApiResponse<PlayerTeam>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error(`Error fetching player team with ID ${id}:`, error);
    throw error;
  }
};

// Create new player team relationship
export const createPlayerTeam = async (
  playerTeamData: CreatePlayerTeamRequest
): Promise<PlayerTeam> => {
  try {
    const response: Response = await fetch(`${BASE_URL}/`, {
      method: 'POST' as const,
      headers: {
        'Content-Type': 'application/json'
      } as const,
      body: JSON.stringify(playerTeamData)
    });

    const data: ApiResponse<PlayerTeam> =
      await handleResponse<ApiResponse<PlayerTeam>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error('Error creating player team:', error);
    throw error;
  }
};

// Update player team relationship
export const updatePlayerTeam = async (
  id: string,
  playerTeamData: UpdatePlayerTeamRequest
): Promise<PlayerTeam> => {
  try {
    const response: Response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT' as const,
      headers: {
        'Content-Type': 'application/json'
      } as const,
      body: JSON.stringify(playerTeamData)
    });

    const data: ApiResponse<PlayerTeam> =
      await handleResponse<ApiResponse<PlayerTeam>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error(`Error updating player team with ID ${id}:`, error);
    throw error;
  }
};

// Delete player team relationship
export const deletePlayerTeam = async (id: string): Promise<void> => {
  try {
    const response: Response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE' as const,
      headers: {
        'Content-Type': 'application/json'
      } as const
    });

    await handleResponse<ApiResponse<void>>(response);
  } catch (error: unknown) {
    console.error(`Error deleting player team with ID ${id}:`, error);
    throw error;
  }
};

// Get player teams by team ID
export const getPlayerTeamsByTeam = async (
  teamId: string
): Promise<PlayerTeam[]> => {
  try {
    const response: Response = await fetch(
      `${BASE_URL}/team/${teamId}/players`,
      {
        method: 'GET' as const,
        headers: {
          'Content-Type': 'application/json'
        } as const
      }
    );

    const data: ApiResponse<PlayerTeam[]> =
      await handleResponse<ApiResponse<PlayerTeam[]>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error(`Error fetching player teams for team ${teamId}:`, error);
    throw error;
  }
};

// Get player teams by player ID
export const getPlayerTeamsByPlayer = async (
  playerId: string
): Promise<PlayerTeam[]> => {
  try {
    const response: Response = await fetch(
      `${BASE_URL}/player/${playerId}/teams`,
      {
        method: 'GET' as const,
        headers: {
          'Content-Type': 'application/json'
        } as const
      }
    );

    const data: ApiResponse<PlayerTeam[]> =
      await handleResponse<ApiResponse<PlayerTeam[]>>(response);
    return data.data;
  } catch (error: unknown) {
    console.error(`Error fetching player teams for player ${playerId}:`, error);
    throw error;
  }
};

export const playerTeamService: PlayerTeamService = {
  getAllPlayerTeams,
  getPlayerTeamById,
  createPlayerTeam,
  updatePlayerTeam,
  deletePlayerTeam,
  getPlayerTeamsByTeam,
  getPlayerTeamsByPlayer
} as const;
