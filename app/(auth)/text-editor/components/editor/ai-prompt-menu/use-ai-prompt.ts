import { useCallback } from 'react'
import { Editor } from '@tiptap/react'

interface UseAIPromptOptions {
  editor: Editor
}

export const useAIPrompt = ({ editor }: UseAIPromptOptions) => {
  const handleAISubmit = useCallback(async (prompt: string): Promise<string> => {
    // Get selected text or text around cursor
    const { selection } = editor.state
    const { from, to, empty } = selection
    
    let contextText = ''
    if (!empty) {
      // Use selected text
      contextText = editor.state.doc.textBetween(from, to)
    } else {
      // Get surrounding context (e.g., current paragraph or nearby text)
      const $pos = editor.state.doc.resolve(from)
      const start = $pos.start($pos.depth)
      const end = $pos.end($pos.depth)
      contextText = editor.state.doc.textBetween(start, end)
    }

    try {
      // Make API call to your AI service
      const response = await fetch('/api/ai-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: contextText,
          selection: { from, to, empty }
        }),
      })

      if (!response.ok) {
        throw new Error('AI request failed')
      }

      const data = await response.json()
      return data.result || 'AI response not available'
    } catch (error) {
      console.error('AI prompt error:', error)
      throw new Error('Failed to get AI response')
    }
  }, [editor])

  const insertAIResponse = useCallback((response: string) => {
    const { selection } = editor.state
    const { from, to, empty } = selection

    if (empty) {
      // Insert at cursor position
      editor.chain().focus().insertContent(response).run()
    } else {
      // Replace selected text
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent(response)
        .run()
    }
  }, [editor])

  return {
    handleAISubmit,
    insertAIResponse,
  }
}