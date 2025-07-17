'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { app } from '@/lib/app'
import { navigationItems } from '@/lib/navigation'

import { GithubIcon, Menu, X } from 'lucide-react'
import { ThemeToggle } from './ui/theme-toggle'

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <app.icon className="text-primary h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">{app.title}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navigationItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-primary text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* GitHub Button */}
          <Button variant="ghost" size="icon" className="gap-1">
            <Link href={app.github} className="flex items-center gap-1">
              <GithubIcon className="h-4 w-4" />
            </Link>
          </Button>
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-b md:hidden">
          <div className="mx-auto flex w-full max-w-screen-xl flex-col px-4 py-4 sm:px-6 lg:px-8">
            {navigationItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary py-2 text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
