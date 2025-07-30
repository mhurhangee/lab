import { Extension } from '@tiptap/react'
import type { Editor, Command } from '@tiptap/react'

import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { markdownToTiptapContent } from './markdown-to-tiptap'

interface GhostTextState {
  ghostText: string
  from: number
  loading: boolean
}

interface GhostTextOptions {
  // No options needed
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

export const AIGhostText = Extension.create<GhostTextOptions>({
  name: 'aiGhostText',
  addOptions() {
    return {}
  },

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
      Enter: ({ editor }) => {
        const state = editor.state
        const pluginState = ghostTextPluginKey.getState(state)
        if (pluginState?.ghostText && !pluginState.loading) {
          // Use setTimeout to avoid transaction conflicts
          setTimeout(() => {
            editor.commands.acceptGhostText()
          }, 0)
          return true // Prevent default Enter behavior
        }
        return false // Let default Enter behavior happen
      },
      Escape: ({ editor }) => {
        const state = editor.state
        const pluginState = ghostTextPluginKey.getState(state)
        if (pluginState?.ghostText || pluginState?.loading) {
          // Use setTimeout to avoid transaction conflicts
          setTimeout(() => {
            editor.commands.clearGhostText()
          }, 0)
          return true
        }
        return false
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
                span.style.opacity = '0.5'
                span.style.pointerEvents = 'none'
                span.style.userSelect = 'none'
                span.style.fontStyle = 'italic'
                span.style.color = '#888'
                span.className = 'ai-ghost-text'

                if (loading) {
                  span.innerHTML = `
                    <svg class="inline animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24" style="margin-left: 2px;">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                    </svg>
                    <span style="margin-left: 4px; font-size: 0.9em;">Generating...</span>
                  `
                } else if (ghostText) {
                  span.innerHTML = `
                    <span style="background: rgba(0,0,0,0.05); padding: 1px 4px; border-radius: 3px; margin-left: 2px;">
                      ${ghostText}
                    </span>
                    <span style="opacity: 0.6; font-size: 0.8em; margin-left: 4px; color: #666;">(Tab to accept)</span>
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