'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

type ChatTitleContextType = {
  title: string
  setTitle: (title: string) => void
}

const ChatTitleContext = createContext<ChatTitleContextType | undefined>(undefined)

export const useChatTitle = () => {
  const context = useContext(ChatTitleContext)

  if (!context) {
    throw new Error('useChatTitle must be used within a ChatTitleProvider')
  }

  return context
}

export const ChatTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>('Untitled chat')

  return (
    <ChatTitleContext.Provider value={{ title, setTitle }}>{children}</ChatTitleContext.Provider>
  )
}
