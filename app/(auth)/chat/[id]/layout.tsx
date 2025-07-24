import { ChatTitleProvider } from '@/providers/chat-title'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatTitleProvider>{children}</ChatTitleProvider>
}
