import { UIMessage } from 'ai'

export const messagesToString = (messages: UIMessage[]) => {
  const result = messages
    .map((message, index) => {
      const textContent = message.parts
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join(' ')
      return `${message.role === 'user' ? `<USER-${index}>` : `<AI-${index}>`}: ${textContent} ${message.role === 'user' ? `</USER-${index}>` : `</AI-${index}>`}\n`
    })
    .join('')

  return result
}
