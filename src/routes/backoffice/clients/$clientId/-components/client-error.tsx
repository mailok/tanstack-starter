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
      <div className="rounded-lg p-8 max-w-md">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive/10">
              <UserX className="size-6 text-destructive" />
            </EmptyMedia>
            <EmptyTitle className="text-destructive text-lg font-semibold">
              {title}
            </EmptyTitle>
            <EmptyDescription className="text-destructive">
              {description}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link
                to="/backoffice/clients"
                search={(prev) => ({ ...defaultClientSearch, ...prev })}
                preload={false}
              >
                Go to Clients List
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
