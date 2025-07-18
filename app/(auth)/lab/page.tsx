import { LabLayout } from '@/components/lab-layout'

import { TestTubeIcon } from 'lucide-react'

export default function LabPage() {
  return (
    <LabLayout title="Lab" icon={<TestTubeIcon />}>
      <div className="mt-12 flex h-full items-center justify-center">Lab</div>
    </LabLayout>
  )
}
