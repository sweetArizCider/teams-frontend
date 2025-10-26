'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Pagination
} from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';
import type {
  Team,
  Player,
  CreatePlayerTeamRequest
} from '../../interfaces/server';
import { useCreatePlayerTeam } from '../../hooks/playersTeam/useCreatePlayerTeam';
import { useDeletePlayerTeam } from '../../hooks/playersTeam/useDeletePlayerTeam';
import { DeletePlayerTeamConfirmationModal } from '../DeletePlayerTeamConfirmationModal';

// Interface to match the actual API response structure
interface ApiPlayerTeamResponse {
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

interface UpdatePlayerTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeam: Team | null;
  playerTeams: ApiPlayerTeamResponse[];
  players: Player[];
  onPlayerTeamUpdated: () => Promise<void>;
  onError: (_error: string) => void;
}

export const UpdatePlayerTeamModal: React.FC<UpdatePlayerTeamModalProps> = ({
  isOpen,
  onClose,
  selectedTeam,
  playerTeams,
  players,
  onPlayerTeamUpdated,
  onError
}) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [initialSelectedPlayers, setInitialSelectedPlayers] = useState<
    Set<string>
  >(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { createPlayerTeam, loading: createLoading } = useCreatePlayerTeam();
  const { deletePlayerTeam, loading: deleteLoading } = useDeletePlayerTeam();

  // Pagination for players table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  // Initialize form with existing data when modal opens
  useEffect(() => {
    if (selectedTeam && isOpen && playerTeams) {
      // Get players currently assigned to this team from the API response
      const teamPlayerNames = new Set<string>();

      (playerTeams as ApiPlayerTeamResponse[]).forEach(
        (pt: ApiPlayerTeamResponse) => {
          if (
            pt.team &&
            (pt.team.name === selectedTeam.name || pt.team._id === selectedTeam._id) &&
            pt.players &&
            pt.players.object_array
          ) {
            pt.players.object_array.forEach((player) => {
              teamPlayerNames.add(player.name);
            });
          }
        }
      );

      // Find matching player IDs from the players array
      const playerIds = new Set<string>();
      players.forEach((player) => {
        if (teamPlayerNames.has(player.name)) {
          playerIds.add(player._id!);
        }
      });

      setSelectedPlayers(playerIds);
      setInitialSelectedPlayers(new Set(playerIds)); // Keep track of initial state
      setCurrentPage(1);
    }
  }, [selectedTeam, playerTeams, players, isOpen]);

  const handleClose = (): void => {
    setSelectedPlayers(new Set());
    setInitialSelectedPlayers(new Set());
    setCurrentPage(1);
    onClose();
  };

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
    if (checked) {
      const allPlayerIds = new Set(
        paginatedPlayers.map((player) => player._id!)
      );
      setSelectedPlayers((prev) => new Set([...prev, ...allPlayerIds]));
    } else {
      const currentPagePlayerIds = new Set(
        paginatedPlayers.map((player) => player._id!)
      );
      setSelectedPlayers((prev) => {
        const newSet = new Set(prev);
        currentPagePlayerIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
  };

  const isAllCurrentPageSelected = (): boolean => {
    return paginatedPlayers.every((player) =>
      selectedPlayers.has(player._id!)
    );
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedTeam) {
      onError('Please select a team');
      return;
    }

    try {
      // Find players to add (in selectedPlayers but not in initialSelectedPlayers)
      const playersToAdd = Array.from(selectedPlayers).filter(
        (playerId) => !initialSelectedPlayers.has(playerId)
      );

      // Find players to remove (in initialSelectedPlayers but not in selectedPlayers)
      const playersToRemove = Array.from(initialSelectedPlayers).filter(
        (playerId) => !selectedPlayers.has(playerId)
      );

      // Add new players
      for (const playerId of playersToAdd) {
        const playerTeamData: CreatePlayerTeamRequest = {
          player_id: playerId,
          team_id: selectedTeam._id,
          position: 'TBD',
          jersey_number: 0,
          start_date: new Date().toISOString().split('T')[0],
          is_active: true
        };
        await createPlayerTeam(playerTeamData);
      }

      // Remove players - find the correct player-team relationship IDs
      for (const playerId of playersToRemove) {
        const player = players.find((p) => p._id === playerId);
        if (!player) continue;

        // Find all player-team relationships for this specific player and team
        const playerTeamRelationships = (
          playerTeams as ApiPlayerTeamResponse[]
        ).filter((pt) => {
          if (!pt.team || pt.team.name !== selectedTeam?.name) return false;
          if (!pt.players || !pt.players.object_array) return false;

          return pt.players.object_array.some(
            (apiPlayer) => apiPlayer.name === player.name
          );
        });

        // Delete each relationship
        for (const relationship of playerTeamRelationships) {
          if (relationship._id) {
            await deletePlayerTeam(relationship._id);
          }
        }
      }

      await onPlayerTeamUpdated();
      handleClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update player team';
      onError(errorMessage);
    }
  };

  const handleDeleteClick = (): void => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (selectedTeam) {
      try {
        // Delete all player-team relationships for this team
        const teamRelationships = (
          playerTeams as ApiPlayerTeamResponse[]
        ).filter((pt) => pt.team && pt.team.name === selectedTeam.name);

        for (const relationship of teamRelationships) {
          if (relationship._id) {
            await deletePlayerTeam(relationship._id);
          }
        }

        await onPlayerTeamUpdated();
        setIsDeleteModalOpen(false);
        handleClose();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to delete team relationships';
        onError(errorMessage);
      }
    }
  };

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  if (!selectedTeam) {
    return null;
  }

  return (
    <>
      <Modal show={isOpen} size='5xl' onClose={handleClose}>
        <ModalHeader>
          Manage Players for {selectedTeam.name} ({selectedTeam.city})
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Team Info */}
            <div className='mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {selectedTeam.name}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {selectedTeam.sport} • {selectedTeam.city}
              </p>
            </div>

            {/* Players Table */}
            <div>
              <div className='mb-4'>
                <Label>Available Players</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Select or deselect players for this team.
                </p>
              </div>

              <div className='overflow-x-auto'>
                <Table hoverable>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell className='p-4'>
                        <Checkbox
                          checked={isAllCurrentPageSelected()}
                          onChange={(e) =>
                            handleSelectAllPlayers(e.target.checked)
                          }
                        />
                      </TableHeadCell>
                      <TableHeadCell>Name</TableHeadCell>
                      <TableHeadCell>Number</TableHeadCell>
                      <TableHeadCell>Age</TableHeadCell>
                      <TableHeadCell>Position</TableHeadCell>
                      <TableHeadCell>Nationality</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className='divide-y'>
                    {paginatedPlayers.map((player) => (
                      <TableRow
                        key={player._id}
                        className='bg-white dark:border-gray-700 dark:bg-gray-800'
                      >
                        <TableCell className='p-4'>
                          <Checkbox
                            checked={selectedPlayers.has(player._id!)}
                            onChange={(e) =>
                              handlePlayerSelection(
                                player._id!,
                                e.target.checked
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                          {player.name}
                        </TableCell>
                        <TableCell>#{player.number || 'N/A'}</TableCell>
                        <TableCell>{player.age}</TableCell>
                        <TableCell>{player.position || 'N/A'}</TableCell>
                        <TableCell>{player.nationality || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center mt-4'>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              )}

              {/* Selected players count */}
              <div className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                Selected players: {selectedPlayers.size}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button
                type='submit'
                className='flex-1'
                disabled={createLoading || deleteLoading}
              >
                {createLoading || deleteLoading
                  ? 'Updating...'
                  : 'Update Team Players'}
              </Button>
              <Button
                type='button'
                color='red'
                onClick={handleDeleteClick}
                className='flex items-center gap-2'
                disabled={createLoading || deleteLoading}
              >
                <HiTrash className='w-4 h-4' />
                Delete
              </Button>
              <Button
                type='button'
                color='gray'
                onClick={handleClose}
                disabled={createLoading || deleteLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeletePlayerTeamConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        playerTeam={{
          _id: 'temp-id',
          player_id: '',
          team_id: selectedTeam?._id || '',
          position: '',
          jersey_number: 0,
          start_date: '',
          is_active: true
        }}
        player={undefined}
        team={selectedTeam}
        onPlayerTeamDeleted={handleConfirmDelete}
        onError={onError}
      />
    </>
  );
};
