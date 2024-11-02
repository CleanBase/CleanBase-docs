"use client";

import BlogCard from "@/components/content/blog/BlogCard";
import ContentPlaceholder from "@/components/content/ContentPlaceholder";
import Tag, { SkipNavTag } from "@/components/content/Tag";
import StyledInput from "@/components/form/StyledInput";
import SortListbox, { SortOption } from "@/components/SortListbox";
import { getTags, sortDateFn } from "@/lib/mdx.client";
import { BlogFrontmatter } from "@/types/frontmatters";
import { useEffect, useState } from "react";
import { HiCalendar, HiEye } from "react-icons/hi";
import Accent from "./Accent";

const sortOptions: Array<SortOption> = [
  {
    id: "date",
    name: "Sort by date",
    icon: HiCalendar,
  },
  {
    id: "views",
    name: "Sort by views",
    icon: HiEye,
  },
];

const BlogFilter = ({
  posts,
  onToggleLanguage,
  isEnglish,
}: {
  posts: any;
  onToggleLanguage?: () => void;
  isEnglish?: boolean;
}) => {
  const [search, setSearch] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOption>(sortOptions[0]);
  const [filteredPosts, setFilteredPosts] = useState<BlogFrontmatter[]>(posts);

  const tags = getTags(posts);

  useEffect(() => {
    const results = posts.filter((post: any) => {
      const searchLower = search.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(searchLower);
      const descriptionMatch = post.description
        .toLowerCase()
        .includes(searchLower);
      const tagsMatch = searchLower
        .split(" ")
        .every((tag) => post.tags.includes(tag));
      return titleMatch || descriptionMatch || tagsMatch;
    });

    if (sortOrder.id === "date") {
      results.sort(sortDateFn);
      sessionStorage.setItem("blog-sort", "0");
    } else if (sortOrder.id === "views") {
      results.sort((a: any, b: any) => (b?.views ?? 0) - (a?.views ?? 0));
      sessionStorage.setItem("blog-sort", "1");
    }

    setFilteredPosts(results);
  }, [search, sortOrder, posts]);

  const toggleTag = (tag: string) => {
    const currentTags = search.split(" ").filter(Boolean); // Remove empty strings
    if (currentTags.includes(tag)) {
      // Remove tag from search
      setSearch(currentTags.filter((t) => t !== tag).join(" "));
    } else {
      // Add tag to search
      setSearch(currentTags.length ? `${search.trim()} ${tag}` : tag);
    }
  };

  /** Currently available tags based on filtered posts */
  const filteredTags = getTags(filteredPosts);

  /** Show accent if not disabled and selected */
  const checkTagged = (tag: string) => {
    return (
      filteredTags.includes(tag) &&
      search.toLowerCase().split(" ").includes(tag)
    );
  };

  return (
    <>
      <StyledInput
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        type="text"
      />
      <div className="mt-2 flex flex-wrap items-baseline justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Choose topic:</span>
        <SkipNavTag>
          {tags.map((tag: string) => (
            <Tag
              key={tag}
              onClick={() => toggleTag(tag)}
              disabled={!filteredTags.includes(tag)} // Disable irrelevant tags
            >
              {checkTagged(tag) ? <Accent>{tag}</Accent> : tag}
            </Tag>
          ))}
        </SkipNavTag>
      </div>
      <div className="flex items-center justify-between">
        <div />
        <SortListbox
          selected={sortOrder}
          setSelected={setSortOrder}
          options={sortOptions}
        />
      </div>
      <ul className="grid gap-4 mt-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} checkTagged={checkTagged} />
          ))
        ) : (
          <ContentPlaceholder />
        )}
      </ul>
    </>
  );
};

export default BlogFilter;
