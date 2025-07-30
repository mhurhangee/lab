import { Extension } from '@tiptap/react'

export const InlineAISuggestion = Extension.create({
  name: 'inlineAISuggestion',
  addKeyboardShortcuts() {
    return {
      'Mod-Space': () => {
        if (this.options.onTrigger) {
          this.options.onTrigger()
        }
        return true
      },
    }
  },
})