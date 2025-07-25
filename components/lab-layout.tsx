'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'

import React, { ReactNode } from 'react'

import { BackToButton } from '@/components/ui/back-to-button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { HomeIcon, LayoutGridIcon } from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

interface LabPageProps {
  title?: ReactNode
  description?: ReactNode
  icon?: IconName
  breadcrumb?: { href: string; label: ReactNode | string }[]
  actions?: ReactNode
  children?: ReactNode
  backTo?: { href: string; label: ReactNode | string }
  className?: string
}

export function LabLayout({
  title,
  description,
  icon,
  breadcrumb,
  actions,
  children,
  backTo,
  className = '',
}: LabPageProps) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Top Header with Sidebar Toggle and Breadcrumbs */}
      <div className="bg-background/50 border-muted-foreground/20 sticky top-0 z-50 flex items-center justify-between rounded-t-lg border-b px-4 pt-1 pb-1 backdrop-blur-xs transition-all">
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          {isMobile && <SidebarTrigger />}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <SignedIn>
                  <BreadcrumbLink href="/dashboard">
                    <LayoutGridIcon className="h-4 w-4" />
                  </BreadcrumbLink>
                </SignedIn>
                <SignedOut>
                  <BreadcrumbLink href="/">
                    <HomeIcon className="h-4 w-4" />
                  </BreadcrumbLink>
                </SignedOut>
              </BreadcrumbItem>

              {breadcrumb?.map((item, index) => {
                if (index === breadcrumb.length - 1) {
                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem key={index}>
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </React.Fragment>
                  )
                }
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {backTo && <BackToButton href={backTo.href} label={`${backTo.label}`} />}
      </div>
      <div
        className={cn(
          'shadcn-scrollbar mx-auto h-[calc(100vh-4rem)] w-full items-center justify-center overflow-y-auto sm:px-6',
          className
        )}
      >
        {/* Main content */}
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h1 className="my-4 flex items-center gap-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl">
                {icon && <DynamicIcon name={icon} className="h-12 w-12" />}
                {title}
              </h1>
            )}
            {description && (
              <div className="text-muted-foreground text-lg sm:text-base md:text-lg lg:text-xl">
                {description}
              </div>
            )}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </>
  )
}
