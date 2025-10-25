import React, { ReactElement } from 'react';

interface TeamIconProps {
  className?: string;
}

type TeamIconComponent = React.FC<TeamIconProps>;

export const TeamIcon: TeamIconComponent = (
  props: TeamIconProps
): ReactElement => {
  const { className = 'h-9 w-9 text-gray-500' }: TeamIconProps = props;

  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      viewBox='0 0 24 24'
    >
      <path
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.5'
        d='M13 7h6l2 4-2 4h-6M3 7h6l2 4-2 4H3l2-4-2-4Z'
      />
    </svg>
  );
};
