import { Waitlist } from '@clerk/nextjs'

import { Loader } from '@/components/ui/loader'

import { LabLayout } from '@/components/lab-layout'

export default function WaitlistPage() {
  return (
    <LabLayout
      title="Waitlist"
      icon="timer"
      backToHref="/"
      backToLabel="Home"
      breadcrumb={[{ href: '/waitlist', label: 'Waitlist' }]}
      description="Sign up for the waitlist"
    >
      <div className="mt-12 flex h-full items-center justify-center">
        <Waitlist fallback={<Loader />} />
      </div>
    </LabLayout>
  )
}
