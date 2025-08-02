import type { ContextDB } from '@/types/database'

interface BrainstormProps {
  savedBrainstorm: ContextDB
}

export function Brainstorm({ savedBrainstorm }: BrainstormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1>{savedBrainstorm.name}</h1>
      <p>Brainstorm</p>
    </div>
  )
}
