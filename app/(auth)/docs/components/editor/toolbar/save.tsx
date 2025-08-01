'use client'

import { Editor as TiptapEditor } from '@tiptap/react'

import { SaveIcon } from 'lucide-react'

import { updateContextAction } from '@/app/actions/contexts/update'

import { Button } from '@/components/ui/button'

import { handleErrorClient } from '@/lib/error/client'
import { tiptapToMarkdown } from '@/lib/tiptap-to-formats'

import { useProject } from '@/providers/project'

import { toast } from 'sonner'

interface SaveProps {
  editor: TiptapEditor
  id: string
}

export function Save({ editor, id }: SaveProps) {
  const { selectedProject } = useProject()

  const handleSave = async () => {
    const json = editor.getJSON()
    const markdown = tiptapToMarkdown(editor)

    // Stringify the JSON to preserve complex nested objects with attrs
    const jsonString = JSON.stringify(json)

    const { error } = await updateContextAction({
      id,
      textDocument: jsonString,
      projectId: selectedProject?.id || '',
      markdown,
    })
    if (error) {
      handleErrorClient('Error saving document', error)
    } else {
      toast.success('Document saved')
    }
  }

  return (
    <Button onClick={handleSave} size="icon" variant="ghost">
      <SaveIcon className="h-4 w-4" />
    </Button>
  )
}
