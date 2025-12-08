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