import type { CollectionEntry } from "astro:content"
import { getCollection } from "astro:content"

export async function getSortedArticles() {
  const articles = await getCollection("articles")
  return articles.sort(
    (a: CollectionEntry<"articles">, b: CollectionEntry<"articles">) =>
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  )
}

export function getFeaturedArticles(articles: CollectionEntry<"articles">[]) {
  return articles
    .filter((article) => article.data.featured)
    .sort(
      (a: CollectionEntry<"articles">, b: CollectionEntry<"articles">) =>
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
    )
}

export function getArticlesByCategory(
  articles: CollectionEntry<"articles">[],
  category: string
) {
  return articles
    .filter((article) => article.data.category === category)
    .sort(
      (a: CollectionEntry<"articles">, b: CollectionEntry<"articles">) =>
        b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
    )
}

export function getArticlesByTag(
  articles: CollectionEntry<"articles">[],
  tag: string
) {
  return articles.filter((article) => article.data.tags?.includes(tag))
}

export function getArticlesBySeries(
  articles: CollectionEntry<"articles">[],
  series: string
) {
  return articles
    .filter((article) => article.data.series === series)
    .sort(
      (a: CollectionEntry<"articles">, b: CollectionEntry<"articles">) =>
        a.data.publishedAt.getTime() - b.data.publishedAt.getTime()
    )
} 