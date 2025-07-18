import { SignedIn, SignedOut } from '@clerk/nextjs'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { app } from '@/lib/app'

import { LayoutGridIcon, LogInIcon, TimerIcon } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="min-h-screen w-full py-20 md:py-32">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm">
          <Link href={app.badge.link}>
            <span className="text-primary font-medium">{app.badge.text}</span>
          </Link>
        </div>
        <h1 className="mb-8 text-6xl font-extrabold tracking-tight md:text-8xl">{app.title}</h1>
        <p className="text-muted-foreground mb-8 max-w-[600px] text-xl">{app.description}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <SignedOut>
            <Button className="gap-2" asChild>
              <Link href="/sign-in">
                <LogInIcon className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button variant="secondary" className="gap-2" asChild>
              <Link href="/waitlist">
                <TimerIcon className="h-4 w-4" />
                Waitlist
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button variant="default" className="gap-2" asChild>
              <Link href="/dashboard">
                <LayoutGridIcon className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </section>
  )
}
