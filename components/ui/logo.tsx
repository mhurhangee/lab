import { app } from '@/lib/app'

import { IconBackground } from './icon-background'

export const Logo = ({ iconSize, bgSize }: { iconSize?: string; bgSize?: string }) => {
  return (
    <IconBackground className={bgSize}>
      <app.icon className={iconSize} />
    </IconBackground>
  )
}
