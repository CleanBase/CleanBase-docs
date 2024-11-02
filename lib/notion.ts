import "server-only";

import { Client } from "@notionhq/client";
import React from "react";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import readingTime from "reading-time";
import { join } from "path";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const fetchPages = React.cache(() => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
  });
});

export const fetchPageBySlug = React.cache((slug: string) => {
  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Content Title",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((res) => res.results[0] as PageObjectResponse | undefined);
});

export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({ block_id: pageId })
    .then((res) => res.results as BlockObjectResponse[]);
});


export const queryNotionDatabase = React.cache(async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      status: {
        equals: "Published"
      }
    }
  });

  // Sử dụng Promise.all để xử lý các async trong map
  return Promise.all(response.results.map(async (page: any) => {
    const title: string = page.properties?.["Content Title"]?.title[0]?.text?.content || '';
    const publishedAt: Date = page?.created_time ? new Date(page.created_time) : new Date(0);
    const updateAt: Date = page?.last_edited_time ? new Date(page.last_edited_time) : new Date(0);

    const author = {
      name: String(page.properties?.Author?.people[0]?.name || ''),
      avatar_url: String(page.properties?.Author?.people[0]?.avatar_url || ''),
      email: String(page.properties?.Author?.people[0]?.person?.email || '')
    };

    const icon = {
      img: String(page?.icon?.file?.url || ''),
      icon: String(page?.icon?.emoji || '')
    };
    

    const views: number = page.properties?.Views.number || 0;
    const description: string = String(page.properties?.Description?.rich_text[0]?.plain_text || '');
    const banner: string = String(page?.cover?.external?.url || page?.cover?.file?.url || '');
    const tags: string = page.properties?.["Blog Category"]?.multi_select.map((tag: any) => tag.name).join(",") || '';
    const slug: string = String(page.properties?.["Content Title"]?.title[0]?.text?.content || '');
    const readingTimeResult = readingTime(await countWordsInNotionPage(page?.id));

    // console.log('====================================');
    // console.log('Title:', title);
    // console.log('Published At:', publishedAt);
    // console.log('Updated At:', updateAt);
    // console.log('Author:', author);
    // console.log('Icon:', icon);
    // console.log('Views:', views);
    // console.log('Description:', description);
    // console.log('Banner:', banner);
    // console.log('Tags:', tags);
    // console.log('Slug:', slug);
    // console.log('Reading Time Result:', readingTimeResult);
    // console.log('====================================');

    return {
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
  }));
});

export const queryNotionDatabaseWithRelPosts = React.cache(async (databaseId: string, tagsInput: string) => {
  const tagsArray: string[] = tagsInput.split(',').map(tag => tag.trim().toLowerCase());

  const posts = await queryNotionDatabase(databaseId);

  const relevantPosts = posts.filter(post => 
    Array.isArray(post.tags) && post.tags.some(tag => tagsArray.includes(tag.toLowerCase()))
  );

  const topPosts = relevantPosts
    .map(post => ({
      ...post,
      matchingTagsCount: Array.isArray(post.tags) ? post.tags.filter(tag => tagsArray.includes(tag.toLowerCase())).length : 0, // Check if tags is an array before filtering
    }))
    .sort((a, b) => b.matchingTagsCount - a.matchingTagsCount)
    .slice(0, 3); 

  return topPosts;
});


  export const countWordsInNotionPage = React.cache(async (pageId: string) => {
  let blocks:any = [];
  let cursor;
  
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    blocks = blocks.concat(response.results);
    cursor = response.next_cursor;
  } while (cursor);

  const content = blocks
    .map((block : any) => {
      if (block[block.type] && block[block.type]?.rich_text?.length > 0) {
        return block[block.type]?.rich_text
          .map((text : any) => text.plain_text)
          .join(' ');
      }
      return '';
    })
    .join(' ');
   

  return content;
}
);