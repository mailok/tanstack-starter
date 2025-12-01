import {
  Link,
  Outlet,
  createFileRoute,
  stripSearchParams,
} from '@tanstack/react-router'
import { ClientSearchSchema, defaultClientSearch } from './schemas'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

export const Route = createFileRoute('/backoffice/clients')({
  component: ClientsLayout,
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  staticData: {
    crumb: <Crumb />,
  },
})

function ClientsLayout() {
  return <Outlet />
}

function Crumb() {
  const search = Route.useSearch()
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link
          to="/backoffice/clients"
          search={{
            page: search.page,
            status: search.status,
            viewMode: search.viewMode,
            name: search.name,
          }}
          preload={false}
        >
          Clients
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}
