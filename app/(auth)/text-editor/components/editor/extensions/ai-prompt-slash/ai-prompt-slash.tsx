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
        command: ({ editor, range, props }) => {
          // Remove the slash and trigger AI menu
          editor.chain().focus().deleteRange(range).run()
          
          if (onTriggerAIPrompt) {
            // Get current cursor position 
            const { view } = editor
            const { from } = view.state.selection
            const coords = view.coordsAtPos(from)
            onTriggerAIPrompt({ x: coords.left, y: coords.bottom })
          }
        },
        items: ({ query }) => {
          // Only show AI command when query starts with "ai" or is empty
          if (query && !query.toLowerCase().startsWith('ai')) {
            return []
          }
          
          return [{ 
            title: 'AI Prompt',
            description: 'Open AI menu to generate or edit text',
            icon: '🤖' 
          }]
        },
        render: () => {
          // Simple render - just show the AI option
          let popup: HTMLElement | null = null
          let commandFn: any = null

          return {
            onStart: (props) => {
              if (!props.items.length) return
              
              commandFn = props.command

              popup = document.createElement('div')
              popup.className = 'fixed z-50 rounded-md border bg-popover p-2 shadow-md'
              popup.innerHTML = `
                <div class="flex items-center gap-2 cursor-pointer hover:bg-accent rounded p-2">
                  <span class="text-lg">🤖</span>
                  <div>
                    <div class="font-medium">AI Prompt</div>
                    <div class="text-xs text-muted-foreground">Open AI menu</div>
                  </div>
                </div>
              `
              
              const rect = props.clientRect?.()
              if (rect) {
                popup.style.left = `${rect.left}px`
                popup.style.top = `${rect.bottom + 4}px`
              }

              popup.addEventListener('click', () => {
                commandFn({ title: 'AI Prompt' })
              })

              document.body.appendChild(popup)
            },

            onUpdate: (props) => {
              if (!popup || !props.items.length) return
              
              commandFn = props.command
              
              const rect = props.clientRect?.()
              if (rect) {
                popup.style.left = `${rect.left}px`
                popup.style.top = `${rect.bottom + 4}px`
              }
            },

            onKeyDown: (props) => {
              if (props.event.key === 'Enter') {
                commandFn({ title: 'AI Prompt' })
                return true
              }
              if (props.event.key === 'Escape') {
                return true
              }
              return false
            },

            onExit: () => {
              if (popup) {
                popup.remove()
                popup = null
              }
            },
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