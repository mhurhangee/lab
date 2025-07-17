import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ArrowRight } from 'lucide-react'

export const BlogSection = () => {
  return (
    <section id="blog" className="w-full py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Latest Articles</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Thoughts, insights, and deep dives into AI technology
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/blog">View all articles</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Blog Post 1 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="p-6">
              <div className="text-muted-foreground mb-2 text-xs">July 15, 2025</div>
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/blog/future-of-ai">The Future of AI in Creative Industries</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                How artificial intelligence is transforming design, music, and other creative
                fields.
              </p>
              <Link
                href="/blog/future-of-ai"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Read article <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="p-6">
              <div className="text-muted-foreground mb-2 text-xs">July 10, 2025</div>
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/blog/llm-fine-tuning">Fine-tuning LLMs: A Practical Guide</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                Step-by-step instructions for fine-tuning large language models for specific tasks.
              </p>
              <Link
                href="/blog/llm-fine-tuning"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Read article <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="p-6">
              <div className="text-muted-foreground mb-2 text-xs">July 5, 2025</div>
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/blog/ai-ethics">Ethical Considerations in AI Development</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                Exploring the ethical challenges and responsibilities in building AI systems.
              </p>
              <Link
                href="/blog/ai-ethics"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Read article <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
