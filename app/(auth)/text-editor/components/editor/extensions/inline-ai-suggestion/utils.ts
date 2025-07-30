import type { Editor as TiptapEditor } from '@tiptap/react'


export async function fetchSuggestion(editor: TiptapEditor) {
  const fullText = editor.getText() ?? ''
  const selectionEnd = editor.state.selection.to
  
  // Show loading spinner
  editor.chain().focus().setGhostText('', selectionEnd ?? 0, true).run()

  try {
    const res = await fetch('/api/inline-ai-suggestion', {
      method: 'POST',
      body: JSON.stringify({ fullText, selectionEnd }),
      headers: { 'Content-Type': 'application/json' },
    })
    const suggestion = await res.json()

    // Show the suggestion
    editor.chain().focus().setGhostText(suggestion.aiContent, selectionEnd ?? 0, false).run()
  } catch (error) {
    console.error('Failed to fetch AI suggestion:', error)
    editor.chain().focus().clearGhostText().run()
  }
}