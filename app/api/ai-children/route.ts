import { type NextRequest, NextResponse } from "next/server"

import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

import { z } from "zod"

const ChildSuggestionSchema = z.object({
  children: z
    .array(
      z.object({
        title: z.string().describe("A compelling title for this child node"),
        summary: z.string().describe("A detailed summary explaining this child's purpose and content"),
        levelName: z.string().describe("The level type name for this child node"),
      }),
    )
    .min(3)
    .max(5)
    .describe("An array of 3-5 logical child nodes"),
})

export async function POST(request: NextRequest) {
  try {
    const {
      context,
      childLevelName,
      customPrompt,
    }: {
      context: string
      childLevelName: string
      customPrompt?: string
    } = await request.json()

    const systemPrompt = `You are a creative planning assistant helping users generate child nodes for their fractal project structure.

CONTEXT PROVIDED:
${context}

You are generating children of type "${childLevelName}" for the current node.

Guidelines:
- Generate 3-5 logical children that would naturally belong under the current node
- Each child should have a compelling title and detailed summary
- Consider the hierarchical relationship and ensure children fit the parent's scope
- Make titles concise but descriptive
- Make summaries detailed enough to provide clear direction
- Ensure variety and logical progression between children
- Consider the existing siblings and children shown in the context
- All children should use "${childLevelName}" as their levelName`

    const userPrompt =
      customPrompt ||
      `Based on the provided context, generate appropriate ${childLevelName} children for the current node. Make sure they are logical, well-structured, and fit naturally within the established hierarchy.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      schema: ChildSuggestionSchema,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating child suggestions:", error)
    return NextResponse.json({ error: "Failed to generate child suggestions" }, { status: 500 })
  }
}
