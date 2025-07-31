# AI Prompt Menu System

A unified, extensible AI prompt system for Tiptap editors with multiple trigger methods.

## Features

✨ **Unified Container** - Single `AIPromptMenu` component used across all triggers  
🎯 **Multiple Triggers** - Slash commands, toolbar button, and text selection  
🚀 **React Portal** - Clean positioning without DOM manipulation complexity  
🔄 **State Management** - Handles prompt input → loading → AI response flow  
🎨 **shadcn Components** - Consistent design with Command, Input, Button components  

## Architecture

```
AIPromptMenu (Portal Container)
├── PromptInputState (Command with examples + custom input)
├── LoadingState (Spinner + progress)
└── AIResponseState (Response + Accept/Reject/Try Again)

Triggers:
├── AISelectionDetector (Text selection → Auto-trigger)
├── AIPromptButton (Toolbar button)
└── Slash Commands (/ai → Menu)
```

## Usage

### 1. Basic Integration

```typescript
import { AIPromptIntegration } from './ai-prompt-menu/ai-prompt-integration'

function MyEditor() {
  const editor = useEditor({
    extensions: [
      // ... your extensions
    ]
  })

  return (
    <div>
      <EditorContent editor={editor} />
      <AIPromptIntegration editor={editor} />
    </div>
  )
}
```

### 2. Adding Slash Commands

```typescript
import { Suggestion } from '@tiptap/suggestion'
import { createAIPromptSlashSuggestion } from './extensions/ai-prompt-slash'

const editor = useEditor({
  extensions: [
    // ... other extensions
    
    Suggestion.configure({
      suggestion: createAIPromptSlashSuggestion((position) => {
        // Trigger AI prompt menu at position
        triggerAIPrompt(position)
      })
    })
  ]
})
```

### 3. Custom AI Service Integration

Update `/app/api/ai-prompt/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  const { prompt, context, selection } = await request.json()
  
  // Replace with your AI service (OpenAI, Anthropic, etc.)
  const response = await yourAIService.generate({
    prompt: `${prompt}\n\nContext: ${context}`,
    maxTokens: 500
  })
  
  return NextResponse.json({ result: response.text })
}
```

## Trigger Methods

### 1. Text Selection (Automatic)
- Select any text in the editor
- AI prompt menu appears automatically near selection
- Pre-fills with selected text as context

### 2. Toolbar Button
- Click the "🤖 AI Prompt" button in toolbar
- Opens menu at cursor position
- Works with or without text selection

### 3. Slash Commands
- Type `/ai` to see AI command options
- Select "AI Prompt" to open full menu
- Or use quick actions like "AI Improve Writing"

## States

### Prompt Input State
- List of example prompts (Improve, Fix Grammar, Make Shorter, etc.)
- Custom prompt input with auto-focus
- Shows selected text context if available

### Loading State  
- Spinner animation
- Shows current prompt being processed
- "This may take a few seconds" message

### AI Response State
- Shows generated AI response
- Three actions: Accept, Reject, Try Again
- Accept inserts response into editor
- Try Again returns to prompt input

## Customization

### Adding New Prompt Examples

```typescript
const PROMPT_EXAMPLES: PromptExample[] = [
  // ... existing examples
  {
    id: 'translate',
    label: 'Translate to Spanish', 
    prompt: 'Translate this text to Spanish',
    icon: '🌐',
    description: 'Convert text to Spanish'
  }
]
```

### Custom Positioning

```typescript
// Use custom position instead of automatic detection
<AIPromptMenu
  position={{ x: 100, y: 200 }}
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

### Styling

All components use shadcn/ui classes and can be customized via:
- `className` props on components
- CSS custom properties for theming
- Tailwind utility classes

## API Reference

### AIPromptMenu Props

```typescript
interface AIPromptMenuProps {
  position: { x: number; y: number } | null
  onClose: () => void
  onSubmit: (prompt: string) => Promise<string>
  selectedText?: string
}
```

### useAIPrompt Hook

```typescript
const { handleAISubmit, insertAIResponse } = useAIPrompt({ editor })
```

- `handleAISubmit`: Sends prompt to AI service
- `insertAIResponse`: Inserts AI response into editor

## Benefits Over Other Approaches

✅ **vs tippy.js**: Simpler React patterns, no complex positioning libraries  
✅ **vs Separate Menus**: Single container, consistent UX, easier maintenance  
✅ **vs Manual DOM**: React Portal handles positioning and cleanup  
✅ **vs Complex State**: Clear state machine with three distinct states  

## File Structure

```
ai-prompt-menu/
├── ai-prompt-menu.tsx          # Main container component
├── ai-prompt-integration.tsx   # Integration with triggers
├── use-ai-prompt.ts            # Hook for AI operations
└── index.ts                    # Exports

../bubble-menu/
└── ai-bubble-menu.tsx          # Selection detector (renamed from BubbleMenu)

../toolbar/
└── ai-prompt-button.tsx        # Toolbar trigger

../extensions/ai-prompt-slash/
├── ai-prompt-slash.tsx         # Slash command trigger
└── index.ts
```

This system provides a clean, maintainable foundation for AI-powered text editing features!