import { SignIn } from '@clerk/nextjs'

import { BackToButton } from '@/components/ui/back-to-button'
import { Loader } from '@/components/ui/loader'

import { LabLayout } from '@/components/lab-layout'

import { PenBoxIcon } from 'lucide-react'

export default function SignInPage() {
  return (
    <LabLayout
      title="Sign In"
      icon={<PenBoxIcon />}
      actions={<BackToButton href="/" label="Home" />}
      description="Sign in to your account"
    >
      <div className="mt-12 flex h-full items-center justify-center">
        <SignIn fallback={<Loader />} />
      </div>
    </LabLayout>
  )
}
