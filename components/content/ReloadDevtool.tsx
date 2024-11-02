import { usePathname, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { HiRefresh } from 'react-icons/hi';

import ButtonLink from '@/components/links/ButtonLink';
import { isProd } from '@/constants/env';

export default function ReloadDevtool() {
  const pathname = usePathname(); // Get the current pathname
  const searchParams = useSearchParams(); // Get the current search parameters

  // Construct the full URL with pathname and search parameters
  const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  // Return null when in production
  if (isProd) {
    return null;
  }

  return (
    <ButtonLink href={fullUrl} className='fixed bottom-4 left-4' aria-label="Reload page">
      <HiRefresh />
    </ButtonLink>
  );
}
