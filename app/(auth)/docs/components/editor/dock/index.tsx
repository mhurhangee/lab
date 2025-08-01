'use client'

import type { TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import type { Editor as TiptapEditor } from '@tiptap/react'

import { BotIcon, CalendarIcon, ListIcon, MapPinIcon, UsersIcon } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ChatTab } from './chat-tab'
import { MentionsNav } from './mentions-nav'
import { Outline } from './outline'

interface DockProps {
  editor: TiptapEditor
  tocItems: TableOfContentDataItem[]
}

export const Dock = ({ editor, tocItems }: DockProps) => {
  return (
    <Tabs defaultValue="outline" className="h-full w-full">
      <TabsList className="bg-background w-full">
        <TabsTrigger value="outline">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger value="characters">
          <UsersIcon />
        </TabsTrigger>
        <TabsTrigger value="locations">
          <MapPinIcon />
        </TabsTrigger>
        <TabsTrigger value="events">
          <CalendarIcon />
        </TabsTrigger>
        <TabsTrigger value="chat">
          <BotIcon />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outline">
        <Outline tocItems={tocItems} />
      </TabsContent>
      <TabsContent value="characters">
        <MentionsNav editor={editor} type="character" />
      </TabsContent>
      <TabsContent value="locations">
        <MentionsNav editor={editor} type="location" />
      </TabsContent>
      <TabsContent value="events">
        <MentionsNav editor={editor} type="event" />
      </TabsContent>
      <TabsContent value="chat">
        <ChatTab />
      </TabsContent>
    </Tabs>
  )
}
