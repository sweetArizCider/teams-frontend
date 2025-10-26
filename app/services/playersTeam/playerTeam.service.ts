import type {
  PlayerTeam,
  CreatePlayerTeamRequest,
  UpdatePlayerTeamRequest,
  CreatePlayerTeamResponse,
  UpdatePlayerTeamResponse,
  GetAllPlayerTeamResponse,
  GetPlayerTeamByIdResponse,
  DeletePlayerTeamResponse,
  ValidationError
} from '../../interfaces/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export class PlayerTeamService {
  private static instance: PlayerTeamService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_BASE_URL}/players_team`;
  }

  static getInstance(): PlayerTeamService {
    if (!PlayerTeamService.instance) {
      PlayerTeamService.instance = new PlayerTeamService();
    }
    return PlayerTeamService.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAllPlayerTeams(): Promise<PlayerTeam[]> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<GetAllPlayerTeamResponse>(response);
      return data.data;
    } catch (error) {
      console.error('Error fetching player teams:', error);
      throw error;
    }
  }

  async getPlayerTeamById(id: string): Promise<PlayerTeam> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<GetPlayerTeamByIdResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching player team with ID ${id}:`, error);
      throw error;
    }
  }

  async createPlayerTeam(playerTeamData: CreatePlayerTeamRequest): Promise<PlayerTeam> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerTeamData),
      });

      const data = await this.handleResponse<CreatePlayerTeamResponse>(response);
      return data.data;
    } catch (error) {
      console.error('Error creating player team:', error);
      throw error;
    }
  }

  async updatePlayerTeam(id: string, playerTeamData: UpdatePlayerTeamRequest): Promise<PlayerTeam> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerTeamData),
      });

      const data = await this.handleResponse<UpdatePlayerTeamResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error updating player team with ID ${id}:`, error);
      throw error;
    }
  }

  async deletePlayerTeam(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await this.handleResponse<DeletePlayerTeamResponse>(response);
    } catch (error) {
      console.error(`Error deleting player team with ID ${id}:`, error);
      throw error;
    }
  }

  async getPlayerTeamsByTeam(teamId: string): Promise<PlayerTeam[]> {
    try {
      const response = await fetch(`${this.baseUrl}/team/${teamId}/players`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<GetAllPlayerTeamResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching player teams for team ${teamId}:`, error);
      throw error;
    }
  }

  async getPlayerTeamsByPlayer(playerId: string): Promise<PlayerTeam[]> {
    try {
      const response = await fetch(`${this.baseUrl}/player/${playerId}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await this.handleResponse<GetAllPlayerTeamResponse>(response);
      return data.data;
    } catch (error) {
      console.error(`Error fetching player teams for player ${playerId}:`, error);
      throw error;
    }
  }
}

export const playerTeamService = PlayerTeamService.getInstance();
