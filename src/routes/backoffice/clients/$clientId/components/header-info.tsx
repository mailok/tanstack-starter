import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { clientQueries } from '../../queries'
import { getInitials } from '../../utils/get-initials'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ErrorBoundary } from '@/components/error-boundary'

type Props = {
  clientId: string
}

export function HeaderInfo({ clientId }: Props) {
  return (
    <ErrorBoundary fallback={<HeaderInfoError />}>
      <Suspense fallback={<HeaderInfoSkeleton />}>
        <HeaderInfoContent clientId={clientId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function HeaderInfoContent({ clientId }: Props) {
  const { data: client } = useSuspenseQuery(clientQueries.header(clientId))
  return (
    <div className="flex flex-col items-center gap-4 text-center p-4 md:px-0">
      <Avatar className="h-20 w-20 ring-4 ring-background shadow-md group-hover:scale-105 transition-transform duration-300">
        <AvatarImage
          src={client.photo ?? undefined}
          alt={client.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary text-3xl font-bold flex items-center justify-center leading-none pb-1">
          {getInitials(client.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-lg font-bold tracking-tight leading-tight whitespace-nowrap">
          {client.name}
        </h1>
        <div className="flex justify-center">
          <Badge
            variant={client.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
            data-status={client.status}
          >
            {client.status}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export function HeaderInfoSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 text-center p-4 md:px-0">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="flex flex-col gap-2 items-center w-full">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

function HeaderInfoError() {
  return (
    <div className="flex flex-col items-center gap-4 text-center p-4 md:px-0">
      <Skeleton className="h-20 w-20 rounded-full bg-destructive/[0.08]" />
      <div className="flex flex-col gap-2 items-center w-full">
        <Skeleton className="h-6 w-32 bg-destructive/[0.08]" />
        <Skeleton className="h-5 w-16 rounded-full bg-destructive/[0.08]" />
      </div>
    </div>
  )
}
