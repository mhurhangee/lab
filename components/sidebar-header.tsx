import Link from 'next/link'

import { Logo } from '@/components/ui/logo'
import { SidebarHeader as SidebarHeaderComponent, SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { app } from '@/lib/app'

import { useIsMobile } from '@/hooks/use-mobile'

export const SidebarHeader = () => {
  const isMobile = useIsMobile()

  return (
    <SidebarHeaderComponent>
      <div className="flex flex-row items-center">
        <Link href="/" className="flex items-center gap-2 py-2 text-xl font-bold tracking-tight">
          <Logo iconSize="h-6 w-6" bgSize="h-8 w-8" />
          <span className="group-data-[collapsible=icon]:hidden">{app.title}</span>
        </Link>
        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
            </TooltipTrigger>
            <TooltipContent side="right">Collapse Sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>
      {!isMobile && (
        <div className="flex hidden items-center justify-center group-data-[collapsible=icon]:block group-data-[state=collapsed]:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="" />
            </TooltipTrigger>
            <TooltipContent side="right">Expand Sidebar</TooltipContent>
          </Tooltip>
        </div>
      )}
    </SidebarHeaderComponent>
  )
}
