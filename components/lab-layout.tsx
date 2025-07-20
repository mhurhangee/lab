'use client'

import React, { ReactNode } from 'react'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { LayoutGridIcon } from 'lucide-react'

import { BackToButton } from '@/components/ui/back-to-button'

interface LabPageProps {
  title?: ReactNode
  description?: ReactNode
  icon?: IconName
  breadcrumb?: { href: string; label: string }[]
  actions?: ReactNode
  children?: ReactNode
  backToHref?: string
  backToLabel?: string
  className?: string
}

export function LabLayout({
  title,
  description,
  icon,
  breadcrumb,
  actions,
  children,
  backToHref,
  backToLabel,
  className = '',
}: LabPageProps) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Top Header with Sidebar Toggle and Breadcrumbs */}
      <div className="bg-background/50 border-muted-foreground/20 rounded-t-lg sticky top-0 z-50 flex items-center justify-between border-b px-4 pt-1 pb-2 shadow-sm backdrop-blur-xs transition-all">
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          {isMobile && <SidebarTrigger />}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/"><LayoutGridIcon className="h-4 w-4" /></BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumb?.map((item, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {backToHref && <BackToButton href={backToHref} label={`${backToLabel}`} />}
      </div>
      <div
        className={cn(
          'mx-auto w-full h-full items-center justify-center sm:px-6',
          className
        )}
      >
        {/* Main content */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            {title && (
              <h1 className="my-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl flex items-center gap-3">
                {icon && <DynamicIcon name={icon} className="h-12 w-12" />}
                {title}
              </h1>
            )}
            {description && <div className="text-muted-foreground text-lg sm:text-base md:text-lg lg:text-xl">{description}</div>}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </>
  )
}
