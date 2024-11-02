"use client";
import React, { useEffect, useState, useRef } from "react";
import { Render, withContentValidation } from "@9gustin/react-notion-render";
import TableOfContents from "@/components/content/TableOfContents";
import LikeButton from "@/components/content/LikeButton";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Load additional PrismJS language components
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-css');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-csharp');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-tsx');

interface ContentSectionProps {
  blocks: any;
  toc: {
    id: string;
    level: number;
    text: string;
  }[];
  minLevel: number;
  slug: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  blocks,
  toc,
  minLevel,
  slug,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headingRefs = useRef<{ [key: string]: HTMLElement | null }>({});


  
  useEffect(() => {
    Prism.highlightAll();
  }, [blocks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -50% 0px", threshold: 0.4 }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        headingRefs.current[id] = element;
      }
    });

    return () => {
      Object.values(headingRefs.current).forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [toc]);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 66; // Adjust this offset to fit your header height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        element.focus();
      });
    }
  };

  return (
    <section className="lg:grid lg:grid-cols-[auto,250px] lg:gap-8">
      <article className="mdx prose mx-auto mt-4 w-full transition-colors dark:prose-invert">
        {/* Render blocks safely, wrapped in a div */}
        <div className="content">
          <Render
              blockComponentsMapper={{
                code: withContentValidation(({ language, children }) => (
                  <pre className={`language-${language}`}>
                    <code
                      style={{
                        display: 'block',
                        padding: '20px',
                      }}
                      className={`language-${language}`}
                    >
                      {children}
                    </code>
                  </pre>
                )),
              }}
            blocks={blocks}
            simpleTitles
            classNames
            useStyles
            emptyBlocks
          />
        </div>
      </article>

      <aside className="py-4">
        <div className="sticky top-36">
          <TableOfContents
            toc={toc}
            minLevel={minLevel}
            activeSection={activeSection}
            onScrollTo={handleScrollTo}
          />
          <div className="flex items-center justify-center py-8">
            <LikeButton slug={slug} />
          </div>
        </div>
      </aside>
    </section>
  );
};

export default ContentSection;
