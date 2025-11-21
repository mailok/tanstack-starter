import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'
import { LayoutGrid, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchInput } from '@/components/search-input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { PillGroup, PillGroupItem } from '@/components/ui/pill-group'
import { ClientStatus } from '@/db/schemas/client'
import { useClientSearch } from '../-hooks/use-client-search'

export function StatusFilter() {
  const [search, setClientSearch] = useClientSearch()

  return (
    <PillGroup
      value={search.status}
      onValueChange={(value) =>
        setClientSearch({ status: value as ClientStatus, page: 1 })
      }
    >
      <PillGroupItem value="active">Active</PillGroupItem>
      <PillGroupItem value="pending">Pending</PillGroupItem>
      <PillGroupItem value="inactive">Inactive</PillGroupItem>
    </PillGroup>
  )
}

export function SearchFilter() {
  const [search, setClientSearch] = useClientSearch()
  const name = search.name ?? ''

  const [localSearch, setLocalSearch] = useState(name)
  const debouncedSearchTerm = useDebounce(localSearch, 500)

  useEffect(() => {
    if (debouncedSearchTerm !== name) {
      setClientSearch({ name: debouncedSearchTerm, page: 1 })
    }
  }, [debouncedSearchTerm, name, setClientSearch])

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
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setClientSearch({ viewMode: 'cards' })}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              viewMode === 'cards'
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:shadow-sm',
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View as cards</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setClientSearch({ viewMode: 'table' })}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              viewMode === 'table'
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground hover:shadow-sm',
            )}
          >
            <Table2 className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View as table</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
