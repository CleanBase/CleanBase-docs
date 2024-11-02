import clsx from 'clsx';
import * as React from 'react';

type AccentType = React.ComponentPropsWithoutRef<'span'>;

export default function Accent({ children, className }: AccentType) {
  return (
    <span
      className={clsx(
        className,
        'transition-colors px-0.5',
        'bg-gradient-to-tr from-[#9780e5] via-[#e666cc] to-[#c58dba] text-white',
        'dark: bg-gradient-to-r from-[#9780e5] via-[#e666cc] to-[#e666cc] dark:bg-clip-text dark:text-transparent'
      )}
    >
     

      {children}
    </span>
  );
}
