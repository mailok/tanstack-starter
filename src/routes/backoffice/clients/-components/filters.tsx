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

type StatusFilterProps = {
  statusSelected: ClientStatus
  selectStatus: (value: ClientStatus) => void
}

export function StatusFilter(props: StatusFilterProps) {
  const { statusSelected, selectStatus } = props

  return (
    <PillGroup
      value={statusSelected}
      onValueChange={(value) => selectStatus(value as ClientStatus)}
    >
      <PillGroupItem value="active">Active</PillGroupItem>
      <PillGroupItem value="pending">Pending</PillGroupItem>
      <PillGroupItem value="inactive">Inactive</PillGroupItem>
    </PillGroup>
  )
}

type SearchFilterProps = {
  name: string
  setName: (value: string) => void
}

export function SearchFilter(props: SearchFilterProps) {
  const { name, setName } = props

  const [localSearch, setLocalSearch] = useState(name)
  const debouncedSearchTerm = useDebounce(localSearch, 500)

  useEffect(() => {
    setName(debouncedSearchTerm)
  }, [debouncedSearchTerm, setName])

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

type ViewModeToggleProps = {
  viewMode: 'cards' | 'table'
  setViewMode: (value: 'cards' | 'table') => void
}

export function ViewModeToggle(props: ViewModeToggleProps) {
  const { viewMode, setViewMode } = props

  return (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setViewMode('cards')}
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
            onClick={() => setViewMode('table')}
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
