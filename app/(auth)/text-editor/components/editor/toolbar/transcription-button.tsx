'use client'

import { Editor as TiptapEditor } from '@tiptap/react'

import { useCallback, useEffect, useRef, useState } from 'react'

import { MicIcon } from 'lucide-react'

import { ButtonTT } from '@/components/ui/button-tt'
import { Loader } from '@/components/ui/loader'

import { RecordingState, SpeechToTextRecorder, TranscriptResult } from '@/lib/speech-to-text'

import { toast } from 'sonner'

interface TranscriptionButtonProps {
  editor: TiptapEditor
}

export const TranscriptionButton = ({ editor }: TranscriptionButtonProps) => {
  const sttRecorderRef = useRef<SpeechToTextRecorder | null>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    isTranscribing: false,
  })

  // Memoized callback for transcript handling
  const handleTranscriptReady = useCallback(
    (transcript: TranscriptResult) => {
      const newText = transcript.text.trim()
      if (newText) {
        editor.commands.insertContent(newText)
        toast.success('Speech transcribed successfully!')
      }
    },
    [editor]
  )

  // Initialize STT recorder
  useEffect(() => {
    sttRecorderRef.current = new SpeechToTextRecorder({
      onStateChange: setRecordingState,
      onError: error => {
        toast.error(error)
      },
      onTranscriptReady: handleTranscriptReady,
    })

    return () => {
      sttRecorderRef.current?.cleanup()
    }
  }, [handleTranscriptReady])

  const handleSpeechToText = async () => {
    if (!sttRecorderRef.current) return

    const state = sttRecorderRef.current.getState()

    if (state.isRecording) {
      // Stop recording
      sttRecorderRef.current.stopRecording()
    } else {
      // Start recording
      await sttRecorderRef.current.startRecording()
    }
  }

  return (
    <ButtonTT
      tooltip={
        recordingState.isRecording
          ? `Recording... ${sttRecorderRef.current?.formatTime(recordingState.recordingTime) || '0:00'}`
          : recordingState.isTranscribing
            ? 'Transcribing...'
            : 'Speech to text'
      }
      onClick={handleSpeechToText}
      disabled={recordingState.isTranscribing}
      variant={recordingState.isRecording ? 'destructive' : 'ghost'}
    >
      {recordingState.isTranscribing ? (
        <Loader />
      ) : recordingState.isRecording ? (
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          <MicIcon className="h-4 w-4" />
        </div>
      ) : (
        <MicIcon className="h-4 w-4" />
      )}
    </ButtonTT>
  )
}
