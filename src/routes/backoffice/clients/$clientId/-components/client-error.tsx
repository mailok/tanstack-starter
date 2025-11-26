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

type Props = {
  title: string
  description: string
}

export function ClientError({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX className="size-6" />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link
              to="/backoffice/clients"
              search={(prev) => ({ ...defaultClientSearch, ...prev })}
            >
              Go to Clients List
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
