import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Insights, InsightsSkeleton } from './clients/-components/insights'
import { clientQueries } from './clients/-queries'
import { minutes } from '@/lib/time'

export const Route = createFileRoute('/backoffice/clients')({
  component: RouteComponent,
  pendingComponent: PendingRoute,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(clientQueries.insights()).catch(() => {
      console.error('Error loading client insights')
    })
  },
  staleTime: minutes.TEN,
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
    </div>
  )
}
