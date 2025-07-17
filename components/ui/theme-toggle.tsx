'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

import { MoonIcon, SunIcon } from 'lucide-react'

export function useThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const switchTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('light')
        break
      case 'system':
        setTheme(systemTheme === 'light' ? 'dark' : 'light')
        break
      default:
        break
    }
  }

  const toggleTheme = () => {
    if (!document.startViewTransition) switchTheme()
    document.startViewTransition(switchTheme)
  }

  return { theme, toggleTheme }
}

export function ThemeToggle() {
  const { toggleTheme } = useThemeToggle()

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      <SunIcon
        size={12}
        className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <MoonIcon
        size={12}
        className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
