import { Link, useRouter, ErrorComponentProps } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

export function NewClientError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="rounded-lg p-8 max-w-md">
        <Empty>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-destructive/10 dark:bg-red-500/20"
            >
              <AlertCircle className="size-6 text-destructive dark:text-red-400" />
            </EmptyMedia>
            <EmptyTitle className="text-destructive dark:text-red-400 text-lg font-semibold">
              Something went wrong
            </EmptyTitle>
            <EmptyDescription className="text-destructive/90 dark:text-red-300/90 break-words">
              {error.message ||
                'An unexpected error occurred while loading this page.'}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col gap-2 w-full sm:flex-row justify-center items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset()
                  router.invalidate()
                }}
              >
                Try Again
              </Button>
              <Button asChild variant="default" size="sm">
                <Link
                  to="/backoffice/clients"
                  search={{
                    page: 1,
                    status: 'active',
                    name: '',
                    viewMode: 'cards',
                  }}
                >
                  Go to Clients List
                </Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
