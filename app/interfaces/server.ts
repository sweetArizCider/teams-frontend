// Base API Response structure
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Validation Error interfaces
export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationError {
  detail: ValidationErrorDetail[];
}

// Player interfaces
export interface Player {
  _id?: string;
  name: string;
  age: number;
  number?: number;
  nationality?: string;
  position?: string;
}

export interface CreatePlayerRequest {
  name: string;
  age: number;
  number?: number;
  nationality?: string;
  position?: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  age?: number;
  number?: number;
  nationality?: string;
  position?: string;
}

// Team interfaces
export interface Team {
  _id?: string;
  name: string;
  sport: string;
  city: string;
}

export interface CreateTeamRequest {
  name: string;
  sport: string;
  city: string;
}

export interface UpdateTeamRequest {
  name?: string;
  sport?: string;
  city?: string;
}

// Player-Team relationship interfaces
export interface PlayerTeam {
  _id?: string;
  player_id: string;
  team_id: string;
  position: string;
  jersey_number: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface CreatePlayerTeamRequest {
  player_id: string;
  team_id: string;
  position: string;
  jersey_number: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface UpdatePlayerTeamRequest {
  player_id?: string;
  team_id?: string;
  position?: string;
  jersey_number?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// Extended interfaces for complex responses
export interface PlayerWithTeamInfo extends Player {
  current_team?: Team;
  teams?: PlayerTeam[];
}

export interface TeamWithPlayersInfo extends Team {
  players?: PlayerWithTeamInfo[];
  player_count?: number;
}

// API Response Types
export type GetAllPlayersResponse = ApiResponse<Player[]>;
export type GetPlayerByIdResponse = ApiResponse<Player>;
export type CreatePlayerResponse = ApiResponse<Player>;
export type UpdatePlayerResponse = ApiResponse<Player>;
export type DeletePlayerResponse = ApiResponse<{ message: string }>;

export type GetAllTeamsResponse = ApiResponse<Team[]>;
export type GetTeamByIdResponse = ApiResponse<Team>;
export type CreateTeamResponse = ApiResponse<Team>;
export type UpdateTeamResponse = ApiResponse<Team>;
export type DeleteTeamResponse = ApiResponse<{ message: string }>;

export type GetAllPlayerTeamResponse = ApiResponse<PlayerTeam[]>;
export type GetPlayerTeamByIdResponse = ApiResponse<PlayerTeam>;
export type CreatePlayerTeamResponse = ApiResponse<PlayerTeam>;
export type UpdatePlayerTeamResponse = ApiResponse<PlayerTeam>;
export type DeletePlayerTeamResponse = ApiResponse<{ message: string }>;

export type GetPlayersByTeamResponse = ApiResponse<PlayerWithTeamInfo[]>;
export type GetTeamsByPlayerResponse = ApiResponse<TeamWithPlayersInfo[]>;

// Error Response Types
export type ApiErrorResponse = ValidationError;

// Generic API Response Handler
export interface ApiResult<T> {
  data?: T;
  error?: ValidationError | string;
  loading: boolean;
}

// HTTP Methods for type safety
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// API Endpoints enum for type safety
export enum ApiEndpoints {
  // Player endpoints
  GET_ALL_PLAYERS = '/players/',
  CREATE_PLAYER = '/players/',
  GET_PLAYER_BY_ID = '/players/{player_id}',
  UPDATE_PLAYER = '/players/{player_id}',
  DELETE_PLAYER = '/players/{player_id}',

  // Team endpoints
  GET_ALL_TEAMS = '/teams/',
  CREATE_TEAM = '/teams/',
  GET_TEAM_BY_ID = '/teams/{team_id}',
  UPDATE_TEAM = '/teams/{team_id}',
  DELETE_TEAM = '/teams/{team_id}',

  // Player-Team relationship endpoints
  GET_ALL_PLAYER_TEAM = '/players_team/',
  CREATE_PLAYER_TEAM = '/players_team/',
  GET_PLAYER_TEAM_BY_ID = '/players_team/{relationship_id}',
  UPDATE_PLAYER_TEAM = '/players_team/{relationship_id}',
  DELETE_PLAYER_TEAM = '/players_team/{relationship_id}',
  GET_PLAYERS_BY_TEAM = '/players_team/team/{team_id}/players',
  GET_TEAMS_BY_PLAYER = '/players_team/player/{player_id}/teams'
}

// Request configuration interface
export interface ApiRequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  params?: Record<string, string | number>;
}

// Common HTTP status codes
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}
