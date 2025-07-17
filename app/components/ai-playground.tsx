import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { CodeIcon, SparklesIcon } from 'lucide-react'

export const AIPlayground = () => {
  return (
    <section id="playground" className="w-full py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold">AI Playground</h2>
          <p className="text-muted-foreground mx-auto max-w-[600px]">
            Try out various AI models and tools in an interactive environment
          </p>
        </div>

        <div className="bg-background rounded-xl border p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-bold">Interactive AI Demos</h3>
              <p className="text-muted-foreground mb-6">
                Experiment with different AI models and see them in action. No setup required - just
                play and learn.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <SparklesIcon className="text-primary h-4 w-4" />
                  </div>
                  <span>Text Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <SparklesIcon className="text-primary h-4 w-4" />
                  </div>
                  <span>Image Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                    <SparklesIcon className="text-primary h-4 w-4" />
                  </div>
                  <span>Code Completion</span>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/playground">Open Playground</Link>
                </Button>
              </div>
            </div>
            <div className="bg-muted/20 flex min-h-[300px] items-center justify-center rounded-xl">
              <div className="text-muted text-center">
                <CodeIcon className="mx-auto mb-4 h-16 w-16" />
                <p>Interactive Demo Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
