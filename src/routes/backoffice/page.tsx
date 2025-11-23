import { Link, createFileRoute } from '@tanstack/react-router'
import { DataTable } from './-components/data-table'
import { ChartAreaInteractive } from './-components/chart-area-interactive'
import { SectionCards } from './-components/section-cards'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

function Crumb() {
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link to="/backoffice">Dashboard</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

export const Route = createFileRoute('/backoffice/')({
  component: RouteComponent,
  staticData: {
    crumb: <Crumb />,
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable />
        </div>
      </div>
    </div>
  )
}
