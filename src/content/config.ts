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
    featured: z.boolean().default(false)
  }),
});

const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    updatedAt: z.date().optional(),
    publishedAt: z.date().optional(),
  }),
});

export const collections = {
  articles: articlesCollection,
  legal: legalCollection,
}; 