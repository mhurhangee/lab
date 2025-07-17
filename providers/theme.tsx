'use client'

import type { ComponentProps } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export const ThemeProvider = (props: ComponentProps<typeof NextThemesProvider>) => (
  <NextThemesProvider {...props} />
)
