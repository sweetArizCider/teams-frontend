'use client';

import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import type { PlayerTeam, Player, Team } from '../../interfaces/server';
import { useDeletePlayerTeam } from '../../hooks/playersTeam/useDeletePlayerTeam';

interface DeletePlayerTeamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerTeam: PlayerTeam | null;
  player?: Player;
  team?: Team;
  onPlayerTeamDeleted: () => Promise<void>;
  onError: (_error: string) => void;
}

export const DeletePlayerTeamConfirmationModal: React.FC<
  DeletePlayerTeamConfirmationModalProps
> = ({
  isOpen,
  onClose,
  playerTeam,
  player,
  team,
  onPlayerTeamDeleted,
  onError
}) => {
  const { deletePlayerTeam, loading } = useDeletePlayerTeam();

  const handleConfirmDelete = async (): Promise<void> => {
    if (!playerTeam?._id) {
      onError('Player team ID is missing');
      return;
    }

    try {
      const success = await deletePlayerTeam(playerTeam._id);
      if (success) {
        await onPlayerTeamDeleted();
        onClose();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete player team';
      onError(errorMessage);
    }
  };

  if (!playerTeam) {
    return null;
  }

  return (
    <Modal show={isOpen} size='md' onClose={onClose} popup>
      <ModalHeader />
      <ModalBody>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
            Are you sure you want to delete this player team relationship?
          </h3>

          {player && team && (
            <div className='mb-5 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                <span className='font-medium'>{player.name}</span> from{' '}
                <span className='font-medium'>{team.name}</span>
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                Position: {playerTeam.position} | Jersey: #
                {playerTeam.jersey_number}
              </p>
            </div>
          )}

          <div className='flex justify-center gap-4'>
            <Button
              color='red'
              onClick={handleConfirmDelete}
              disabled={loading}
              className='hover:cursor-pointer'
            >
              {loading ? 'Deleting...' : "Yes, I'm sure"}
            </Button>
            <Button
              color='alternative'
              onClick={onClose}
              disabled={loading}
              className='hover:cursor-pointer'
            >
              No, cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
