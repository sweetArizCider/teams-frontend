import type { Player } from '@/app/interfaces/server';

interface PlayerSelectionHandlers {
  handlePlayerSelection: (_playerId: string, _checked: boolean) => void;
  handleSelectAllPlayers: (_checked: boolean) => void;
}

interface CreateHandlersParams {
  selectedPlayers: Set<string>;
  setSelectedPlayers: (_players: Set<string>) => void;
  itemsPerPage: number;
  currentPage: number;
  players: Player[];
}

export const createPlayerSelectionHandlers = ({
  selectedPlayers,
  setSelectedPlayers,
  itemsPerPage,
  currentPage,
  players
}: CreateHandlersParams): PlayerSelectionHandlers => {
  const handlePlayerSelection = (playerId: string, checked: boolean): void => {
    const newSelectedPlayers = new Set(selectedPlayers);
    if (checked) {
      newSelectedPlayers.add(playerId);
    } else {
      newSelectedPlayers.delete(playerId);
    }
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleSelectAllPlayers = (checked: boolean): void => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPlayers = players.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    if (checked) {
      const allPlayerIds = new Set(
        paginatedPlayers.map((player) => player._id!)
      );
      const newSelection = new Set([...selectedPlayers, ...allPlayerIds]);
      setSelectedPlayers(newSelection);
    } else {
      const currentPagePlayerIds = new Set(
        paginatedPlayers.map((player) => player._id!)
      );
      const newSelection = new Set(selectedPlayers);
      currentPagePlayerIds.forEach((id) => newSelection.delete(id));
      setSelectedPlayers(newSelection);
    }
  };

  return {
    handlePlayerSelection,
    handleSelectAllPlayers
  };
};
