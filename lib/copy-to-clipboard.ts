export function copyToClipboard(text: string): Promise<void> {
  // Fallback for when clipboard API fails due to focus issues
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text)
  }

  return navigator.clipboard.writeText(text).catch(() => {
    return fallbackCopyTextToClipboard(text)
  })
}

function fallbackCopyTextToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      if (successful) {
        resolve()
      } else {
        reject(new Error('Copy command failed'))
      }
    } catch (err) {
      document.body.removeChild(textArea)
      reject(err)
    }
  })
}
