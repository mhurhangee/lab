interface TTSOptions {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  instructions?: string
  speed?: number
}

interface TTSPresets {
  chat: Omit<TTSOptions, 'text'>
  narrator: Omit<TTSOptions, 'text'>
  custom: Omit<TTSOptions, 'text'>
}

const TTS_PRESETS: TTSPresets = {
  chat: {
    voice: 'nova',
    instructions:
      'Speak in a conversational, friendly tone as if you are having a natural conversation.',
    speed: 1.1,
  },
  narrator: {
    voice: 'onyx',
    instructions: 'Speak like a professional narrator with clear enunciation.',
    speed: 1.0,
  },
  custom: {
    voice: 'alloy',
    speed: 1.0,
  },
}

export async function generateSpeech(
  options: TTSOptions
): Promise<{ audioUrl: string; cleanup: () => void }> {
  const response = await fetch('/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: options.text.trim(),
      voice: options.voice || 'alloy',
      instructions: options.instructions?.trim() || undefined,
      speed: options.speed || 1,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to generate speech')
  }

  const audioBlob = await response.blob()
  const audioUrl = URL.createObjectURL(audioBlob)

  return {
    audioUrl,
    cleanup: () => URL.revokeObjectURL(audioUrl),
  }
}

export class SimpleTTSPlayer {
  private audio: HTMLAudioElement | null = null
  private currentCleanup: (() => void) | null = null
  private isPlaying = false
  private onStateChange?: (isPlaying: boolean) => void

  constructor(onStateChange?: (isPlaying: boolean) => void) {
    this.onStateChange = onStateChange
  }

  async playText(text: string, preset: keyof TTSPresets = 'chat'): Promise<void> {
    // Stop current playback if any
    this.stop()

    try {
      const options = { text, ...TTS_PRESETS[preset] }
      const { audioUrl, cleanup } = await generateSpeech(options)

      this.currentCleanup = cleanup
      this.audio = new Audio(audioUrl)

      this.audio.addEventListener('ended', () => {
        this.stop()
      })

      this.audio.addEventListener('error', () => {
        this.stop()
      })

      await this.audio.play()
      this.isPlaying = true
      this.onStateChange?.(true)
    } catch (error) {
      console.error('TTS playback error:', error)
      this.stop()
      throw error
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
      this.audio = null
    }

    if (this.currentCleanup) {
      this.currentCleanup()
      this.currentCleanup = null
    }

    if (this.isPlaying) {
      this.isPlaying = false
      this.onStateChange?.(false)
    }
  }

  toggle(text: string, preset: keyof TTSPresets = 'chat'): Promise<void> | void {
    if (this.isPlaying) {
      this.stop()
    } else {
      return this.playText(text, preset)
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  destroy(): void {
    this.stop()
    this.onStateChange = undefined
  }
}
