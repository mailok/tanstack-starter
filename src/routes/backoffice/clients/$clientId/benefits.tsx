import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { Check, X } from 'lucide-react'
import { ClientDetailsError } from '../-components/client-details-error'
import { ClientSearchSchema, defaultClientSearch } from '../-schemas'
import { clientBenefitsQueryOptions } from '@/routes/backoffice/clients/-queries'
import { ErrorBoundary } from '@/components/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export const Route = createFileRoute('/backoffice/clients/$clientId/benefits')({
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  loader: ({ context: { queryClient }, params: { clientId } }) =>
    queryClient.ensureQueryData(clientBenefitsQueryOptions(clientId)),
  component: ClientBenefits,
})

export function ClientBenefits() {
  const { clientId } = Route.useParams()

  return (
    <ErrorBoundary fallback={<ClientDetailsError />}>
      <Suspense fallback={<ClientBenefitsSkeleton />}>
        <ClientBenefitsContent clientId={clientId} />
      </Suspense>
    </ErrorBoundary>
  )
}

function ClientBenefitsContent({ clientId }: { clientId: string }) {
  const { data: benefits } = useSuspenseQuery(
    clientBenefitsQueryOptions(clientId),
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Provider
              </p>
              <p className="text-lg font-semibold">
                {benefits.insuranceProvider || 'N/A'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Policy Number
                </p>
                <p>{benefits.policyNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Coverage Type
                </p>
                <p className="font-medium text-primary">
                  {benefits.coverageType || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Deductible
              </p>
              <p className="font-mono">
                ${benefits.deductible?.toLocaleString() ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Copay</p>
              <p className="font-mono">
                ${benefits.copay?.toLocaleString() ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Annual Limit
              </p>
              <p className="font-mono">
                ${benefits.annualLimit?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coverage Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CoverageItem
            label="Dental Coverage"
            included={benefits.dentalCoverage}
          />
          <CoverageItem
            label="Vision Coverage"
            included={benefits.visionCoverage}
          />
          <CoverageItem
            label="Mental Health Coverage"
            included={benefits.mentalHealthCoverage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function CoverageItem({
  label,
  included,
}: {
  label: string
  included?: boolean | null
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
      <span className="font-medium">{label}</span>
      {included ? (
        <div className="flex items-center text-green-600 text-sm font-medium bg-green-500/10 px-2 py-1 rounded">
          <Check className="w-4 h-4 mr-1" />
          Included
        </div>
      ) : (
        <div className="flex items-center text-muted-foreground text-sm bg-muted px-2 py-1 rounded">
          <X className="w-4 h-4 mr-1" />
          Not Included
        </div>
      )}
    </div>
  )
}

function ClientBenefitsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
