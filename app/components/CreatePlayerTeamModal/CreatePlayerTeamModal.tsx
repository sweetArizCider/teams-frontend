'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Select,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Pagination
} from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import type {
  CreatePlayerTeamRequest,
  Player,
  Team,
  PlayerTeam
} from '../../interfaces/server';
import { useCreatePlayerTeam } from '../../hooks/playersTeam/useCreatePlayerTeam';

interface CreatePlayerTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerTeamCreated: (_newPlayerTeam: PlayerTeam) => Promise<void>;
  onError: (_error: string) => void;
  teams: Team[];
  players: Player[];
}

export const CreatePlayerTeamModal: React.FC<CreatePlayerTeamModalProps> = ({
  isOpen,
  onClose,
  onPlayerTeamCreated,
  onError,
  teams,
  players
}) => {
  const { createPlayerTeam, loading, error, clearError } =
    useCreatePlayerTeam();

  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set<string>()
  );

  // Pagination for players table
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  const totalPages: number = Math.ceil(players.length / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers: Player[] = players.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect((): void => {
    if (error) {
      onError(error);
      clearError();
    }
  }, [error, onError, clearError]);

  const handleClose = (): void => {
    setSelectedTeamId('');
    setSelectedPlayers(new Set());
    setCurrentPage(1);
    clearError();
    onClose();
  };

  const handlePlayerSelection = (playerId: string, checked: boolean): void => {
    const newSelectedPlayers: Set<string> = new Set<string>(selectedPlayers);
    if (checked) {
      newSelectedPlayers.add(playerId);
    } else {
      newSelectedPlayers.delete(playerId);
    }
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleSelectAllPlayers = (checked: boolean): void => {
    if (checked) {
      const allPlayerIds: Set<string> = new Set<string>(
        paginatedPlayers.map((player: Player) => player._id!)
      );
      setSelectedPlayers(
        (prev: Set<string>) => new Set<string>([...prev, ...allPlayerIds])
      );
    } else {
      const currentPagePlayerIds: Set<string> = new Set<string>(
        paginatedPlayers.map((player: Player) => player._id!)
      );
      setSelectedPlayers((prev: Set<string>) => {
        const newSet: Set<string> = new Set<string>(prev);
        currentPagePlayerIds.forEach((id: string) => newSet.delete(id));
        return newSet;
      });
    }
  };

  const isAllCurrentPageSelected = (): boolean => {
    return paginatedPlayers.every((player) => selectedPlayers.has(player._id!));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!selectedTeamId) {
      onError('Please select a team');
      return;
    }

    if (selectedPlayers.size === 0) {
      onError('Please select at least one player');
      return;
    }

    try {
      // Create player team relationship for each selected player with default values
      const createdPlayerTeams: PlayerTeam[] = [];

      for (const playerId of selectedPlayers) {
        const playerTeamData: CreatePlayerTeamRequest = {
          player_id: playerId,
          team_id: selectedTeamId,
          position: '',
          jersey_number: 0,
          start_date: new Date().toISOString().split('T')[0], // Today's date
          is_active: true
        };

        const result: PlayerTeam | null =
          await createPlayerTeam(playerTeamData);
        if (result) {
          createdPlayerTeams.push(result);
        }
      }

      if (createdPlayerTeams.length > 0) {
        await onPlayerTeamCreated(createdPlayerTeams[0]);
        handleClose();
      }
    } catch (err: unknown) {
      const errorMessage: string =
        err instanceof Error ? err.message : 'Failed to create player team';
      onError(errorMessage);
    }
  };

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <Modal show={isOpen} size='4xl' onClose={handleClose} popup>
      <ModalHeader />
      <ModalBody>
        <div className='space-y-6'>
          <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
            Add Players to Team
          </h3>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Team Selection */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='team'>Select Team</Label>
              </div>
              <Select
                id='team'
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                required
              >
                <option value=''>Choose a team</option>
                {teams.map((team: Team) => (
                  <option key={team._id} value={team._id}>
                    {team.name} - {team.city}
                  </option>
                ))}
              </Select>
            </div>

            {/* Players Table */}
            <div>
              <div className='mb-4'>
                <Label>Select Players</Label>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Select players to add to the team. Position, jersey number,
                  and other details can be edited later in the Player Teams tab.
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
                      <TableHeadCell>Age</TableHeadCell>
                      <TableHeadCell>Position</TableHeadCell>
                      <TableHeadCell>Nationality</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className='divide-y'>
                    {paginatedPlayers.map((player: Player) => (
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

            {/* Submit Button */}
            <div className='w-full'>
              <Button
                type='submit'
                disabled={loading}
                className='w-full hover:cursor-pointer'
              >
                <HiPlus className='mr-2 h-4 w-4' />
                {loading ? 'Adding Players...' : 'Add Players to Team'}
              </Button>
            </div>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
};
