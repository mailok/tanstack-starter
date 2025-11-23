import { Link } from '@tanstack/react-router'
import { UserX } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { defaultClientSearch } from '../../-schemas'

export function ClientNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX className="size-6" />
          </EmptyMedia>
          <EmptyTitle>Client Not Found</EmptyTitle>
          <EmptyDescription>
            The client you are looking for does not exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/backoffice/clients" search={defaultClientSearch}>
              Go to Clients List
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
