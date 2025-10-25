'use client';

import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { ReactElement } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import type { Team } from '../../interfaces/server';

interface DeleteTeamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onConfirmDelete: () => void;
  loading?: boolean;
}

// eslint-disable-next-line no-undef
export const DeleteTeamConfirmationModal: React.FC<
  DeleteTeamConfirmationModalProps
> = ({
  isOpen,
  onClose,
  team,
  onConfirmDelete,
  loading = false
}): ReactElement => {
  return (
    <Modal show={isOpen} size='md' onClose={onClose} popup>
      <ModalHeader />
      <ModalBody>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
            Are you sure you want to delete team "{team?.name}"?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button color='red' onClick={onConfirmDelete} disabled={loading}>
              {loading ? 'Deleting...' : "Yes, I'm sure"}
            </Button>
            <Button color='alternative' onClick={onClose} disabled={loading}>
              No, cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
