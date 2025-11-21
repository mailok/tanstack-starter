import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPageNumbers } from '@/lib/page-numbers'
import { Skeleton } from '@/components/ui/skeleton'

interface AppPaginationProps {
  currentPage: number
  total: number
  size: number
  onPageChange: (page: number) => void
}

export function AppPagination({
  currentPage,
  total,
  size,
  onPageChange,
}: AppPaginationProps) {
  const totalPages = Math.ceil(total / size)

  if (totalPages <= 1) {
    return null
  }

  function handlePrevious() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  function handleNext() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const pageNumbers = getPageNumbers(totalPages, currentPage)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {pageNumbers.map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => onPageChange(pageNum as number)}
                isActive={pageNum === currentPage}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function AppPaginationSkeleton() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Skeleton className="h-9 w-24" />
        </PaginationItem>
        {Array.from({ length: 3 }).map((_, i) => (
          <PaginationItem key={i}>
            <Skeleton className="h-9 w-9" />
          </PaginationItem>
        ))}
        <PaginationItem>
          <Skeleton className="h-9 w-24" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
