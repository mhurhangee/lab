import { SignIn } from '@clerk/nextjs'

import { Loader } from '@/components/ui/loader'

import { LabLayout } from '@/components/lab-layout'

export default function SignInPage() {
  return (
    <LabLayout
      title="Sign In"
      pageTitle="Sign In"
      icon="pen-box"
      backTo={{ href: '/', label: 'Home' }}
      breadcrumb={[{ href: '/sign-in', label: 'Sign In' }]}
      description="Sign in to your account"
    >
      <div className="flex items-center justify-center">
        <SignIn fallback={<Loader />} />
      </div>
    </LabLayout>
  )
}
