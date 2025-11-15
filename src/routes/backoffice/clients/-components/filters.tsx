import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRouteApi, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { SearchInput } from '@/components/search-input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { LayoutGrid, Table2 } from 'lucide-react'

function useClientSearch() {
  const router = useRouter()
  const Route = getRouteApi('/backoffice/clients/')
  const search = Route.useSearch()

  function setClientSearch(values: Partial<typeof search>) {
    router.navigate({
      to: '/backoffice/clients',
      search: { ...search, ...values },
    })
  }

  return [search, setClientSearch] as const
}

export function StatusFilter() {
  const [{ status }, setClientSearch] = useClientSearch()

  return (
    <Tabs defaultValue={status}>
      <TabsList>
        <TabsTrigger
          className="cursor-pointer"
          value="active"
          onClick={() => setClientSearch({ status: 'active', page: 1 })}
        >
          Active
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer"
          value="pending"
          onClick={() => setClientSearch({ status: 'pending', page: 1 })}
        >
          Pending
        </TabsTrigger>
        <TabsTrigger
          className="cursor-pointer"
          value="inactive"
          onClick={() => setClientSearch({ status: 'inactive', page: 1 })}
        >
          Inactive
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export function SearchFilter() {
  const [{ name }, setClientSearch] = useClientSearch()
  const [localSearch, setLocalSearch] = useState(name)
  const debouncedSearchTerm = useDebounce(localSearch, 500)

  useEffect(() => {
    setClientSearch({ name: debouncedSearchTerm, page: 1 })
  }, [debouncedSearchTerm, setClientSearch])

  return (
    <div className="hidden items-center space-x-2 @lg:flex">
      <SearchInput
        autoFocus
        placeholder="Search by name"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  )
}

export function ViewModeToggle() {
  const [{ viewMode }, setClientSearch] = useClientSearch()

  return (
    <div className="flex items-center space-x-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClientSearch({ viewMode: 'cards' })}
            className="cursor-pointer"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View as cards</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setClientSearch({ viewMode: 'table' })}
            className="cursor-pointer"
          >
            <Table2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View as table</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
