import Link from 'next/link'

import { app } from '@/lib/app'

export const Footer = () => {
  return (
    <footer className="w-full border-t py-8">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
        <div className="flex items-center gap-2">
          <app.icon className="text-primary h-5 w-5" />
          <span className="font-medium">{app.title}</span>
        </div>
        <p className="text-muted-foreground font-mono text-sm">made to learn and inspire</p>
        <div className="flex items-center gap-4">
          <Link
            href={`mailto:${app.email}`}
            className="text-muted-foreground hover:text-primary text-sm"
          >
            Contact
          </Link>
          <Link href={app.github} className="text-muted-foreground hover:text-primary text-sm">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
