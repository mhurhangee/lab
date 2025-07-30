import { NextRequest, NextResponse } from 'next/server'

import { models } from '@/lib/models'

import { generateObject } from 'ai'

import { z } from 'zod'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const { fullText, selectionEnd } = await req.json()

    const system = `\
  - You are a expert writing assistant.  
  - You will be given a piece of text that a user has asked for help writing part of.
  - You will be provided the whole text AND where the user has asked for help inserting text <AI_CONTENT_GOES_HERE>.
  - Your task is to continue the text in a way that is natural and flows well with the rest of the document.
  - Your text should continue directly from the text to continue, i.e. you do not need to write in full sentences if carrying on from something mid-sentence.
  - Continue writing up until the next major punctuation mark (period, comma, semicolon, colon, question mark, exclamation point) or end of the paragraph or section as applicable.
  - The full text of the document is provided for context, you only need to return the text that should be inserted.
  - Return the text as a JSON object with the key 'aiContent'.
  - Format the text as markdown.`
  
    const schema = z.object({
      aiContent: z.string(),
    })
  
    const prompt = `\
  ${fullText.slice(0, selectionEnd)}
  <AI_CONTENT_GOES_HERE>
  ${fullText.slice(selectionEnd)}
  `

  const result = await generateObject({
    model: models[0].model,
    system,
    schema,
    prompt,
  })

  console.log(result.object)

  return NextResponse.json(result.object)
}