import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { CodeIcon, LayersIcon, LightbulbIcon } from 'lucide-react'

export const FeaturedProjects = () => {
  return (
    <section id="projects" className="w-full py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold">Featured Projects</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Explore my latest AI experiments and creative projects
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Project 1 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="bg-muted/20 relative aspect-video w-full">
              <div className="text-muted absolute inset-0 flex items-center justify-center">
                <LayersIcon className="h-10 w-10" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/projects/image-generation">AI Image Generation</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                Exploring diffusion models and their creative applications in generating art and
                visual content.
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  Stable Diffusion
                </span>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  DALL-E
                </span>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="bg-muted/20 relative aspect-video w-full">
              <div className="text-muted absolute inset-0 flex items-center justify-center">
                <CodeIcon className="h-10 w-10" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/projects/code-assistant">AI Code Assistant</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                Building a specialized code assistant using fine-tuned language models and retrieval
                techniques.
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  LLM
                </span>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  RAG
                </span>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-background group overflow-hidden rounded-xl border">
            <div className="bg-muted/20 relative aspect-video w-full">
              <div className="text-muted absolute inset-0 flex items-center justify-center">
                <LightbulbIcon className="h-10 w-10" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="group-hover:text-primary mb-2 text-xl font-bold transition-colors">
                <Link href="/projects/semantic-search">Semantic Search Engine</Link>
              </h3>
              <p className="text-muted-foreground mb-4">
                Creating a vector-based search engine that understands the meaning behind queries.
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  Embeddings
                </span>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                  Vector DB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
