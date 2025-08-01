import { NextRequest, NextResponse } from 'next/server'

import { handleErrorServer } from '@/lib/error/server'
import { models } from '@/lib/models'

import { generateText } from 'ai'

const system = `\
- You are a expert writing assistant.  
- The full text of the document is provided for context, you only need to return the text that should be inserted.
- Format the text as markdown.
- Only return the text that should be inserted.
- Do not include any other text, comments, or explanations in your response.`

export async function POST(request: NextRequest) {
  try {
    const { prompt, context, selection } = await request.json()

    const fullPrompt = `\
    <USER INSTRUCTIONS>
    ${prompt}
    </USER INSTRUCTIONS>
    <CONTEXT>
    ${JSON.stringify(context)}
    </CONTEXT>
    ${selection ? `<SELECTION>${JSON.stringify(selection)}</SELECTION>` : ''}
    `

    const result = await generateText({
      model: models[0].model,
      system: system,
      prompt: fullPrompt,
    })

    return NextResponse.json(result.text)
  } catch (error) {
    handleErrorServer(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
