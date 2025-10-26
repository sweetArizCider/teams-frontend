import type {
  Team,
  Player,
  ApiPlayerTeamResponse
} from '../../interfaces/playerTeam';
import { useCreatePlayerTeam } from './useCreatePlayerTeam';
import { useDeletePlayerTeam } from './useDeletePlayerTeam';
import { createPlayerTeamPayload } from '../../components/UpdatePlayerTeamModal/constants';

interface UsePlayerTeamOperationsProps {
  selectedTeam: Team | null;
  playerTeams: ApiPlayerTeamResponse[];
  players: Player[];
  onPlayerTeamUpdated: () => Promise<void>;
  onError: (_error: string) => void;
}

interface UsePlayerTeamOperationsReturn {
  addPlayersToTeam: (_playerIds: string[]) => Promise<void>;
  removePlayersFromTeam: (_playerIds: string[]) => Promise<void>;
  deleteAllTeamRelationships: () => Promise<void>;
  loading: boolean;
}

export const usePlayerTeamOperations = ({
  selectedTeam,
  playerTeams,
  players,
  onPlayerTeamUpdated,
  onError
}: UsePlayerTeamOperationsProps): UsePlayerTeamOperationsReturn => {
  const { createPlayerTeam, loading: createLoading } = useCreatePlayerTeam();
  const { deletePlayerTeam, loading: deleteLoading } = useDeletePlayerTeam();

  const addPlayersToTeam = async (playerIds: string[]): Promise<void> => {
    if (!selectedTeam?._id) {
      onError('Team not selected');
      return;
    }

    for (const playerId of playerIds) {
      const playerTeamData = createPlayerTeamPayload(
        playerId,
        selectedTeam._id
      );
      await createPlayerTeam(playerTeamData);
    }
  };

  const removePlayersFromTeam = async (playerIds: string[]): Promise<void> => {
    if (!selectedTeam) {
      onError('Team not selected');
      return;
    }

    for (const playerId of playerIds) {
      const player = players.find((p) => p._id === playerId);
      if (!player) continue;

      const playerTeamRelationships = playerTeams.filter((pt) => {
        if (!pt.team || pt.team.name !== selectedTeam.name) return false;
        if (!pt.players || !pt.players.object_array) return false;

        return pt.players.object_array.some(
          (apiPlayer) => apiPlayer.name === player.name
        );
      });

      for (const relationship of playerTeamRelationships) {
        if (relationship._id) {
          await deletePlayerTeam(relationship._id);
        }
      }
    }
  };

  const deleteAllTeamRelationships = async (): Promise<void> => {
    if (!selectedTeam) {
      onError('Team not selected');
      return;
    }

    const teamRelationships = playerTeams.filter(
      (pt) => pt.team && pt.team.name === selectedTeam.name
    );

    for (const relationship of teamRelationships) {
      if (relationship._id) {
        await deletePlayerTeam(relationship._id);
      }
    }

    await onPlayerTeamUpdated();
  };

  return {
    addPlayersToTeam,
    removePlayersFromTeam,
    deleteAllTeamRelationships,
    loading: createLoading || deleteLoading
  };
};
