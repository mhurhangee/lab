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
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
        const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())

        // Auto-transcribe the recording
        await this.transcribeFile(file)
      }

      this.mediaRecorder.start()
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
    if (this.mediaRecorder) {
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

      const result = await response.json()
      this.onTranscriptReady?.(result)
    } catch (error) {
      this.onError?.(error instanceof Error ? error.message : 'Failed to transcribe audio')
    } finally {
      this.updateState({ isTranscribing: false })
    }
  }

  getState(): RecordingState {
    return { ...this.state }
  }

  cleanup(): void {
    this.stopRecording()
    this.stopTimer()
  }

  formatTime(time: number): string {
    if (!time || isNaN(time) || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
}

// Quick transcribe utility for simple use cases
async function quickTranscribe(
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
