import type { Editor as TiptapEditor } from '@tiptap/react'

/**
 * Fetches AI suggestion and displays it as ghost text in the editor
 */
export async function fetchSuggestion(editor: TiptapEditor): Promise<void> {
  const fullText = editor.getText()
  const selectionEnd = editor.state.selection.to

  if (!fullText.trim()) {
    console.warn('No text content to generate suggestion from')
    return
  }

  // Show loading spinner
  editor.chain().focus().setGhostText('', selectionEnd, true).run()

  try {
    const response = await fetch('/api/inline-ai-suggestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullText, selectionEnd }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { aiContent } = await response.json()

    if (aiContent && typeof aiContent === 'string') {
      // Show the suggestion
      editor.chain().focus().setGhostText(aiContent.trim(), selectionEnd, false).run()
    } else {
      throw new Error('Invalid AI response format')
    }
  } catch (error) {
    console.error('Failed to fetch AI suggestion:', error)
    editor.chain().focus().clearGhostText().run()
  }
}
