import { Blockquote } from '@tiptap/extension-blockquote'
import { Document } from '@tiptap/extension-document'
import { Heading } from '@tiptap/extension-heading'
import { History } from '@tiptap/extension-history'
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Placeholder } from '@tiptap/extensions'

export const extensions = [
  Document,
  Paragraph,
  Text,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  History,
  Blockquote,
  HorizontalRule,
  Placeholder.configure({
    placeholder: 'Write something …',
  }),
]
