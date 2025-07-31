import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

// Create AI Prompt Slash Extension that just triggers the existing AI menu
export const AIPromptSlash = Extension.create({
  name: 'aiPromptSlash',

  addProseMirrorPlugins() {
    const onTriggerAIPrompt = this.options.onTriggerAIPrompt

    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        command: ({ editor, range }) => {
          // Remove the slash and trigger AI menu immediately
          editor.chain().focus().deleteRange(range).run()
          
          if (onTriggerAIPrompt) {
            // Get current cursor position 
            const { view } = editor
            const { from } = view.state.selection
            const coords = view.coordsAtPos(from)
            onTriggerAIPrompt({ x: coords.left, y: coords.bottom })
          }
        },
        items: () => {
          // Always return one item to trigger the command immediately
          return [{ title: 'AI Prompt' }]
        },
        render: () => {
          // No UI needed - we trigger immediately
          return {
            onStart: (props) => {
              // Immediately trigger the command when slash is typed
              setTimeout(() => {
                props.command({ title: 'AI Prompt' })
              }, 0)
            },
            onUpdate: () => {},
            onKeyDown: () => false,
            onExit: () => {},
          }
        },
      }),
    ]
  },
})

// Helper function to create the AI prompt slash suggestion
export const createAIPromptSlashSuggestion = (onTriggerAIPrompt: (position: { x: number; y: number }) => void) => {
  return AIPromptSlash.configure({
    onTriggerAIPrompt
  })
}