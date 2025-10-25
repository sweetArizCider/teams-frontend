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
import type { UpdateTeamRequest, Team } from '../../interfaces/server';
import { useUpdateTeam } from '../../hooks/teams/useUpdateTeam';
import { useDeleteTeam } from '../../hooks/teams/useDeleteTeam';
import { DeleteTeamConfirmationModal } from '../DeleteTeamConfirmationModal';

interface UpdateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onTeamUpdated?: (_team: Team) => void;
  onTeamDeleted?: () => void;
  onError?: (_error: string) => void;
}

export const UpdateTeamModal: React.FC<UpdateTeamModalProps> = ({
  isOpen,
  onClose,
  team,
  onTeamUpdated,
  onTeamDeleted,
  onError
}): ReactElement => {
  const [formData, setFormData] = useState<UpdateTeamRequest>({
    name: '',
    sport: '',
    city: ''
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { loading, error, updateTeam, resetState } = useUpdateTeam({
    onSuccess: (updatedTeam) => {
      onTeamUpdated?.(updatedTeam);
      handleClose();
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  const {
    loading: deleting,
    error: deleteError,
    deleteTeam,
    resetState: resetDeleteState
  } = useDeleteTeam({
    onSuccess: () => {
      onTeamDeleted?.();
      handleClose();
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  // Update form data when team changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        sport: team.sport,
        city: team.city
      });
    }
  }, [team]);

  const handleClose = (): void => {
    onClose();
    resetFormData();
    resetState();
    resetDeleteState();
  };

  const resetFormData = (): void => {
    setFormData({
      name: '',
      sport: '',
      city: ''
    });
  };

  const handleInputChange = (
    field: keyof UpdateTeamRequest,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (
      !team?._id ||
      !formData.name?.trim() ||
      !formData.sport?.trim() ||
      !formData.city?.trim()
    ) {
      return;
    }

    const teamData: UpdateTeamRequest = {
      ...(formData.name?.trim() && { name: formData.name.trim() }),
      ...(formData.sport?.trim() && { sport: formData.sport.trim() }),
      ...(formData.city?.trim() && { city: formData.city.trim() })
    };

    await updateTeam(team._id, teamData);
  };

  const handleDelete = async (): Promise<void> => {
    if (!team?._id) {
      return;
    }

    await deleteTeam(team._id);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setIsDeleteModalOpen(false);
    await handleDelete();
  };

  if (!team) return <></>;

  return (
    <Modal show={isOpen} size='5xl' onClose={handleClose}>
      <ModalHeader>Update Team</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='name'>Team Name *</Label>
            </div>
            <TextInput
              id='name'
              placeholder='Enter team name'
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='sport'>Sport *</Label>
            </div>
            <TextInput
              id='sport'
              placeholder='Enter sport (e.g., Football, Basketball)'
              value={formData.sport || ''}
              onChange={(e) => handleInputChange('sport', e.target.value)}
              required
            />
          </div>

          <div>
            <div className='mb-2 block'>
              <Label htmlFor='city'>City *</Label>
            </div>
            <TextInput
              id='city'
              placeholder='Enter city'
              value={formData.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>

          <div className='flex gap-3'>
            <Button
              type='submit'
              disabled={
                loading ||
                deleting ||
                !formData.name?.trim() ||
                !formData.sport?.trim() ||
                !formData.city?.trim()
              }
              className='flex-1'
            >
              {loading ? 'Updating...' : 'Update Team'}
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

        <DeleteTeamConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          team={team}
          onConfirmDelete={handleConfirmDelete}
          loading={deleting}
        />
      </ModalBody>
    </Modal>
  );
};
