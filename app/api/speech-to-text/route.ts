import { NextRequest, NextResponse } from 'next/server'

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

    // Create FormData for OpenAI API
    const openaiFormData = new FormData()
    openaiFormData.append('file', audioFile)
    openaiFormData.append('model', model)

    // Add optional parameters
    if (language && language.trim() && language !== 'auto') {
      openaiFormData.append('language', language.trim())
    }

    if (prompt && prompt.trim()) {
      openaiFormData.append('prompt', prompt.trim())
    }

    // Add response format and timestamp granularities
    openaiFormData.append('response_format', 'verbose_json')
    openaiFormData.append('timestamp_granularities[]', 'segment')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)

      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid audio file format or corrupted file.' },
          { status: 400 }
        )
      }

      throw new Error(`OpenAI API error: ${response.status} ${errorData}`)
    }

    const result = await response.json()

    return NextResponse.json({
      text: result.text,
      language: result.language,
      duration: result.duration,
      segments: result.segments,
      warnings: result.warnings || [],
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
