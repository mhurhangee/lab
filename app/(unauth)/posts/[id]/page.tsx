import { MDXContent } from '@content-collections/mdx/react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LabLayout } from '@/components/lab-layout'

import { formatDate } from '@/lib/date'

import { allPosts } from 'content'
import { ArrowLeft } from 'lucide-react'

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const id = (await params).id
  const post = allPosts.find(post => post._meta.path === id)

  if (!post) {
    return notFound()
  }

  return (
    <LabLayout
      icon="pen-box"
      backToHref="/posts"
      backToLabel="All posts"
      breadcrumb={[
        { href: '/posts', label: 'Posts' },
        { href: `/posts/${post._meta.path}`, label: post.title },
      ]}
    >
      <div className="my-12">
        <div className="mb-4 flex items-center gap-4">
          <span className="bg-muted inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            {post.category}
          </span>
          <span className="text-muted-foreground text-sm">{formatDate(post.date)}</span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold md:text-8xl">{post.title}</h1>
        <p className="text-muted-foreground mb-8 text-xl">{post.summary}</p>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-[60ch]">
        <MDXContent code={post.mdx || ''} />
      </article>

      <div className="my-16 flex items-center justify-between border-t pt-8">
        {post.prev ? (
          <Link
            href={`/posts/${post.prev}`}
            className="hover:text-primary flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Previous post
          </Link>
        ) : (
          <div className="w-24" />
        )}

        <Link href="/posts" className="hover:text-primary text-sm font-medium">
          All posts
        </Link>

        {post.next ? (
          <Link
            href={`/posts/${post.next}`}
            className="hover:text-primary flex items-center gap-1 text-sm font-medium"
          >
            Next post <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        ) : (
          <div className="w-24" />
        )}
      </div>
    </LabLayout>
  )
}
