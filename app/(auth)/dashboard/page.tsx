import { LabLayout } from '@/components/lab-layout'

import { LayoutGridIcon } from 'lucide-react'

export default function DashboardPage() {
  return (
    <LabLayout title="Dashboard" icon={<LayoutGridIcon />}>
      <div className="mt-12 flex h-full items-center justify-center">Dashboard</div>
    </LabLayout>
  )
}
