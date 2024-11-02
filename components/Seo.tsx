"only server"
import Head from 'next/head';
import { openGraph } from '@/lib/helper.client';

const defaultMeta = {
  title: 'Cleanbase hoangvh238',
  siteName: 'cleanbase.com',
  description:
    'Most projects struggle with establishing a source code base that meets criteria such as conciseness, scalability, testability, and maintainability, often not knowing where to start. These challenges usually stem from developers lacking sufficient experience or resources to create high-quality code. That is why Cleanbase was created to overcome these obstacles and provide a comprehensive solution.',
  url: 'https://cleanbase.com',
  image: '',
  type: 'website',
  robots: 'follow, index',
};

type SeoProps = {
  date?: string;
  templateTitle?: string;
  isBlog?: boolean;
  banner?: string;
  canonical?: string;
  tags?: string;
  pathname: string; // Add pathname as a prop
} & Partial<typeof defaultMeta>;

export default function Seo({
  date,
  templateTitle,
  isBlog,
  banner,
  canonical,
  tags,
  pathname,
}: SeoProps) {
  const meta = {
    ...defaultMeta,
    date,
    templateTitle,
    isBlog,
    banner,
    canonical,
    tags,
  };

  meta.title = templateTitle
    ? `${templateTitle} | ${meta.siteName}`
    : meta.title;

  meta.image = openGraph({
    description: meta.description,
    siteName: templateTitle ? meta.siteName : meta.title,
    templateTitle,
    banner,
    isBlog,
    tags,
  });

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name='robots' content={meta.robots} />
      <meta content={meta.description} name='description' />
      <meta property='og:url' content={`${meta.url}${pathname}`} />
      <link
        rel='canonical'
        href={canonical ? canonical : `${meta.url}${pathname}`}
      />
      {/* Open Graph */}
      <meta property='og:type' content={meta.type} />
      <meta property='og:site_name' content={meta.siteName} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:title' content={meta.title} />
      <meta name='image' property='og:image' content={meta.image} />
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@th_clarence' />
      <meta name='twitter:title' content={meta.title} />
      <meta name='twitter:description' content={meta.description} />
      <meta name='twitter:image' content={meta.image} />
      {date && (
        <>
          <meta property='article:published_time' content={date} />
          <meta name='publish_date' property='og:publish_date' content={date} />
          <meta name='author' property='article:author' content='Theodorus Clarence' />
        </>
      )}
      {isBlog && (
        <script
          key='structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: meta.title,
              description: meta.description,
              author: [
                {
                  '@type': 'Person',
                  name: 'Theodorus Clarence',
                },
              ],
              image: meta.image,
              datePublished: date,
            }),
          }}
        />
      )}
      {/* Favicons */}
      {favicons.map((linkProps) => (
        <link key={linkProps.href} {...linkProps} />
      ))}
      <meta name='msapplication-TileColor' content='#ffffff' />
      <meta name='msapplication-TileImage' content='/favicon/ms-icon-144x144.png' />
      <meta name='theme-color' content='#ffffff' />
    </Head>
  );
}

type Favicons = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
};

// List of favicons
const favicons: Array<Favicons> = [
  {
    rel: 'apple-touch-icon',
    sizes: '57x57',
    href: '/favicon/apple-icon-57x57.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '60x60',
    href: '/favicon/apple-icon-60x60.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '72x72',
    href: '/favicon/apple-icon-72x72.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '76x76',
    href: '/favicon/apple-icon-76x76.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: '/favicon/apple-icon-114x114.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/favicon/apple-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: '/favicon/apple-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/favicon/apple-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicon/apple-icon-180x180.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/favicon/android-icon-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: '/favicon/favicon-96x96.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon/favicon-16x16.png',
  },
  {
    rel: 'manifest',
    href: '/favicon/manifest.json',
  },
];
