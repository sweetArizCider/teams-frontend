'use client';

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput
} from 'flowbite-react';
import { FormEvent, ReactElement, useState } from 'react';
import type { CreateTeamRequest, Team } from '../../interfaces/server';
import { useCreateTeam } from '../../hooks/teams/useCreateTeam';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated?: (_team: Team) => void;
  onError?: (_error: string) => void;
}

type CreateTeamModalComponent = (_props: CreateTeamModalProps) => ReactElement;

export const CreateTeamModal: CreateTeamModalComponent = (
  props: CreateTeamModalProps
): ReactElement => {
  const { isOpen, onClose, onTeamCreated, onError } = props;
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: '',
    sport: '',
    city: ''
  });

  const { loading, createTeam, resetState } = useCreateTeam({
    onSuccess: (team) => {
      onTeamCreated?.(team);
      handleClose();
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  const handleClose = (): void => {
    onClose();
    resetFormData();
    resetState();
  };

  const resetFormData = (): void => {
    setFormData({
      name: '',
      sport: '',
      city: ''
    });
  };

  const handleInputChange = (
    field: keyof CreateTeamRequest,
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
      !formData.name.trim() ||
      !formData.sport.trim() ||
      !formData.city.trim()
    ) {
      return;
    }

    const teamData: CreateTeamRequest = {
      name: formData.name.trim(),
      sport: formData.sport.trim(),
      city: formData.city.trim()
    };

    await createTeam(teamData);
  };

  return (
    <Modal show={isOpen} size='5xl' onClose={handleClose}>
      <ModalHeader>Add New Team</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='name'>Team Name *</Label>
            </div>
            <TextInput
              id='name'
              placeholder='Enter team name'
              value={formData.name}
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
              value={formData.sport}
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
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>

          <div className='flex gap-3'>
            <Button
              type='submit'
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.sport.trim() ||
                !formData.city.trim()
              }
              className='flex-1'
            >
              {loading ? 'Creating...' : 'Create Team'}
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
  );
};
