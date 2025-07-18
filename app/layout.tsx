import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'

import type { ReactNode } from 'react'

import { Metadata } from 'next'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import { Layout } from '@/components/layout'

import { app } from '@/lib/app'
import { mono, sans, serif } from '@/lib/fonts'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

import { ProjectProvider } from '@/providers/project'
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
  <ClerkProvider
    appearance={{
      variables: {
        colorPrimary: 'var(--primary)',
        colorPrimaryForeground: 'var(--primary-foreground)',
        colorNeutral: 'var(--primary)',
        colorBackground: 'var(--card)',
        colorForeground: 'var(--card-foreground)',
        colorInput: 'var(--input)',
        colorInputForeground: 'var(--primary-foreground)',
        colorMuted: 'var(--muted)',
        colorMutedForeground: 'var(--muted-foreground)',
        colorBorder: 'var(--border)',
        colorRing: 'var(--ring)',
        borderRadius: 'var(--radius-md, 0.375rem)',
        fontFamily: 'var(--font-sans, inherit)',
      },
    }}
  >
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          sans.variable,
          serif.variable,
          mono.variable,
          'bg-background text-foreground font-sans antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <TooltipProvider>
            <ProjectProvider>
              <Layout>{children}</Layout>
            </ProjectProvider>
          </TooltipProvider>
          <Toaster className="z-[99999999]" />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  </ClerkProvider>
)

export default RootLayout
