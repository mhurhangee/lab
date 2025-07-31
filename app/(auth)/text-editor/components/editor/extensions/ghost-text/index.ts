import { Extension } from '@tiptap/react'
import type { Command } from '@tiptap/react'

import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

interface GhostTextState {
  ghostText: string
  from: number
  loading: boolean
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    ghostText: {
      setGhostText: (ghostText: string, from: number, loading: boolean) => ReturnType
      clearGhostText: () => ReturnType
      acceptGhostText: () => ReturnType
    }
  }
}

const ghostTextPluginKey = new PluginKey<GhostTextState>('aiGhostText')

export const AIGhostText = Extension.create({
  name: 'aiGhostText',

  addCommands() {
    return {
      setGhostText:
        (ghostText: string, from: number, loading: boolean): Command =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(ghostTextPluginKey, { ghostText, from, loading })
            dispatch(tr)
          }
          return true
        },
      clearGhostText:
        (): Command =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(ghostTextPluginKey, { ghostText: '', from: 0, loading: false })
            dispatch(tr)
          }
          return true
        },
      acceptGhostText:
        (): Command =>
        ({ tr, dispatch, state }) => {
          const pluginState = ghostTextPluginKey.getState(state)
          if (pluginState?.ghostText && dispatch) {
            // Insert the ghost text as plain text at current position
            const from = state.selection.from
            tr.insertText(pluginState.ghostText, from)
            // Clear ghost text
            tr.setMeta(ghostTextPluginKey, { ghostText: '', from: 0, loading: false })
            dispatch(tr)
            return true
          }
          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const state = editor.state
        const pluginState = ghostTextPluginKey.getState(state)
        if (pluginState?.ghostText && !pluginState.loading) {
          // Use setTimeout to avoid transaction conflicts
          setTimeout(() => {
            editor.commands.acceptGhostText()
          }, 0)
          return true // Prevent default Tab behavior
        }
        return false // Let default Tab behavior happen
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<GhostTextState>({
        key: ghostTextPluginKey,
        state: {
          init() {
            return { ghostText: '', from: 0, loading: false }
          },
          apply(tr: Transaction, oldState: GhostTextState) {
            const meta = tr.getMeta(ghostTextPluginKey)
            if (meta) {
              return { ...oldState, ...meta }
            }
            return oldState
          },
        },
        props: {
          handleKeyDown: (view, event) => {
            const pluginState = ghostTextPluginKey.getState(view.state)

            // If there's ghost text or loading state, handle key presses
            if (pluginState?.ghostText || pluginState?.loading) {
              // Allow Tab to be handled by keyboard shortcuts (to accept ghost text)
              if (event.key === 'Tab') {
                return false
              }

              // For any other key, dismiss the ghost text
              setTimeout(() => {
                const tr = view.state.tr.setMeta(ghostTextPluginKey, {
                  ghostText: '',
                  from: 0,
                  loading: false,
                })
                view.dispatch(tr)
              }, 0)

              // Don't prevent the key event - let it proceed normally
              return false
            }

            return false
          },
          decorations: (state: EditorState) => {
            const pluginState = ghostTextPluginKey.getState(state)
            if (!pluginState) return DecorationSet.empty

            const { ghostText, from, loading } = pluginState

            // Show loading spinner or ghost text
            if (!loading && !ghostText) return DecorationSet.empty

            // Use current cursor position if from is 0 or invalid
            const position = from > 0 && from <= state.doc.content.size ? from : state.selection.to

            return DecorationSet.create(state.doc, [
              Decoration.widget(position, () => {
                const span = document.createElement('span')
                span.className = 'ai-ghost-text'

                if (loading) {
                  span.innerHTML = `
                    <svg class="inline animate-spin" width="12" height="12" fill="none" viewBox="0 0 24 24" style="vertical-align: middle;">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    <span style="margin-left: 4px; font-size: 0.9em; vertical-align: middle;">Generating...</span>
                  `
                } else if (ghostText) {
                  span.innerHTML = `
                    <span style="background: rgba(0,0,0,0.06); padding: 1px 3px; border-radius: 2px; font-size: inherit;">
                      ${ghostText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    </span>
                    <span style="opacity: 0.6; font-size: 0.75em; margin-left: 6px; color: #888; vertical-align: middle;">(Tab)</span>
                  `
                }

                return span
              }),
            ])
          },
        },
      }),
    ]
  },
})
