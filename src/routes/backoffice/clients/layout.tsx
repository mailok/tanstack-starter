import {
  Link,
  Outlet,
  createFileRoute,
  stripSearchParams,
} from '@tanstack/react-router'
import { ClientSearchSchema, defaultClientSearch } from './-schemas'
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

function Crumb() {
  const search = Route.useSearch()
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link to="/backoffice/clients" search={search}>
          Clients
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

function ClientsLayout() {
  return <Outlet />
}
