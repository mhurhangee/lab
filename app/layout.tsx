import { Analytics } from '@vercel/analytics/next'

import type { ReactNode } from 'react'

import { Metadata } from 'next'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { app } from '@/lib/app'
import { mono, sans, serif } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

import { ThemeProvider } from '@/providers/theme'

export const metadata: Metadata = {
  title: process.env.NODE_ENV === 'development' ? ` (dev) ${app.title}` : app.title,
  description: app.description,
  icons: {
    icon: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${app.emoji}</text></svg>`,
      },
    ],
    shortcut: [
      {
        url: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${app.emoji}</text></svg>`,
      },
    ],
  },
}

type RootLayoutProps = {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={cn(
        sans.variable,
        serif.variable,
        mono.variable,
        'bg-background text-foreground antialiased'
      )}
    >
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster className="z-[99999999]" />
      </ThemeProvider>
      <Analytics />
    </body>
  </html>
)

export default RootLayout
