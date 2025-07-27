import { TestTubeDiagonalIcon } from 'lucide-react'

export const app = {
  title: 'Superfier',
  description: 'A laboratory and portfolio of AI experiments, learning, and insights.',
  github: 'https://github.com/mhurhangee/lab',
  icon: TestTubeDiagonalIcon,
  emoji: '🧪',
  email: 'm.hurhangee@me.com',
  badge: {
    link: '/dashboard',
    text: 'AI experiments and projects',
  },
  iconBackground: 'bg-gradient-to-r from-green-500 to-emerald-500',
}

export const appTitle =
  process.env.NODE_ENV === 'development' ? `(dev) ${app.title}` : `${app.title}`
