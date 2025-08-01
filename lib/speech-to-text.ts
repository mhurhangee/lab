export interface TranscriptResult {
  text: string
  language?: string
  duration?: number
  segments?: Array<{
    text: string
    start: number
    end: number
  }>
  warnings?: string[]
}

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  recordingTime: number
  isTranscribing: boolean
}

export class SpeechToTextRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private recordingInterval: NodeJS.Timeout | null = null
  private onStateChange?: (state: RecordingState) => void
  private onError?: (error: string) => void
  private onTranscriptReady?: (transcript: TranscriptResult) => void
  private currentStream: MediaStream | null = null

  private state: RecordingState = {
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    isTranscribing: false,
  }

  constructor(callbacks?: {
    onStateChange?: (state: RecordingState) => void
    onError?: (error: string) => void
    onTranscriptReady?: (transcript: TranscriptResult) => void
  }) {
    this.onStateChange = callbacks?.onStateChange
    this.onError = callbacks?.onError
    this.onTranscriptReady = callbacks?.onTranscriptReady
  }

  private updateState(updates: Partial<RecordingState>) {
    this.state = { ...this.state, ...updates }
    this.onStateChange?.(this.state)
  }

  private startTimer() {
    this.recordingInterval = setInterval(() => {
      this.updateState({ recordingTime: this.state.recordingTime + 1 })
    }, 1000)
  }

  private stopTimer() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval)
      this.recordingInterval = null
    }
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.currentStream = stream

      // Check for supported MIME types that OpenAI accepts
      // Prioritize formats that work better with OpenAI
      const supportedTypes = [
        'audio/mp4',
        'audio/mpeg',
        'audio/wav',
        'audio/webm;codecs=opus',
        'audio/webm',
      ]

      let mimeType = 'audio/webm' // Default fallback
      let fileName = 'recording.webm'

      // Find the first supported type
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type
          if (type.includes('webm')) {
            fileName = 'recording.webm'
          } else if (type.includes('mp4')) {
            fileName = 'recording.mp4'
          } else if (type.includes('mpeg')) {
            fileName = 'recording.mp3'
          } else if (type.includes('wav')) {
            fileName = 'recording.wav'
          }
          break
        }
      }

      this.mediaRecorder = new MediaRecorder(stream, { mimeType })
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = error => {
        console.error('MediaRecorder error:', error)
        this.onError?.('Recording error occurred.')
      }

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length === 0) {
          this.onError?.('No audio data recorded. Please try recording again.')
          return
        }

        const audioBlob = new Blob(this.audioChunks, { type: mimeType })

        if (audioBlob.size === 0) {
          this.onError?.('Recording failed - no audio data captured.')
          return
        }

        const file = new File([audioBlob], fileName, { type: mimeType })

        // Auto-transcribe the recording
        await this.transcribeFile(file)
      }

      // Start recording with timeslice to ensure data is captured regularly
      this.mediaRecorder.start(1000) // Request data every 1000ms
      this.updateState({
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
      })
      this.startTimer()
    } catch (error) {
      this.onError?.('Failed to access microphone. Please check permissions.')
      console.error('Recording error:', error)
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause()
      this.updateState({ isPaused: true })
      this.stopTimer()
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume()
      this.updateState({ isPaused: false })
      this.startTimer()
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      // Check if recording time is too short
      if (this.state.recordingTime < 1) {
        this.onError?.('Recording too short. Please record for at least 1 second.')
        this.cleanup()
        return
      }

      this.mediaRecorder.stop()
      this.updateState({
        isRecording: false,
        isPaused: false,
      })
      this.stopTimer()
    }
  }

  async transcribeFile(
    file: File,
    options?: {
      model?: string
      language?: string
      prompt?: string
    }
  ): Promise<void> {
    this.updateState({ isTranscribing: true })

    try {
      if (file.size === 0) {
        throw new Error('Audio file is empty')
      }

      const formData = new FormData()
      formData.append('audio', file)
      formData.append('model', options?.model || 'whisper-1')

      if (options?.language && options.language !== 'auto') {
        formData.append('language', options.language)
      }

      if (options?.prompt?.trim()) {
        formData.append('prompt', options.prompt.trim())
      }

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Transcription error:', errorData)
        throw new Error(errorData.error || 'Failed to transcribe audio')
      }

      const result = await response.json()
      this.onTranscriptReady?.(result)
    } catch (error) {
      console.error('Transcription failed:', error)
      this.onError?.(error instanceof Error ? error.message : 'Failed to transcribe audio')
    } finally {
      this.updateState({ isTranscribing: false })
    }
  }

  getState(): RecordingState {
    return { ...this.state }
  }

  cleanup(): void {
    // Stop recording if active
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }

    // Stop all media tracks
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(track => track.stop())
      this.currentStream = null
    }

    // Clear references
    this.mediaRecorder = null
    this.audioChunks = []
    this.stopTimer()

    // Reset state
    this.updateState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      isTranscribing: false,
    })
  }

  formatTime(time: number): string {
    if (!time || isNaN(time) || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

// Quick transcribe utility for simple use cases
export async function quickTranscribe(
  file: File,
  options?: {
    model?: string
    language?: string
    prompt?: string
  }
): Promise<TranscriptResult> {
  const formData = new FormData()
  formData.append('audio', file)
  formData.append('model', options?.model || 'whisper-1')

  if (options?.language && options.language !== 'auto') {
    formData.append('language', options.language)
  }

  if (options?.prompt?.trim()) {
    formData.append('prompt', options.prompt.trim())
  }

  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to transcribe audio')
  }

  return response.json()
}
