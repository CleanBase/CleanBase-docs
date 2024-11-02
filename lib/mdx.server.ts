"use server";
import { promises as fs, readFileSync } from 'fs';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import { join } from 'path';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { sortByDate } from '@/lib/mdx.client';
import { ContentType, Frontmatter, PickFrontmatter } from '@/types/frontmatters';

export async function getFileSlugArray(type: ContentType) {
  const paths = await getFileList(join(process.cwd(), 'src', 'contents', type));
  return paths.map((path) =>
    path.replace(join(process.cwd(), 'components', 'contents', type) + '/', '')
        .replace('.mdx', '')
        .split('/')
  );
}

export async function getFileBySlug(type: ContentType, slug: string) {
  const filePath = slug
    ? join(process.cwd(), 'components', 'contents', type, `${slug}.mdx`)
    : join(process.cwd(), 'components', 'contents', `${type}.mdx`);
  const source = readFileSync(filePath, 'utf8');

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [...(options?.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        () =>
          rehypePrettyCode({
            theme: 'github-dark',  // Using a compatible theme
          }),
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: ['hash-anchor'] },
          },
        ],
      ];

      return options;
    },
  });

  return {
    code,
    frontmatter: {
      wordCount: source.split(/\s+/gu).length,
      readingTime: readingTime(source),
      slug: slug || null,
      ...frontmatter,
    },
  };
}

const getFileList = async (dirName: string): Promise<string[]> => {
  let files: string[] = [];
  const items = await fs.readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};

export async function getAllFilesFrontmatter<T extends ContentType>(type: T) {
  const files = await getFileList(join(process.cwd(), 'components', 'contents', type));

  return files.reduce<Array<PickFrontmatter<T>>>((allPosts, absolutePath) => {
    const source = readFileSync(absolutePath, 'utf8');
    const { data } = matter(source);

    const res = [
      {
        ...(data as PickFrontmatter<T>),
        slug: absolutePath
          .replace(join(process.cwd(), 'src', 'contents', type) + '/', '')
          .replace('.mdx', ''),
        readingTime: readingTime(source),
      },
      ...allPosts,
    ];
    return res;
  }, []);
}

export async function getRecommendations(currSlug: string) {
  const frontmatters = await getAllFilesFrontmatter('blog');

  const currentFm = frontmatters.find((fm) => fm.slug === currSlug);

  const otherFms = frontmatters
    .filter((fm) => !fm.slug.startsWith('id-') && fm.slug !== currSlug)
    .sort(() => Math.random() - 0.5);

  const _recommendations = otherFms.filter((op) =>
    op.tags.split(',').some((p) => currentFm?.tags.split(',').includes(p))
  );
  const recommendations = sortByDate(_recommendations);

  const threeRecommendations =
    recommendations.length >= 3
      ? recommendations
      : [
          ...recommendations,
          ...otherFms.filter(
            (fm) => !recommendations.some((r) => r.slug === fm.slug)
          ),
        ];

  return threeRecommendations.slice(0, 3);
}

/**
 * Get and order frontmatters by specified array
 */
export async function getFeatured<T extends Frontmatter>(
  contents: Array<T>,
  features: string[]
) {
  return features.map(
    (feat) => contents.find((content) => content.slug === feat) as T
  );
}
