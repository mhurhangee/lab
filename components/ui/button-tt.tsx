import React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { type VariantProps } from 'class-variance-authority'

interface ButtonTTProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  tooltip: string
  asChild?: boolean
}

export const ButtonTT = ({ tooltip, children, asChild, ...props }: ButtonTTProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild={asChild} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
