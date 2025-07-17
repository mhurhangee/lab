import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { ArrowRightIcon, BookOpenIcon } from 'lucide-react'

export const About = () => {
  return (
    <section id="about" className="w-full py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="bg-background rounded-xl border p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">About Superfier</h2>
              <p className="text-muted-foreground mb-6">
                Superfier is my personal AI playground and showcase of experiments, projects, and
                insights into artificial intelligence technology.
              </p>
              <p className="text-muted-foreground mb-6">
                As an AI researcher and developer, I&apos;m passionate about exploring the
                capabilities of machine learning models and creating tools that demonstrate their
                potential.
              </p>
              <p className="text-muted-foreground">
                This site serves as both a portfolio of my work and a resource for others interested
                in AI development.
              </p>
              <div className="mt-8 flex gap-4">
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/about">
                    Learn more <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/contact">Contact me</Link>
                </Button>
              </div>
            </div>
            <div className="bg-muted/20 flex min-h-[300px] items-center justify-center rounded-xl">
              <div className="text-muted text-center">
                <BookOpenIcon className="mx-auto mb-4 h-16 w-16" />
                <p>About Image Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
