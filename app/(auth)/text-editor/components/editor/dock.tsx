'use client'

import type { Editor as TiptapEditor } from '@tiptap/react'

import { CalendarIcon, ListIcon, MapPinIcon, StickyNoteIcon, UsersIcon } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Dock = ({ editor }: { editor: TiptapEditor }) => {
  return (
    <Tabs defaultValue="outline" className="w-full">
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
        <TabsTrigger value="notes">
          <StickyNoteIcon />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outline">outline</TabsContent>
      <TabsContent value="characters">characters</TabsContent>
      <TabsContent value="locations">locations</TabsContent>
      <TabsContent value="events">events</TabsContent>
      <TabsContent value="notes">notes</TabsContent>
    </Tabs>
  )
}
