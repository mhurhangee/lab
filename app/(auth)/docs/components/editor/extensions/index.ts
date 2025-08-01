import { Blockquote } from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import { Document } from '@tiptap/extension-document'
import { Heading } from '@tiptap/extension-heading'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { Mention } from '@tiptap/extension-mention'
import { Paragraph } from '@tiptap/extension-paragraph'
import {
  type TableOfContentDataItem,
  TableOfContents,
  getHierarchicalIndexes,
} from '@tiptap/extension-table-of-contents'
import { Text } from '@tiptap/extension-text'
import { Placeholder, UndoRedo } from '@tiptap/extensions'
import type { Editor as TiptapEditor } from '@tiptap/react'

import { createAIPromptSlashSuggestion } from './ai-prompt-slash'
import { AIGhostText } from './ghost-text'
import { InlineAISuggestion } from './inline-ai-suggestion'
import { fetchSuggestion } from './inline-ai-suggestion/utils'
import {
  type MentionAttributes,
  dynamicCharacterMentionSuggestion,
  dynamicEventMentionSuggestion,
  dynamicLocationMentionSuggestion,
} from './multi-mentions/dynamic-mentions'

interface ExtensionsOptions {
  setTocItems: (content: TableOfContentDataItem[]) => void
  editorRef: React.RefObject<TiptapEditor | null>
  onTriggerAIPrompt?: (position: { x: number; y: number }) => void
}

export const defaultExtensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Blockquote,
  HorizontalRule,
  Placeholder.configure({
    placeholder: 'Write something …',
  }),
  UndoRedo,
  CodeBlock,
]

export const extensions = ({ setTocItems, editorRef, onTriggerAIPrompt }: ExtensionsOptions) => [
  ...defaultExtensions,
  AIGhostText,
  InlineAISuggestion.configure({
    onTrigger: () => editorRef.current && fetchSuggestion(editorRef.current),
  }),
  TableOfContents.configure({
    anchorTypes: ['heading', 'blockquote'],
    getIndex: getHierarchicalIndexes,
    onUpdate(content) {
      setTocItems(content)
    },
  }),
  // AI Slash Commands
  ...(onTriggerAIPrompt ? [createAIPromptSlashSuggestion(onTriggerAIPrompt)] : []),
  // Location mentions (@)
  Mention.extend({
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.id) return {}
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-label'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.label) return {}
            return { 'data-label': attributes.label }
          },
        },
        type: {
          default: 'location',
          parseHTML: (element: HTMLElement) => element.getAttribute('data-type') || 'location',
          renderHTML: (attributes: MentionAttributes) => {
            return { 'data-type': attributes.type || 'location' }
          },
        },
      }
    },
  }).configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'location',
    },
    suggestion: dynamicLocationMentionSuggestion,
    renderLabel({ node }) {
      return `${node.attrs.label || node.attrs.id}`
    },
  }),
  // Event mentions (!)
  Mention.extend({
    name: 'eventMention',
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.id) return {}
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-label'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.label) return {}
            return { 'data-label': attributes.label }
          },
        },
        type: {
          default: 'event',
          parseHTML: (element: HTMLElement) => element.getAttribute('data-type') || 'event',
          renderHTML: (attributes: MentionAttributes) => {
            return { 'data-type': attributes.type || 'event' }
          },
        },
      }
    },
  }).configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'event',
    },
    suggestion: {
      ...dynamicEventMentionSuggestion,
      char: '!',
    },
    renderLabel({ node }) {
      return `${node.attrs.label || node.attrs.id}`
    },
  }),
  // Character mentions (&)
  Mention.extend({
    name: 'characterMention',
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.id) return {}
            return { 'data-id': attributes.id }
          },
        },
        label: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-label'),
          renderHTML: (attributes: MentionAttributes) => {
            if (!attributes.label) return {}
            return { 'data-label': attributes.label }
          },
        },
        type: {
          default: 'character',
          parseHTML: (element: HTMLElement) => element.getAttribute('data-type') || 'character',
          renderHTML: (attributes: MentionAttributes) => {
            return { 'data-type': attributes.type || 'character' }
          },
        },
      }
    },
  }).configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'character',
    },
    suggestion: {
      ...dynamicCharacterMentionSuggestion,
      char: '&',
    },
    renderLabel({ node }) {
      return `${node.attrs.label || node.attrs.id}`
    },
  }),
]
