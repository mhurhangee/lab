import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { app } from '@/lib/app'

import { BookIcon, BotIcon } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="min-h-screen w-full py-20 md:py-32">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm">
          <Link href={app.badge.link}>
            <span className="text-primary font-medium">{app.badge.text}</span>
          </Link>
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">{app.title}</h1>
        <p className="text-muted-foreground mb-10 max-w-[600px] text-xl">{app.description}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button className="gap-2" asChild>
            <Link href="/experiments">
            <BotIcon className="h-4 w-4" />Play 
            </Link>
          </Button>
          <Button variant="secondary" className="gap-2" asChild>
            <Link href="/posts">
            <BookIcon className="h-4 w-4" />Read 
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
