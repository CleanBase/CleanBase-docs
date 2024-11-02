import {
  countWordsInNotionPage,
  fetchPageBlocks,
  fetchPageBySlug,
  queryNotionDatabase
} from "@/lib/notion";


import Accent from "@/components/Accent";
import BlogCard from "@/components/content/blog/BlogCard";
import ContentSection from "@/components/content/blog/BlogContentSection";
import CustomLink from "@/components/links/CustomLink";
import Seo from "@/components/Seo";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HiOutlineClock, HiOutlineEye } from "react-icons/hi";
import readingTime from "reading-time";
import React from "react";

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

export default async function Page({ params }: { params: { slug: string } }) {
  const pageSlug = decodeURIComponent(params.slug);
  const page = await fetchPageBySlug(pageSlug);

  if (!page) notFound();

  const pageData = await mapPageData(page);
  const postsRelate = await queryNotionDatabase(
    process.env.NOTION_DATABASE_ID as string
  );
  const randomPosts = getRandomPosts(postsRelate, 3);

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
        canonical={"null"}
        tags={pageData.tags}
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
              />
              <h1 className="mt-4">
                {pageData.icon?.img ? (
                  <Image
                    src={pageData.icon.img}
                    className="w-[20px] h-[20px]"
                    width={60}
                    height={60}
                    alt=""
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
              <div className="mt-6 flex items-center justify-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <HiOutlineClock className="inline-block text-base" />
                  <Accent>{pageData.readingTime.text}</Accent>
                </div>
                <div className="flex items-center gap-1">
                  <HiOutlineEye className="inline-block text-base" />
                  <Accent>
                    {pageData.views?.toLocaleString() ?? "–––"} views
                  </Accent>
                </div>
              </div>
            </div>

            <hr className="dark:border-gray-600" />

            <ContentSection
              blocks={blocks}
              toc={toc}
              minLevel={minLevel}
              slug={pageData.slug}
            />

            {randomPosts.length > 0 && (
              <div className="mt-20">
                <h2>
                  <Accent>Other posts that you might like</Accent>
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {randomPosts.map((post) => (
                    <BlogCard
                      key={post.slug}
                      post={post}
                      checkTagged={undefined}
                    />
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-col items-start gap-4 md:flex-row-reverse md:justify-between">
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

async function mapPageData(page: any) {
  const id = page?.id || "";
  const title =
    page.properties?.["Content Title"]?.title[0]?.text?.content || "";
  const publishedAt = page.created_time
    ? new Date(page.created_time)
    : new Date(0);
  const updateAt = page.last_edited_time
    ? new Date(page.last_edited_time)
    : new Date(0);

  const author = {
    name: String(page.properties?.Author?.people[0]?.name || ""),
    avatar_url: String(page.properties?.Author?.people[0]?.avatar_url || ""),
    email: String(page.properties?.Author?.people[0]?.person?.email || ""),
  };

  const icon =
    page?.icon && (page.icon.file?.url || page.icon.emoji)
      ? {
          img: String(page.icon.file?.url || ""),
          icon: String(page.icon.emoji || ""),
        }
      : null;

  const views = page.properties?.Views?.number || 0;
  const description = String(
    page.properties?.Description?.rich_text[0]?.plain_text || ""
  );
  const banner = String(
    page.cover?.external?.url || page.cover?.file?.url || ""
  );
  const tags =
    page.properties?.["Blog Category"]?.multi_select
      ?.map((tag: any) => tag.name)
      .join(",") || "";
  const slug = title;

  const wordCount = await countWordsInNotionPage(id);
  const readingTimeResult = readingTime(wordCount);

  return {
    id,
    title,
    publishedAt,
    updateAt,
    author,
    icon,
    views,
    description,
    banner,
    tags,
    slug,
    readingTime: readingTimeResult,
  };
}

function getRandomPosts(posts: any[], count: number) {
  return posts.sort(() => 0.5 - Math.random()).slice(0, count);
}

function createTableOfContents(blocks: any[]) {
  return blocks
    .filter((block): block is HeadingBlock =>
      ["heading_1", "heading_2", "heading_3"].includes(block.type)
    )
    .map((block:any) => {
      const level =
        block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3;
      const text = block[block.type]?.rich_text[0].plain_text;
      const id = text ? text.toLowerCase().split(" ").join("-") : "";
      return { id, level, text };
    });
}
