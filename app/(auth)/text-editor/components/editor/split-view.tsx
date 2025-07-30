import { TableOfContentDataItem } from '@tiptap/extension-table-of-contents'
import { Editor as TiptapEditor } from '@tiptap/react'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

import { Dock } from './dock'
import { Editor } from './editor'

interface SplitViewProps {
  editor: TiptapEditor
  id: string
  tocItems: TableOfContentDataItem[]
}

export const SplitView = ({ editor, id, tocItems }: SplitViewProps) => {
  return (
    <main className="mx-auto h-full w-full font-sans">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={60} minSize={30}>
          <Editor editor={editor} id={id} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <Dock editor={editor} tocItems={tocItems} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}
