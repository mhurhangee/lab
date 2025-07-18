import Link from 'next/link'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageContainer } from '@/components/page-container'

import { formatDate } from '@/lib/date'

import { allPosts } from 'content'
import { ArrowRight } from 'lucide-react'

export default function PostsPage() {
  return (
    <PageContainer>
      <Header />
      <div className="mx-auto w-full max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-2 font-mono text-4xl font-bold">Posts</h1>
          <p className="text-muted-foreground text-lg">
            Thoughts, insights, and deep dives into AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {allPosts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(post => (
              <div
                key={post._meta.path}
                className="bg-background group overflow-hidden rounded-xl border"
              >
                <div className="p-6">
                  <div className="text-muted-foreground mb-2 text-xs">{formatDate(post.date)}</div>
                  <h3 className="group-hover:text-primary mb-2 text-2xl font-extrabold transition-colors">
                    <Link href={`/posts/${post._meta.path}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-4">{post.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-muted inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {post.category}
                    </span>
                    <Link
                      href={`/posts/${post._meta.path}`}
                      className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      Read article <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </PageContainer>
  )
}
