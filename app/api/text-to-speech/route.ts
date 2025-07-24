import { openai } from '@ai-sdk/openai'

import { NextRequest, NextResponse } from 'next/server'

import { SpeechModel, experimental_generateSpeech as generateSpeech } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'alloy', instructions, speed = 1 } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (text.length > 4096) {
      return NextResponse.json({ error: 'Text must be 4096 characters or less' }, { status: 400 })
    }

    const speechOptions: {
      model: SpeechModel
      text: string
      voice: string
      instructions?: string
      speed?: number
    } = {
      model: openai.speech('gpt-4o-mini-tts'),
      text,
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
    }

    // Add optional parameters if provided
    if (instructions && instructions.trim()) {
      speechOptions.instructions = instructions.trim()
    }

    if (speed && speed !== 1) {
      speechOptions.speed = speed
    }

    const { audio } = await generateSpeech(speechOptions)

    // Return the audio data as a blob
    const audioBuffer = Buffer.from(audio.base64, 'base64')

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 })
  }
}
