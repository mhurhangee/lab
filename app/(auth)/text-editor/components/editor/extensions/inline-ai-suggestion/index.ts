import { Extension } from '@tiptap/react'

interface InlineAISuggestionOptions {
  onTrigger?: () => void
}

export const InlineAISuggestion = Extension.create<InlineAISuggestionOptions>({
  name: 'inlineAISuggestion',

  addOptions() {
    return {
      onTrigger: undefined,
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Space': () => {
        this.options.onTrigger?.()
        return true
      },
    }
  },
})
