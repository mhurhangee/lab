import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { app } from '@/lib/app'

import { GithubIcon } from 'lucide-react'

export const Header = () => {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <app.icon className="text-primary h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">{app.title}</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#projects"
            className="text-muted-foreground hover:text-primary text-sm font-medium"
          >
            Projects
          </Link>
          <Link
            href="#playground"
            className="text-muted-foreground hover:text-primary text-sm font-medium"
          >
            Playground
          </Link>
          <Link
            href="#blog"
            className="text-muted-foreground hover:text-primary text-sm font-medium"
          >
            Blog
          </Link>
          <Link
            href="#about"
            className="text-muted-foreground hover:text-primary text-sm font-medium"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="gap-1">
            <Link href={app.github} className="flex items-center gap-1">
              <GithubIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
