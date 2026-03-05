import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    coverCredit: z.string().optional(),
    coverCreditUrl: z.string().url().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

const canadaNews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    source: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, pages, canadaNews };
