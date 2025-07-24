import { openai } from '@ai-sdk/openai'

import { NextRequest, NextResponse } from 'next/server'

import { TranscriptionModel, experimental_transcribe as transcribe } from 'ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const language = formData.get('language') as string
    const prompt = formData.get('prompt') as string
    const model = (formData.get('model') as string) || 'whisper-1'

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 })
    }

    // Convert file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    const transcriptOptions: {
      model: TranscriptionModel
      audio: Buffer
      providerOptions?: {
        openai?: { language?: string; prompt?: string; timestampGranularities?: string[] }
      }
    } = {
      model: openai.transcription(model),
      audio: audioBuffer,
    }

    // Add optional parameters if provided
    const providerOptions: {
      language?: string
      prompt?: string
      timestampGranularities?: string[]
    } = {}

    if (language && language.trim()) {
      providerOptions.language = language.trim()
    }

    if (prompt && prompt.trim()) {
      providerOptions.prompt = prompt.trim()
    }

    // Add timestamp granularities for better results
    providerOptions.timestampGranularities = ['segment']

    if (Object.keys(providerOptions).length > 0) {
      transcriptOptions.providerOptions = { openai: providerOptions }
    }

    const result = await transcribe(transcriptOptions)

    return NextResponse.json({
      text: result.text,
      language: result.language,
      duration: result.durationInSeconds,
      segments: result.segments,
      warnings: result.warnings,
    })
  } catch (error) {
    console.error('Speech-to-text error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('overloaded') || error.message.includes('unavailable')) {
        return NextResponse.json(
          { error: 'OpenAI API is currently overloaded. Please try again in a few moments.' },
          { status: 503 }
        )
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait before trying again.' },
          { status: 429 }
        )
      }

      if (error.message.includes('file size') || error.message.includes('too large')) {
        return NextResponse.json(
          { error: 'Audio file is too large. Please use a smaller file.' },
          { status: 413 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    )
  }
}
