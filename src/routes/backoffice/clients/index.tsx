import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import {
  SearchFilter,
  StatusFilter,
  ViewModeToggle,
} from './-components/filters'
import * as z from 'zod'

const ClientSearchSchema = z.object({
  page: z.number().catch(1),
  status: z.enum(['active', 'inactive', 'pending']).catch('active'),
  name: z.string().default(''),
  viewMode: z.enum(['cards', 'table']).catch('cards'),
})

type ClientSearch = z.infer<typeof ClientSearchSchema>

const defaultSearch: ClientSearch = {
  page: 1,
  status: 'active',
  name: '',
  viewMode: 'cards',
}

export const Route = createFileRoute('/backoffice/clients/')({
  component: RouteComponent,
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps: _searchFilter }) => {
    // Prefetch queries
    return {}
  },
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
      {/* <ClientList />
      <ClientsPagination /> */}
    </>
  )
}
