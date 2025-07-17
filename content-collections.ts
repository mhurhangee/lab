import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'

import rehypeHighlight from 'rehype-highlight'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*.mdx',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    category: z.string(),
    next: z.string().optional(),
    prev: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [rehypeHighlight],
    })
    return {
      ...document,
      mdx,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
