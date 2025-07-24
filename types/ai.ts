import { UIMessage } from 'ai'

// Define your custom message type with data part schemas
export type TransientUIMessage = UIMessage<
  never, // metadata type
  {
    post: {
      suggestions: { text: string; short: string }[]
      title: string
    }
  }
>
