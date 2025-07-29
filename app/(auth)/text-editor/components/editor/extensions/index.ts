import { Blockquote } from '@tiptap/extension-blockquote'
import { Document } from '@tiptap/extension-document'
import { Heading } from '@tiptap/extension-heading'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { Mention } from '@tiptap/extension-mention'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Placeholder, UndoRedo } from '@tiptap/extensions'
import CodeBlock from '@tiptap/extension-code-block'

import { mentionSuggestion } from './mentions'
import { locationMentionSuggestion, eventMentionSuggestion, characterMentionSuggestion } from './multi-mentions'

export const extensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Blockquote,
  HorizontalRule,
  // Location mentions (@)
  Mention.configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'location',
    },
    suggestion: locationMentionSuggestion,
    renderLabel({ node }) {
      return `@${node.attrs.label || node.attrs.id}`
    },
  }),
  // Event mentions (!)
  Mention.extend({
    name: 'eventMention',
  }).configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'event',
    },
    suggestion: {
      ...eventMentionSuggestion,
      char: '!',
    },
    renderLabel({ node }) {
      return `!${node.attrs.label || node.attrs.id}`
    },
  }),
  // Character mentions (&)
  Mention.extend({
    name: 'characterMention',
  }).configure({
    HTMLAttributes: {
      class: 'mention',
      'data-type': 'character',
    },
    suggestion: {
      ...characterMentionSuggestion,
      char: '&',
    },
    renderLabel({ node }) {
      return `&${node.attrs.label || node.attrs.id}`
    },
  }),
  Placeholder.configure({
    placeholder: 'Write something …',
  }),
  UndoRedo,
  CodeBlock
]
