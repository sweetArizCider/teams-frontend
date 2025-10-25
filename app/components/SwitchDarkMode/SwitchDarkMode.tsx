import { ReactElement } from 'react';
import Image from 'next/image';
import { DarkThemeToggle } from 'flowbite-react';

export type SwitchDarkModeComponent = () => ReactElement;

export const SwitchDarkMode: SwitchDarkModeComponent = (): ReactElement => {
  return (
    <>
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
    </>
  );
};
