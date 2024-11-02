"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type TocItem = {
  href: string;
  level: number;
  text: string;
};

type Props = {
  data: TocItem[];
};

export default function TocObserver({ data }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveId(visibleEntry.target.id);
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-20px 0px 0px 0px",
      threshold: 0.1,
    });

    const elements = data.map((item) => document.getElementById(item.href.slice(1)));

    elements.forEach((el) => {
      if (el) {
        observer.current?.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => {
        if (el) {
          observer.current?.unobserve(el);
        }
      });
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-2.5 text-sm dark:text-neutral-300/85 text-neutral-800 ml-0.5">
      {data.map(({ href, level, text }) => (
        <Link
          style={{ marginLeft: (level - 1) * 16 }} // Indentation based on heading level
          key={href}
          href={href}
          className={clsx(
            'font-medium hover:text-gray-700 focus:outline-none dark:hover:text-gray-200',
            'focus-visible:text-gray-700 dark:focus-visible:text-gray-200',
            activeId === href.slice(1) ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500",
          )}
        >
          {text.replace(/\*\*/g, '')}
        </Link>
      ))}
    </div>
  );
}
