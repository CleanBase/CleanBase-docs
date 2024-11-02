import clsx from 'clsx';
import * as React from 'react';

import TOCUnstyledLink from '@/components/links/TOCUnstyledLink'; // Đảm bảo import đúng

type TOCLinkProps = {
  id: string;
  level: number;
  minLevel: number;
  text: string;
  activeSection: string | null;
  onClick?: () => void; // Add onClick prop
};

export default function TOCLink({
  id,
  level,
  minLevel,
  text,
  activeSection,
  onClick,
}: TOCLinkProps) {
  return (
    <TOCUnstyledLink
      className={clsx(
        'font-medium hover:text-gray-700 focus:outline-none dark:hover:text-gray-200',
        'focus-visible:text-gray-700 dark:focus-visible:text-gray-200',
        activeSection === id
          ? 'text-gray-900 dark:text-gray-100'
          : 'text-gray-400 dark:text-gray-500'
      )}
      onClick={onClick} 
      level={level} minLevel={minLevel}
       >
      {text}
    </TOCUnstyledLink>
  );
}
