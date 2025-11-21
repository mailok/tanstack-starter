import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { FileX } from 'lucide-react'
import { ClientDetailsError } from '../-components/client-details-error'
import { ClientSearchSchema, defaultClientSearch } from '../-schemas'
import { clientQueries } from '@/routes/backoffice/clients/-queries'
import { ErrorBoundary } from '@/components/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const Route = createFileRoute(
  '/backoffice/clients/$clientId/medical-info',
)({
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  loader: ({ context: { queryClient }, params: { clientId } }) =>
    queryClient.ensureQueryData(clientQueries.medicalInformation(clientId)),
  component: ClientMedicalInformation,
})

export function ClientMedicalInformation() {
  const { clientId } = Route.useParams()

  return (
    <ErrorBoundary fallback={<ClientDetailsError />}>
      <Suspense fallback={<ClientMedicalInformationSkeleton />}>
        <ClientMedicalInformationContent clientId={clientId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function ClientMedicalInformationContent({ clientId }: { clientId: string }) {
  const { data: medical } = useSuspenseQuery(
    clientQueries.medicalInformation(clientId),
  )

  if (!medical) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileX />
            </EmptyMedia>
            <EmptyTitle>No Medical Information</EmptyTitle>
            <EmptyDescription>
              This client doesn't have any medical information on file yet.
            </EmptyDescription>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Medical Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Blood Type
              </p>
              <p className="text-lg font-semibold">
                {medical.bloodType || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Checkup
              </p>
              <p>{medical.lastCheckup || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Allergies
            </p>
            <div className="flex flex-wrap gap-2">
              {medical.allergies?.map((allergy) => (
                <Badge key={allergy} variant="destructive">
                  {allergy}
                </Badge>
              )) || (
                <span className="text-sm text-muted-foreground">
                  None recorded
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Chronic Conditions
            </p>
            <div className="flex flex-wrap gap-2">
              {medical.chronicConditions?.map((condition) => (
                <Badge key={condition} variant="secondary">
                  {condition}
                </Badge>
              )) || (
                <span className="text-sm text-muted-foreground">
                  None recorded
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p>{medical.emergencyContactName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Relationship
            </p>
            <p>{medical.emergencyContactRelationship || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <p>{medical.emergencyContactPhone || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ClientMedicalInformationSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
