import * as React from 'react';

import { PreloadProvider } from '@/context/PreloadContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreloadProvider>
        <div id='skip-nav'>{children}</div>
      </PreloadProvider>
    </>
  );
}
