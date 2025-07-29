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

export const extensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  Blockquote,
  HorizontalRule,
  Mention.configure({
    HTMLAttributes: {
      class: 'mention',
    },
    suggestion: mentionSuggestion,
    renderLabel({ node }) {
      return `@${node.attrs.label || node.attrs.id}`
    },
  }),
  Placeholder.configure({
    placeholder: 'Write something …',
  }),
  UndoRedo,
  CodeBlock
]
