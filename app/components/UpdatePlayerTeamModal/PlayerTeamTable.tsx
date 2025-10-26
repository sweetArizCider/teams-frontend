import React from 'react';
import {
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
import type { PlayerTeamTableProps } from '../../interfaces/playerTeam';

export const PlayerTeamTable: React.FC<PlayerTeamTableProps> = ({
  players,
  selectedPlayers,
  onPlayerSelection,
  onSelectAllPlayers,
  currentPage,
  onPageChange,
  itemsPerPage
}) => {
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  const isAllCurrentPageSelected = (): boolean => {
    return paginatedPlayers.every((player) => selectedPlayers.has(player._id!));
  };

  const handleSelectAllPlayers = (checked: boolean): void => {
    onSelectAllPlayers(checked);
  };

  return (
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
                  onChange={(e) => handleSelectAllPlayers(e.target.checked)}
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
                      onPlayerSelection(player._id!, e.target.checked)
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
  );
};
