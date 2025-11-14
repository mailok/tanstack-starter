import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Insights, InsightsSkeleton } from './clients/-components/insights'

export const Route = createFileRoute('/backoffice/clients')({
  component: RouteComponent,
  pendingComponent: PendingRoute,
})

function RouteComponent() {
  return (
    <div className="flex size-full flex-col gap-6 p-6">
      <Insights />
      <Outlet />
    </div>
  )
}

function PendingRoute() {
  return (
    <div className="flex size-full flex-col gap-6 p-6">
      <InsightsSkeleton />
      <Outlet />
    </div>
  )
}
