import { UserButton } from '@clerk/nextjs'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { SidebarFooter as SidebarFooterComponent } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

import { app } from '@/lib/app'

import { GithubIcon, MailIcon } from 'lucide-react'

export const SidebarFooter = () => {
  return (
    <SidebarFooterComponent>
      <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:flex-col">
        <Button variant="ghost" size="icon">
          <Link href={`mailto:${app.email}`}>
            <MailIcon className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Link href={app.github}>
            <GithubIcon className="h-4 w-4" />
          </Link>
        </Button>
        <ThemeToggle />
        <UserButton />
      </div>
    </SidebarFooterComponent>
  )
}
