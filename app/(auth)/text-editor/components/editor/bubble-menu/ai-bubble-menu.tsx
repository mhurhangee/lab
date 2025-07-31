'use client'

import { Editor } from '@tiptap/react'
import { useEffect } from 'react'

interface AISelectionDetectorProps {
  editor: Editor
  onSelectionDetected: (position: { x: number; y: number }, selectedText: string, selection: { from: number; to: number; empty: boolean }) => void
}

export const AISelectionDetector = ({ editor, onSelectionDetected }: AISelectionDetectorProps) => {
  useEffect(() => {
    let selectionTimeout: NodeJS.Timeout

    const handleSelectionChange = () => {
      // Clear any existing timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout)
      }

      // Debounce selection changes to avoid too many triggers
      selectionTimeout = setTimeout(() => {
        const { selection } = editor.state
        const { from, to, empty } = selection

        // Only trigger if there's actual text selected (not just cursor position)
        if (!empty) {
          const selectedText = editor.state.doc.textBetween(from, to)
          
          // Only show for meaningful text selections (more than just whitespace)
          if (selectedText.trim().length > 0) {
            try {
              // Get DOM coordinates for the selection end
              const coords = editor.view.coordsAtPos(to)
              
              if (coords) {
                onSelectionDetected(
                  { x: coords.left, y: coords.bottom },
                  selectedText.trim(),
                  { from, to, empty }
                )
              }
            } catch (error) {
              // Silently ignore coordinate errors
              console.debug('Could not get selection coordinates:', error)
            }
          }
        }
      }, 150) // Small debounce to avoid excessive triggers
    }

    // Listen to editor selection updates
    editor.on('selectionUpdate', handleSelectionChange)

    return () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout)
      }
      // Remove the event listener
      editor.off('selectionUpdate', handleSelectionChange)
    }
  }, [editor, onSelectionDetected])

  // This component doesn't render anything - it's just a selection detector
  return null
}