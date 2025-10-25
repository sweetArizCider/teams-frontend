'use client';
import { DarkThemeToggle } from 'flowbite-react';
import Image from 'next/image';
import { usePlayer } from './hooks/players/usePlayer';
import { PlayersList } from './components/PlayerCard';
import { ToastContainer } from './components/ToastContainer';
import type { Player } from './interfaces/server';

export default function Home() {
  const { players, loading, error, getPlayers, toasts, removeToast } = usePlayer();

  const handlePlayerClick = (player: Player) => {
    // Handle player card click - you can add navigation or modal logic here
    console.log('Player clicked:', player);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900'>
      <div className='absolute inset-0 size-full'>
        <div className='relative h-full w-full select-none'>
          <Image
            className='absolute right-0 min-w-dvh dark:hidden'
            alt='Pattern Light'
            src='/pattern-light.svg'
            width='803'
            height='774'
          />
          <Image
            className='absolute right-0 hidden min-w-dvh dark:block'
            alt='Pattern Dark'
            src='/pattern-dark.svg'
            width='803'
            height='775'
          />
        </div>
      </div>
      <div className='absolute top-4 right-4'>
        <DarkThemeToggle />
      </div>

      <div className='relative flex w-full max-w-5xl flex-col items-center justify-center gap-12'>
        <div className='relative flex flex-col items-center gap-6'>
          <h1 className='relative text-center text-4xl leading-[125%] font-bold text-gray-900 dark:text-gray-200'>
            Players Dashboard
          </h1>
          <span className='inline-flex flex-wrap items-center justify-center gap-2.5 text-center'>
            <span className='inline text-xl text-gray-600 dark:text-gray-400'>
              Manage your team players with
            </span>
            <span className='relative inline-flex items-center gap-2'>
              <Image
                className='size-6'
                alt='Flowbite React logo'
                src='/flowbite-react.svg'
                width={24}
                height={24}
              />
              <span className='relative w-fit text-xl font-semibold whitespace-nowrap text-[#111928] dark:text-white'>
                Flowbite React
              </span>
            </span>
            <h2 className='inline text-xl text-gray-600 dark:text-gray-400'>
              dashboard.
            </h2>
          </span>
        </div>

        <div className='relative flex w-full flex-col items-start gap-6 self-stretch'>
          <PlayersList
            players={players}
            loading={loading}
            error={error}
            onRetry={getPlayers}
            onPlayerClick={handlePlayerClick}
          />
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </main>
  );
}
