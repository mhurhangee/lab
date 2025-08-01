import { Editor as TiptapEditor } from '@tiptap/react'

import { CopyIcon, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { tiptapToHtml, tiptapToMarkdown } from '@/lib/tiptap-to-formats'

import { toast } from 'sonner'

export function ExportDialog({ editor }: { editor: TiptapEditor }) {
  const markdown = tiptapToMarkdown(editor)
  const html = tiptapToHtml(editor)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Download />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export document</DialogTitle>
          <DialogDescription>Copy and paste as markdown or HTML.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="markdown">
          <TabsList>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="markdown">
            <div className="relative">
              <Button
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(markdown || '')
                  toast.success('Copied markdown to clipboard')
                }}
              >
                <CopyIcon />
              </Button>
              <pre className="text-muted-foreground mt-2 max-h-[400px] w-full overflow-auto overflow-y-auto rounded-md bg-transparent px-3 py-2 text-sm whitespace-pre-wrap">
                {markdown || ''}
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="html">
            <div className="relative">
              <Button
                className="absolute top-2 right-2"
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(html || '')
                  toast.success('Copied HTML to clipboard')
                }}
              >
                <CopyIcon />
              </Button>
              <pre className="text-muted-foreground mt-2 max-h-[400px] w-full overflow-auto overflow-y-auto rounded-md bg-transparent px-3 py-2 text-sm whitespace-pre-wrap">
                {html || ''}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
