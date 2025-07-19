import {
  Folders,
  Home,
  InfoIcon,
  LayoutGrid,
  LogIn,
  MessageCircleQuestion,
  Pen,
  TimerIcon,
  FileIcon,
} from 'lucide-react'

export interface SidebarItem {
  group: string
  collapsible: boolean
  defaultOpen: boolean
  loggedIn: boolean | null
  items: {
    name: string
    href: string
    icon: React.ReactNode
    loggedIn: boolean | null
  }[]
}

export const sidebarItems: SidebarItem[] = [
  {
    group: 'Lab',
    collapsible: false,
    defaultOpen: true,
    loggedIn: null,
    items: [
      {
        name: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'Sign In',
        href: '/sign-in',
        icon: <LogIn className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'Waitlist',
        href: '/waitlist',
        icon: <TimerIcon className="h-4 w-4" />,
        loggedIn: false,
      },
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutGrid className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Projects',
        href: '/projects',
        icon: <Folders className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Files',
        href: '/files',
        icon: <FileIcon className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Misc',
    collapsible: true,
    defaultOpen: true,
    loggedIn: null,
    items: [
      {
        name: 'Posts',
        href: '/posts',
        icon: <Pen className="h-4 w-4" />,
        loggedIn: null,
      },
      {
        name: 'FAQ',
        href: '/faq',
        icon: <MessageCircleQuestion className="h-4 w-4" />,
        loggedIn: null,
      },
      {
        name: 'About',
        href: '/about',
        icon: <InfoIcon className="h-4 w-4" />,
        loggedIn: null,
      },
    ],
  },
]
