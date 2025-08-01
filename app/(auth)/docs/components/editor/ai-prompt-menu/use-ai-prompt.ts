import { Editor } from '@tiptap/react'

import { useCallback } from 'react'

interface UseAIPromptOptions {
  editor: Editor
}

export const useAIPrompt = ({ editor }: UseAIPromptOptions) => {
  const handleAISubmit = useCallback(
    async (prompt: string): Promise<string> => {
      // Use preserved selection if available, otherwise current selection
      const selection = editor.state.selection
      const { from, to, empty } = selection

      let contextText = ''
      if (!empty) {
        contextText = editor.state.doc.textBetween(from, to)
      } else {
        // Get surrounding context (e.g., current paragraph or nearby text)
        // TODO: Get more context, handle headings, summaries, etc.
        const $pos = editor.state.doc.resolve(from)

        function getNodeText(idx: number) {
          if (idx >= 0 && idx < parent.childCount) {
            return parent.child(idx).textContent || ''
          }
          return ''
        }

        const parent = $pos.node($pos.depth)
        const index = $pos.index($pos.depth)
        const contextTexts = [
          getNodeText(index - 2),
          getNodeText(index - 1),
          getNodeText(index),
          getNodeText(index + 1),
          getNodeText(index + 2),
        ]

        contextText = contextTexts.join(' ')
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
            selection: { from, to, empty },
          }),
        })

        if (!response.ok) {
          throw new Error('AI request failed')
        }

        const data = await response.json()
        return data || 'AI response not available'
      } catch (error) {
        console.error('AI prompt error:', error)
        throw new Error('Failed to get AI response')
      }
    },
    [editor]
  )

  const insertAIResponse = useCallback(
    (response: string) => {
      // Use preserved selection if available, otherwise current selection
      const selection = editor.state.selection
      const { from, to, empty } = selection

      if (empty) {
        // Insert at cursor position
        editor.chain().focus().insertContent(response).run()
      } else {
        // Replace selected text
        editor.chain().focus().deleteRange({ from, to }).insertContent(response).run()
      }
    },
    [editor]
  )

  return {
    handleAISubmit,
    insertAIResponse,
  }
}
