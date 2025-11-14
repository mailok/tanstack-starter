import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Insights, InsightsSkeleton } from './clients/-components/insights'
import { clientQuieries } from './clients/queries'

export const Route = createFileRoute('/backoffice/clients')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(clientQuieries.insights())
    return {}
  },
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
