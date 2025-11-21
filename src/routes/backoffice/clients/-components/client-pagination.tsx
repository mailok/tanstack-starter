import { AppPagination } from '@/components/app-pagination'
import { useClientSearch } from '../-hooks/use-client-search'
import { useSuspenseQuery } from '@tanstack/react-query'
import { clientQueries } from '../-queries'
import { Suspense } from 'react'

const DEFAULT_SIZE = 10

export function ClientsPagination() {
  return (
    <Suspense>
      <PaginationContent />
    </Suspense>
  )
}

function PaginationContent() {
  const [search, setClientSearch] = useClientSearch()
  const { data } = useSuspenseQuery(
    clientQueries.filteredClients({
      page: search.page,
      name: search.name,
      status: search.status,
      size: DEFAULT_SIZE,
    }),
  )

  return (
    <AppPagination
      currentPage={search.page}
      total={data.total}
      size={DEFAULT_SIZE}
      onPageChange={(page) => setClientSearch({ page })}
    />
  )
}
