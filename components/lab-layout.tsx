'use client'

import React, { ReactNode } from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

interface LabPageProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  className?: string
}

export function LabLayout({
  title,
  description,
  icon,
  actions,
  children,
  fullWidth = false,
  className = '',
}: LabPageProps) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Top Header with Sidebar Toggle and Breadcrumbs */}
      <div className="bg-background/50 border-muted-foreground/20 sticky top-0 z-50 flex items-center justify-between border-b px-4 pt-1 pb-2 shadow-sm backdrop-blur-xs transition-all">
        <div className="flex items-center justify-center gap-3 overflow-hidden">
          {icon && icon}
          {title && title}
          {description && !isMobile && (
            <div className="text-muted-foreground text-xs">{description}</div>
          )}
        </div>
        {actions}
        {isMobile && <SidebarTrigger />}
      </div>
      <div
        className={cn(
          'container mx-auto h-full items-center justify-center sm:px-6',
          fullWidth ? 'max-w-screen-xl' : 'max-w-5xl',
          className
        )}
      >
        {/* Main content */}
        <div className="w-full">{children}</div>
      </div>
    </>
  )
}
