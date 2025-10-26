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
import type { CreatePlayerRequest, Player } from '../../interfaces/server';
import { useCreatePlayer } from '../../hooks/players/useCreatePlayer';

interface CreatePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerCreated?: (_player: Player) => void;
  onError?: (_error: string) => void;
}

type HandleCloseFunction = () => void;
type ResetFormDataFunction = HandleCloseFunction;

export const CreatePlayerModal = (
  props: CreatePlayerModalProps
): ReactElement => {
  const { isOpen, onClose, onPlayerCreated, onError } = props;
  const [formData, setFormData] = useState<CreatePlayerRequest>({
    name: '',
    age: 18,
    number: undefined,
    nationality: '',
    position: ''
  });

  const { loading, createPlayer, resetState } = useCreatePlayer({
    onSuccess: (player: Player): void => {
      onPlayerCreated?.(player);
      handleClose();
    },
    onError: (errorMessage: string): void => {
      onError?.(errorMessage);
    }
  });

  const handleClose: HandleCloseFunction = (): void => {
    onClose();
    resetFormData();
    resetState();
  };

  const resetFormData: ResetFormDataFunction = (): void => {
    setFormData({
      name: '',
      age: 18,
      number: undefined,
      nationality: '',
      position: ''
    });
  };

  const handleInputChange = (
    field: keyof CreatePlayerRequest,
    value: string | number | undefined
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    const playerData: CreatePlayerRequest = {
      name: formData.name.trim(),
      age: formData.age,
      ...(formData.number && { number: formData.number }),
      ...(formData.nationality?.trim() && {
        nationality: formData.nationality.trim()
      }),
      ...(formData.position?.trim() && { position: formData.position.trim() })
    };

    await createPlayer(playerData);
  };

  return (
    <Modal show={isOpen} size='5xl' onClose={handleClose}>
      <ModalHeader>Add New Player</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='name'>Player Name *</Label>
            </div>
            <TextInput
              id='name'
              placeholder='Enter player name'
              value={formData.name}
              onChange={(e): void => handleInputChange('name', e.target.value)}
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
              value={formData.age}
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
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleInputChange('number', isNaN(value) ? undefined : value);
              }}
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
              onChange={(e): void =>
                handleInputChange('position', e.target.value)
              }
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
              onChange={(e): void =>
                handleInputChange('nationality', e.target.value)
              }
            />
          </div>

          <div className='flex gap-3'>
            <Button
              type='submit'
              disabled={loading || !formData.name.trim()}
              className='flex-1'
            >
              {loading ? 'Creating...' : 'Create Player'}
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
