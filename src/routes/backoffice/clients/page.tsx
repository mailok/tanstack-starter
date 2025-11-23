import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import {
  SearchFilter,
  StatusFilter,
  ViewModeToggle,
} from './-components/filters'
import { ClientSearchSchema, defaultClientSearch } from './-schemas'
import { FilteredResults } from './-components/filtered-results'
import { clientQueries } from './-queries'
import { Insights, InsightsSkeleton } from './-components/insights'
import { ClientsPagination } from './-components/client-pagination'
import { minutes } from '@/lib/time'

export const Route = createFileRoute('/backoffice/clients/')({
  component: RouteComponent,
  pendingComponent: PendingRoute,
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const { page, name, status } = deps

    Promise.all([
      context.queryClient
        .ensureQueryData(clientQueries.insights())
        .catch(() => {
          console.error('Error loading client insights')
        }),
      context.queryClient.prefetchQuery(
        clientQueries.list({ page, name, status, size: 10 }),
      ),
    ])
  },
  staleTime: minutes.TEN,
})

function RouteComponent() {
  return (
    <div className="flex size-full flex-col gap-6 p-6">
      <Insights />
      <div className="@container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusFilter />
          <SearchFilter />
        </div>
        <ViewModeToggle />
      </div>
      <FilteredResults />
      <ClientsPagination />
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
