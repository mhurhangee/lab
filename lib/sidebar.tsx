import {
  BookOpenIcon,
  Bot,
  FileIcon,
  FileTextIcon,
  Folders,
  Home,
  InfoIcon,
  LayersIcon,
  LayoutGrid,
  LinkIcon,
  LogIn,
  MessageCircleQuestion,
  MicIcon,
  Pen,
  TimerIcon,
  TypeOutlineIcon,
  Volume2Icon,
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
    newButton?: string
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
        newButton: '/projects/new',
      },
    ],
  },
  {
    group: 'AI',
    collapsible: true,
    defaultOpen: true,
    loggedIn: true,
    items: [
      {
        name: 'Chat',
        href: '/chat',
        icon: <Bot className="h-4 w-4" />,
        loggedIn: true,
        newButton: '/chat/new',
      },
      {
        name: 'Text Editor',
        href: '/text-editor',
        icon: <TypeOutlineIcon className="h-4 w-4" />,
        loggedIn: true,
        newButton: '/text-editor/new',
      },
      {
        name: 'Text-to-Speech',
        href: '/text-to-speech',
        icon: <Volume2Icon className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Speech-to-Text',
        href: '/speech-to-text',
        icon: <MicIcon className="h-4 w-4" />,
        loggedIn: true,
      },
    ],
  },
  {
    group: 'Contexts',
    collapsible: true,
    defaultOpen: true,
    loggedIn: true,
    items: [
      {
        name: 'Knowledge Base',
        href: '/knowledge-base',
        icon: <BookOpenIcon className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'Contexts',
        href: '/contexts',
        icon: <LayersIcon className="h-4 w-4" />,
        loggedIn: true,
      },
      {
        name: 'PDFs',
        href: '/pdfs',
        icon: <FileIcon className="h-4 w-4" />,
        loggedIn: true,
        newButton: '/pdfs/new',
      },
      {
        name: 'URLs',
        href: '/urls',
        icon: <LinkIcon className="h-4 w-4" />,
        loggedIn: true,
        newButton: '/urls/new',
      },
      {
        name: 'Parse',
        href: '/parse',
        icon: <FileTextIcon className="h-4 w-4" />,
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
