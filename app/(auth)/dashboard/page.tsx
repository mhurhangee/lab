import { LabLayout } from '@/components/lab-layout'

export default function DashboardPage() {
  return (
    <LabLayout
      title="Dashboard"
      description="Superfier lab home dashboard/"
      icon="layout-grid"
      backToHref="/"
      backToLabel="Home"
      breadcrumb={[{ href: '/dashboard', label: 'Dashboard' }]}
    >
      <div className="mt-12 flex h-full items-center justify-center">Dashboard</div>
    </LabLayout>
  )
}
