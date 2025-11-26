import {
  Link,
  Outlet,
  createFileRoute,
  stripSearchParams,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { clientQueries } from '../-queries'
import { ClientSearchSchema, defaultClientSearch } from '../-schemas'
import { HeaderInfo } from './-components/header-info'
import { DetailsNav } from './-components/details-nav'
import { Skeleton } from '@/components/ui/skeleton'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { ClientGuard } from './-components/client-guard'

function Crumb() {
  const { clientId } = Route.useParams()
  const search = Route.useSearch()

  const {
    data: client,
    isLoading,
    isError,
  } = useQuery({
    ...clientQueries.header(clientId),
    throwOnError: false,
  })

  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link
          to="/backoffice/clients/$clientId/personal-info"
          params={{ clientId }}
          search={search}
        >
          {isLoading || isError ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            client?.name || `Client ${clientId}`
          )}
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

export const Route = createFileRoute('/backoffice/clients/$clientId')({
  component: ClientLayout,
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  staticData: {
    crumb: <Crumb />,
  },
  loader: async ({ context: { queryClient }, params: { clientId } }) => {
    queryClient.prefetchQuery(clientQueries.header(clientId))
  },
})

function ClientLayout() {
  const { clientId } = Route.useParams()

  return (
    <ClientGuard clientId={clientId}>
      <div className="flex flex-col gap-6 p-6 h-full">
        <DetailsNav header={<HeaderInfo clientId={clientId} />}>
          <Outlet />
        </DetailsNav>
      </div>
    </ClientGuard>
  )
}
