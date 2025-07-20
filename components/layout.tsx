'use client'

import React from 'react'

import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { SidebarContent } from './sidebar-content'
import { SidebarFooter } from './sidebar-footer'
import { SidebarHeader } from './sidebar-header'

interface LabLayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LabLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant='inset'>
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
