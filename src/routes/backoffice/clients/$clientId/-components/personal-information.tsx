import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { clientQueries } from '../../-queries'
import { ClientDetailsError } from '../../-components/client-details-error'
import { ErrorBoundary } from '@/components/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  clientId: string
}

export function PersonalInformation({ clientId }: Props) {
  return (
    <ErrorBoundary fallback={<ClientDetailsError />}>
      <Suspense fallback={<PersonalInformationSkeleton />}>
        <PersonalInformationContent clientId={clientId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function PersonalInformationContent({ clientId }: Props) {
  const { data: client } = useSuspenseQuery(
    clientQueries.personalInformation(clientId),
  )

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p>{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <p>{client.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="capitalize">{client.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Birth Date
                </p>
                <p>{client.birthDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p>{client.age} years</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PersonalInformationSkeleton() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
