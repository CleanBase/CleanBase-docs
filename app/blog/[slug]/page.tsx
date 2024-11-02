"server only";
import notFound from "@/app/not-found";
import Seo from "@/components/Seo";
import CustomLink from "@/components/links/CustomLink";
import {
  countWordsInNotionPage,
  fetchPageBlocks,
  fetchPageBySlug,
  queryNotionDatabaseWithRelPosts,
} from "@/lib/notion";
import { format } from "date-fns";
import Image from "next/image";
import React, { Suspense } from "react";
import { HiOutlineClock, HiOutlineEye } from "react-icons/hi";
import readingTime from "reading-time";

interface RichText {
  text: { content: string };
}

interface BlockObjectResponse {
  id: string;
  type: string;
  rich_text?: RichText[];
}

interface HeadingBlock extends BlockObjectResponse {
  type: "heading_1" | "heading_2" | "heading_3";
  rich_text: RichText[];
}

// Lazy load components
const ContentSectionLazy = React.lazy(
  () => import("@/components/content/blog/BlogContentSection")
);
const BlogCardLazy = React.lazy(
  () => import("@/components/content/blog/BlogCard")
);

export default async function Page({ params }: { params: { slug: string } }) {
  const pageSlug = decodeURIComponent(params.slug);
  const page = await fetchPageBySlug(pageSlug);

  if (!page) notFound();

  const pageData = await mapPageData(page);

  const relatedPostsPromise = queryNotionDatabaseWithRelPosts(
    process.env.NOTION_DATABASE_ID as string,
    pageData.tags
  );

  const blocks = await fetchPageBlocks(pageData.id);

  const toc = createTableOfContents(blocks);
  const minLevel = toc.reduce((min, item) => Math.min(min, item.level), 10);
  return (
    <>
      <Seo
        templateTitle={pageData.title}
        description={pageData.description}
        isBlog
        banner={pageData.banner}
        date={new Date(pageData.updateAt ?? pageData.publishedAt).toISOString()}
        pathname={`/blog/${pageData.slug}`}
      />
      <main>
        <section>
          <div className="layout">
            <div className="pb-4 dark:border-gray-600">
              <Image
                className="h-[26rem]"
                alt={`Photo from unsplash: ${pageData.banner}`}
                width={1200}
                height={500}
                src={pageData.banner}
                loading="lazy"
              />
              <h1 className="mt-4">
                {pageData.icon?.img ? (
                  <Image
                    src={pageData.icon.img}
                    className="w-[20px] h-[20px]"
                    width={60}
                    height={60}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <span className="text-center text-3xl">
                    {pageData.icon?.icon}
                  </span>
                )}
                {pageData.title}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center">
                Written on{" "}
                {format(new Date(pageData.publishedAt), "MMMM dd, yyyy")} by{" "}
                <Image
                  src={pageData.author.avatar_url}
                  width={20}
                  height={20}
                  className="rounded-2xl m-1"
                  alt=""
                  loading="lazy"
                />
                {pageData.author.name}
              </p>
              {pageData.updateAt && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <p>
                    Last updated{" "}
                    {format(new Date(pageData.updateAt), "MMMM dd, yyyy")}.
                  </p>
                </div>
              )}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                <HiOutlineClock className="inline-block text-base" />
                <span>{pageData.readingTime.text}</span>
                <HiOutlineEye className="inline-block text-base" />
                <span>{pageData.views?.toLocaleString() ?? "–––"} views</span>
              </div>
            </div>

            <Suspense fallback={<p>Loading content...</p>}>
              <ContentSectionLazy
                pageId={pageData.id}
                currenLike={1}
                blocks={blocks}
                slug={pageData.slug}
                toc={toc}
                minLevel={minLevel}
              />
            </Suspense>

            {/* Related Posts */}
            <Suspense fallback={<p>Loading related posts...</p>}>
              <RelatedPosts relatedPostsPromise={relatedPostsPromise} />
            </Suspense>

            <div className="mt-8 flex gap-4 md:flex-row-reverse md:justify-between">
              <CustomLink href={"GITHUB_EDIT_LINK"}>
                Edit this on GitHub
              </CustomLink>
              <CustomLink href="/blog">← Back to blog</CustomLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

async function RelatedPosts({ relatedPostsPromise }: any) {
  const relatedPosts = await relatedPostsPromise;

  return (
    <div className="mt-20">
      <h2>Other posts that you might like</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {relatedPosts.map((post: any) => (
          <Suspense key={post.slug} fallback={<p>Loading post...</p>}>
            <BlogCardLazy post={post} />
          </Suspense>
        ))}
      </ul>
    </div>
  );
}

// Optimized data mapping function
async function mapPageData(page: any) {
  const wordCount = await countWordsInNotionPage(page.id);
  const readingTimeResult = readingTime(wordCount);

  return {
    id: page.id,
    title: page.properties["Content Title"]?.title[0]?.text?.content ?? "",
    publishedAt: new Date(page.created_time),
    updateAt: new Date(page.last_edited_time),
    author: {
      name: page.properties.Author?.people[0]?.name ?? "",
      avatar_url: page.properties.Author?.people[0]?.avatar_url ?? "",
    },
    icon: {
      img: page.icon?.file?.url ?? "",
      icon: page.icon?.emoji ?? "",
    },
    views: page.properties.Views?.number ?? 0,
    description: page.properties.Description?.rich_text[0]?.plain_text ?? "",
    banner: page.cover?.external?.url ?? page.cover?.file?.url ?? "",
    tags:
      page.properties["Blog Category"]?.multi_select
        .map((tag: any) => tag.name)
        .join(",") ?? "",
    slug: page.properties["Content Title"]?.title[0]?.text?.content ?? "",
    readingTime: readingTimeResult,
  };
}

function createTableOfContents(blocks: any[]) {
  return blocks
    .filter((block): block is HeadingBlock =>
      ["heading_1", "heading_2", "heading_3"].includes(block.type)
    )
    .map((block: any) => {
      const level =
        block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3;
      const text = block[block.type]?.rich_text[0].plain_text;
      const id = text ? text.toLowerCase().split(" ").join("-") : "";
      return { id, level, text };
    });
}
