import { useState, useEffect } from 'react';
import type {
  Team,
  Player,
  ApiPlayerTeamResponse
} from '../../interfaces/playerTeam';

interface UsePlayerTeamSelectionProps {
  selectedTeam: Team | null;
  playerTeams: ApiPlayerTeamResponse[];
  players: Player[];
  isOpen: boolean;
}

interface UsePlayerTeamSelectionReturn {
  selectedPlayers: Set<string>;
  initialSelectedPlayers: Set<string>;
  setSelectedPlayers: (
    _value: Set<string> | ((_prev: Set<string>) => Set<string>)
  ) => void;
  resetSelection: () => void;
}

export const usePlayerTeamSelection = ({
  selectedTeam,
  playerTeams,
  players,
  isOpen
}: UsePlayerTeamSelectionProps): UsePlayerTeamSelectionReturn => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [initialSelectedPlayers, setInitialSelectedPlayers] = useState<
    Set<string>
  >(new Set());

  // Initialize selection when modal opens
  useEffect(() => {
    if (selectedTeam && isOpen && playerTeams) {
      const teamPlayerNames = new Set<string>();

      playerTeams.forEach((pt: ApiPlayerTeamResponse) => {
        if (
          pt.team &&
          (pt.team.name === selectedTeam.name ||
            pt.team._id === selectedTeam._id) &&
          pt.players &&
          pt.players.object_array
        ) {
          pt.players.object_array.forEach((player) => {
            teamPlayerNames.add(player.name);
          });
        }
      });

      const playerIds = new Set<string>();
      players.forEach((player) => {
        if (teamPlayerNames.has(player.name)) {
          playerIds.add(player._id!);
        }
      });

      // eslint-disable-next-line no-undef
      setTimeout(() => {
        setSelectedPlayers(playerIds);
        setInitialSelectedPlayers(new Set(playerIds));
      }, 0);
    }
  }, [selectedTeam, playerTeams, players, isOpen]);

  const resetSelection = (): void => {
    setSelectedPlayers(new Set());
    setInitialSelectedPlayers(new Set());
  };

  return {
    selectedPlayers,
    initialSelectedPlayers,
    setSelectedPlayers,
    resetSelection
  };
};
