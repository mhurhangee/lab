'use client'

import { useAuth } from '@clerk/nextjs'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarContent as SidebarContentComponent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar'

import { type SidebarItem, sidebarItems } from '@/lib/sidebar'

import { ChevronDown, PlusIcon } from 'lucide-react'

export const SidebarContent = () => {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useAuth()

  // Only render items that match the current authentication state
  const shouldShowGroup = (group: SidebarItem) => {
    if (!isLoaded) return false // Don't show anything until auth is loaded
    if (group.loggedIn === null) return true // Show to everyone
    return group.loggedIn === isSignedIn // Show based on login status
  }

  const shouldShowItem = (item: SidebarItem['items'][number]) => {
    if (!isLoaded) return false
    if (item.loggedIn === undefined || item.loggedIn === null) return true
    return item.loggedIn === isSignedIn
  }

  return (
    <SidebarContentComponent>
      {isLoaded &&
        sidebarItems.filter(shouldShowGroup).map(group => (
          <Collapsible
            key={group.group}
            defaultOpen={group.defaultOpen}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center">
                  {group.group}
                  {group.collapsible && (
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu className="">
                    {group.items.filter(shouldShowItem).map(item => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.name}
                          isActive={pathname.startsWith(item.href)}
                        >
                          <Link href={item.href} className="flex items-center">
                            {item.icon}
                            <span className="ml-2">{item.name}</span>
                          </Link>

                        </SidebarMenuButton>
                        {item.newButton && (
                          <SidebarMenuAction
                            asChild
                          >
                            <Link href={item.newButton} className="flex items-center">
                              <PlusIcon className="h-4 w-4" />
                            </Link>
                          </SidebarMenuAction>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
    </SidebarContentComponent>
  )
}
