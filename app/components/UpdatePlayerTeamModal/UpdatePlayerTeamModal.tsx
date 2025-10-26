'use client';
import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';
import type { UpdatePlayerTeamModalProps } from '../../interfaces/playerTeam';
import { usePlayerTeamSelection } from '../../hooks/playersTeam/usePlayerTeamSelection';
import { usePlayerTeamOperations } from '../../hooks/playersTeam/usePlayerTeamOperations';
import { usePlayerTeamPagination } from '../../hooks/playersTeam/usePlayerTeamPagination';
import { DeletePlayerTeamConfirmationModal } from '../DeletePlayerTeamConfirmationModal';
import { TeamInfoDisplay } from './TeamInfoDisplay';
import { PlayerTeamTable } from './PlayerTeamTable';
import { createDeletePlayerTeamPayload } from './constants';
import { createPlayerSelectionHandlers } from './handlers';

export const UpdatePlayerTeamModal: React.FC<UpdatePlayerTeamModalProps> = ({
  isOpen,
  onClose,
  selectedTeam,
  playerTeams,
  players,
  onPlayerTeamUpdated,
  onError
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const itemsPerPage = 10;

  const {
    selectedPlayers,
    initialSelectedPlayers,
    setSelectedPlayers,
    resetSelection
  } = usePlayerTeamSelection({
    selectedTeam,
    playerTeams,
    players,
    isOpen
  });

  const {
    addPlayersToTeam,
    removePlayersFromTeam,
    deleteAllTeamRelationships,
    loading
  } = usePlayerTeamOperations({
    selectedTeam,
    playerTeams,
    players,
    onPlayerTeamUpdated,
    onError
  });

  const { currentPage, onPageChange, resetPage } = usePlayerTeamPagination({
    totalItems: players.length,
    itemsPerPage
  });

  const { handlePlayerSelection, handleSelectAllPlayers } =
    createPlayerSelectionHandlers({
      selectedPlayers,
      setSelectedPlayers,
      itemsPerPage,
      currentPage,
      players
    });

  const handleClose = (): void => {
    resetSelection();
    resetPage();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!selectedTeam) {
      onError('Please select a team');
      return;
    }

    try {
      const playersToAdd = Array.from(selectedPlayers).filter(
        (playerId) => !initialSelectedPlayers.has(playerId)
      );
      const playersToRemove = Array.from(initialSelectedPlayers).filter(
        (playerId) => !selectedPlayers.has(playerId)
      );

      if (playersToAdd.length > 0) {
        await addPlayersToTeam(playersToAdd);
      }
      if (playersToRemove.length > 0) {
        await removePlayersFromTeam(playersToRemove);
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
    try {
      await deleteAllTeamRelationships();
      setIsDeleteModalOpen(false);
      handleClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to delete team relationships';
      onError(errorMessage);
    }
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
            <TeamInfoDisplay team={selectedTeam} />

            <PlayerTeamTable
              players={players}
              selectedPlayers={selectedPlayers}
              onPlayerSelection={handlePlayerSelection}
              onSelectAllPlayers={handleSelectAllPlayers}
              currentPage={currentPage}
              onPageChange={onPageChange}
              itemsPerPage={itemsPerPage}
            />

            <div className='flex gap-3'>
              <Button type='submit' className='flex-1' disabled={loading}>
                {loading ? 'Updating...' : 'Update Team Players'}
              </Button>
              <Button
                type='button'
                color='red'
                onClick={handleDeleteClick}
                className='flex items-center gap-2'
                disabled={loading}
              >
                <HiTrash className='w-4 h-4' />
                Delete
              </Button>
              <Button
                type='button'
                color='gray'
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <DeletePlayerTeamConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        playerTeam={createDeletePlayerTeamPayload(selectedTeam)}
        player={undefined}
        team={selectedTeam}
        onPlayerTeamDeleted={handleConfirmDelete}
        onError={onError}
      />
    </>
  );
};
