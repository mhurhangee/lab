import type { IconName } from 'lucide-react/dynamic'

import type { ContextsTypes } from '@/types/contexts'

export function getContextIcon(type: ContextsTypes): IconName {
  if (type === 'pdfs') return 'file'
  if (type === 'urls') return 'link'
  return 'file'
}
