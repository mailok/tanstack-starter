import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { clientQueries } from '../../-queries'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '../../-utils/get-initials'

type Props = {
  clientId: string
}

export function HeaderInfo({ clientId }: Props) {
  return (
    <Suspense fallback={<HeaderInfoSkeleton />}>
      <HeaderInfoContent clientId={clientId} />
    </Suspense>
  )
}

function HeaderInfoContent({ clientId }: Props) {
  const { data: client } = useSuspenseQuery(clientQueries.headerInfo(clientId))
  return (
    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left p-4 md:px-0">
      <Avatar className="h-20 w-20 ring-4 ring-background shadow-md group-hover:scale-105 transition-transform duration-300">
        <AvatarImage
          src={client.photo}
          alt={client.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary text-xl font-bold">
          {getInitials(client.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-lg font-bold tracking-tight leading-tight whitespace-nowrap">
          {client.name}
        </h1>
        <div className="flex justify-center md:justify-start">
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

function HeaderInfoSkeleton() {
  return (
    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left p-4 md:px-0">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="flex flex-col gap-2 items-center md:items-start w-full">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}
