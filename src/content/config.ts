import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    coverImage: z.string(),
    excerpt: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    readTime: z.number(),
  }),
});

export const collections = {
  articles: articlesCollection,
}; 