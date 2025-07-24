import { NextRequest, NextResponse } from 'next/server'

import { models } from '@/lib/models'
import { improve } from '@/lib/prompts'

import { generateText } from 'ai'

export async function POST(req: NextRequest) {
  const { input } = (await req.json()) as { input: string }

  const result = await generateText({
    model: models[0].model,
    prompt: improve + "\n\n #USER's PROMPT\n " + input,
  })

  return NextResponse.json({ improved: result.text })
}
