"use client";
import * as React from 'react';
import TOCLink from '@/components/links/TOCLink';

export type HeadingScrollSpy = Array<{
  id: string;
  level: number;
  text: string;
}>;

type TableOfContentsProps = {
  toc?: HeadingScrollSpy;
  activeSection: string | null;
  minLevel: number;
  onScrollTo: (id: string) => void; // New prop for handling scroll
};

export default function TableOfContents({
  toc,
  activeSection,
  minLevel,
  onScrollTo, // Destructure the new prop
}: TableOfContentsProps) {
  //#region  //*=========== Scroll into view ===========

  const lastPosition = React.useRef<number>(0);

  React.useEffect(() => {
    const container = document.getElementById('toc-container');
    const activeLink = document.getElementById(`link-${activeSection}`);

    if (container && activeLink) {
      const cTop = container.scrollTop;
      const cBottom = cTop + container.clientHeight;

      const lTop = activeLink.offsetTop - container.offsetTop;
      const lBottom = lTop + activeLink.clientHeight;

      const isTotal = lTop >= cTop && lBottom <= cBottom;

      const isScrollingUp = lastPosition.current > window.scrollY;
      lastPosition.current = window.scrollY;

      if (!isTotal) {
        const offset = 25; // Adjust if necessary
        const top = isScrollingUp
          ? lTop - container.clientHeight + offset
          : lTop - offset;

        container.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [activeSection]);
  //#endregion  //*======== Scroll into view ===========

  return (
    <div
      id='toc-container'
      className='max-h-[calc(100vh-9rem-113px)] overflow-auto pb-4 lg:block'
    >
      <h3 className='text-gray-900 dark:text-gray-100 md:text-xl'>
        Table of Contents
      </h3>
      <div className='mt-4 flex flex-col space-y-2 text-sm'>
        {toc && toc.map(({ id, level, text }) => (
          <TOCLink
            id={id}
            key={id}
            activeSection={activeSection}
            level={level}
            minLevel={minLevel}
            text={text}
            onClick={() => onScrollTo(id)} // Pass the scroll handler
          />
        ))}
      </div>
    </div>
  );
}
