import { Waitlist } from '@clerk/nextjs'

import { BackToButton } from '@/components/ui/back-to-button'
import { Loader } from '@/components/ui/loader'

import { LabLayout } from '@/components/lab-layout'

import { TimerIcon } from 'lucide-react'

export default function WaitlistPage() {
  return (
    <LabLayout
      title="Waitlist"
      icon={<TimerIcon />}
      actions={<BackToButton href="/" label="Home" />}
      description="Sign up for the waitlist"
    >
      <div className="mt-12 flex h-full items-center justify-center">
        <Waitlist fallback={<Loader />} />
      </div>
    </LabLayout>
  )
}
