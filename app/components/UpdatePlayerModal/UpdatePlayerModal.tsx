'use client';

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput
} from 'flowbite-react';
import { FormEvent, ReactElement, useState, useEffect } from 'react';
import { HiTrash } from 'react-icons/hi';
import type { UpdatePlayerRequest, Player } from '../../interfaces/server';
import { useUpdatePlayer } from '../../hooks/players/useUpdatePlayer';
import { useDeletePlayer } from '../../hooks/players/useDeletePlayer';
import { DeletePlayerConfirmationModal } from '../DeletePlayerConfirmationModal';

interface UpdatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onPlayerUpdated?: (player: Player) => void;
  onPlayerDeleted?: () => void;
  onError?: (error: string) => void;
}

export const UpdatePlayerModal: React.FC<UpdatePlayerModalProps> = ({
  isOpen,
  onClose,
  player,
  onPlayerUpdated,
  onPlayerDeleted,
  onError
}): ReactElement => {
  const [formData, setFormData] = useState<UpdatePlayerRequest>({
    name: '',
    age: 18,
    number: undefined,
    nationality: '',
    position: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { loading, error, updatePlayer, resetState } = useUpdatePlayer({
    onSuccess: (updatedPlayer) => {
      onPlayerUpdated?.(updatedPlayer);
      handleClose();
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  const {
    loading: deleting,
    error: deleteError,
    deletePlayer,
    resetState: resetDeleteState
  } = useDeletePlayer({
    onSuccess: () => {
      onPlayerDeleted?.();
      handleClose();
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  // Update form data when player changes
  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        age: player.age,
        number: player.number,
        nationality: player.nationality || '',
        position: player.position || ''
      });
    }
  }, [player]);

  const handleClose = (): void => {
    onClose();
    resetFormData();
    resetState();
    resetDeleteState();
  };

  const resetFormData = (): void => {
    setFormData({
      name: '',
      age: 18,
      number: undefined,
      nationality: '',
      position: ''
    });
  };

  const handleInputChange = (
    field: keyof UpdatePlayerRequest,
    value: string | number
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!player?._id || !formData.name?.trim()) {
      return;
    }

    const playerData: UpdatePlayerRequest = {
      ...(formData.name?.trim() && { name: formData.name.trim() }),
      ...(formData.age && { age: formData.age }),
      ...(formData.number && { number: formData.number }),
      ...(formData.nationality?.trim() && {
        nationality: formData.nationality.trim()
      }),
      ...(formData.position?.trim() && { position: formData.position.trim() })
    };

    await updatePlayer(player._id, playerData);
  };

  const handleDelete = async (): Promise<void> => {
    if (!player?._id) {
      return;
    }

    await deletePlayer(player._id);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setIsDeleteModalOpen(false);
    await handleDelete();
  };

  if (!player) return <></>;

  return (
    <Modal show={isOpen} size='5xl' onClose={handleClose}>
      <ModalHeader>Update Player</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='name'>Player Name *</Label>
            </div>
            <TextInput
              id='name'
              placeholder='Enter player name'
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='age'>Age *</Label>
            </div>
            <TextInput
              id='age'
              type='number'
              min='16'
              max='50'
              placeholder='Enter age'
              value={formData.age || ''}
              onChange={(e) =>
                handleInputChange('age', parseInt(e.target.value) || '')
              }
              required
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='number'>Jersey Number (Optional)</Label>
            </div>
            <TextInput
              id='number'
              type='number'
              min='1'
              max='99'
              placeholder='Enter jersey number'
              value={formData.number || ''}
              onChange={(e) =>
                handleInputChange(
                  'number',
                  parseInt(e.target.value) || undefined
                )
              }
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='position'>Position (Optional)</Label>
            </div>
            <TextInput
              id='position'
              placeholder='Enter position (e.g., Forward, Midfielder)'
              value={formData.position || ''}
              onChange={(e) => handleInputChange('position', e.target.value)}
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='nationality'>Nationality (Optional)</Label>
            </div>
            <TextInput
              id='nationality'
              placeholder='Enter nationality'
              value={formData.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
            />
          </div>

          <div className='flex gap-3'>
            <Button
              type='submit'
              disabled={loading || deleting || !formData.name?.trim()}
              className='flex-1'
            >
              {loading ? 'Updating...' : 'Update Player'}
            </Button>
            <Button
              type='button'
              color='red'
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={loading || deleting}
              className='flex items-center gap-2'
            >
              <HiTrash className='w-4 h-4' />
              Delete
            </Button>
            <Button
              type='button'
              color='gray'
              onClick={handleClose}
              disabled={loading || deleting}
            >
              Cancel
            </Button>
          </div>
        </form>

        <DeletePlayerConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          player={player}
          onConfirmDelete={handleConfirmDelete}
          loading={deleting}
        />
      </ModalBody>
    </Modal>
  );
};
