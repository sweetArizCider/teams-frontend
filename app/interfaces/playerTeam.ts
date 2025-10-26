import { Team, Player } from './server';

export interface ApiPlayerTeamResponse {
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

export interface UpdatePlayerTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeam: Team | null;
  playerTeams: ApiPlayerTeamResponse[];
  players: Player[];
  onPlayerTeamUpdated: () => Promise<void>;
  onError: (_error: string) => void;
}

export interface PlayerTeamTableProps {
  players: Player[];
  selectedPlayers: Set<string>;
  onPlayerSelection: (_playerId: string, _checked: boolean) => void;
  onSelectAllPlayers: (_checked: boolean) => void;
  currentPage: number;
  onPageChange: (_page: number) => void;
  itemsPerPage: number;
}

export interface TeamInfoDisplayProps {
  team: Team;
}

export type { Team, Player, CreatePlayerTeamRequest } from './server';
