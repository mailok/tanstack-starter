import { AlertTriangle } from 'lucide-react'
import { useErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { ErrorCodes } from '../-api'

export function ClientDetailsError() {
  const { error, resetErrorBoundary } = useErrorBoundary()

  let message =
    error?.message ||
    'Something went wrong while loading the client details. Please try again.'

  if (error?.message.includes(ErrorCodes.clientNotFound)) {
    message =
      'The client you are looking for does not exist or has been removed.'
  }
  if (error?.message.includes(ErrorCodes.invalidClientId)) {
    message = 'The client ID provided is not valid.'
  }

  return (
    <div className="size-full flex items-center justify-center min-h-[200px]">
      <div className="space-y-4 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-destructive dark:text-red-400">
            Error loading details
          </h3>
          <p className="mx-auto max-w-md text-sm text-destructive dark:text-red-400">
            {message}
          </p>
        </div>
        <Button onClick={resetErrorBoundary} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    </div>
  )
}
