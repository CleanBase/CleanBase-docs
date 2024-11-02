"use client"
import countBy from 'lodash/countBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toPairs from 'lodash/toPairs';

export function sortDateFn(contentA: any, contentB: any) {
  return (
    new Date(contentB.lastUpdated ?? contentB.publishedAt).valueOf() -
    new Date(contentA.lastUpdated ?? contentA.publishedAt).valueOf()
  );
}

export function sortByDate(contents: Array<any>) {
  return contents.sort(sortDateFn);
}

export function sortTitleFn(contentA: any, contentB: any) {
  return contentA.title.localeCompare(contentB.title);
}

export function sortByTitle(contents: Array<any>): Array<any> {
  return contents.sort((a, b) =>
    a.title > b.title ? 1 : b.title > a.title ? -1 : 0
  );
}

/**
 * Get tags of each post and remove duplicates
 */
export function getTags(contents: Array<any>) {
  const tags = contents.reduce(
    (accTags: string[], content) => [...accTags, ...content.tags.split(',')],
    []
  );

  return map(sortBy(toPairs(countBy(tags)), 1), 0).reverse();
}
