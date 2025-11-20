import { createFileRoute, Link, stripSearchParams } from '@tanstack/react-router'
import {
  SearchFilter,
  StatusFilter,
  ViewModeToggle,
} from './-components/filters'
import { ClientSearch, ClientSearchSchema } from './-schemas'
import { FilteredResults } from './-components/filtered-results'
import { clientQueries } from './-queries'
import { minutes } from '@/lib/time'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

const defaultSearch: ClientSearch = {
  page: 1,
  status: 'active',
  name: '',
  viewMode: 'cards',
}

function Crumb() {
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link to="/backoffice/clients" search={{ ...defaultSearch }}>Clients</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
}

export const Route = createFileRoute('/backoffice/clients/')({
  component: RouteComponent,
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const { page, name, status } = deps
    context.queryClient.prefetchQuery(
      clientQueries.filteredClients({ page, name, status, size: 10 }),
    )
  },
  staleTime: minutes.TEN,
  staticData: {
    crumb: <Crumb />
  }
})


function RouteComponent() {
  return (
    <>
      <div className="@container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StatusFilter />
          <SearchFilter />
        </div>
        <ViewModeToggle />
      </div>
      <FilteredResults />
      {/* <ClientsPagination /> */}
    </>
  )
}
