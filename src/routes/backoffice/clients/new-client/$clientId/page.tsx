import { createFileRoute, Navigate, defer, Await } from '@tanstack/react-router'
import { Suspense } from 'react'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { clientQueries } from '../../queries'
import { defaultClientSearch } from '../../schemas'
import { Skeleton } from '@/components/ui/skeleton'
import * as z from 'zod'

const onboardingSearchSchema = z.object({
  step: z.number().int().min(1).max(3).optional().catch(undefined),
})

export const Route = createFileRoute(
  '/backoffice/clients/new-client/$clientId/',
)({
  component: RouteComponent,
  validateSearch: onboardingSearchSchema,
  loaderDeps: ({ search: { step } }) => ({ step }),
  loader: async ({
    context: { queryClient },
    params: { clientId },
    deps: { step },
  }) => {
    const progressPromise = queryClient.fetchQuery(
      clientQueries.onboardingProgress(clientId, step),
    )

    return {
      progress: defer(progressPromise),
    }
  },
})

function RouteComponent() {
  const { progress } = Route.useLoaderData()
  const { step } = Route.useSearch()
  const { clientId } = Route.useParams()

  return (
    <Suspense fallback={<RoutePendingComponent />}>
      <Await promise={progress}>
        {(progress) => {
          const { isCompleted, currentViewStep } = progress

          // Redirect to clients list if onboarding is completed
          if (isCompleted) {
            return (
              <Navigate to="/backoffice/clients" search={defaultClientSearch} />
            )
          }

          // If currentViewStep differs from step, redirect with correct step
          if (currentViewStep !== null && step !== currentViewStep) {
            return (
              <Navigate
                to="/backoffice/clients/new-client/$clientId"
                params={{ clientId }}
                search={(prev: any) => ({ ...prev, step: currentViewStep })}
                replace
              />
            )
          }

          if (currentViewStep === 1) {
            return <PersonalInfoForm id="personal-info-form" />
          }

          if (currentViewStep === 2) {
            return <MedicalInfoForm id="medical-info-form" />
          }

          if (currentViewStep === 3) {
            return <>Benefits Form</>
          }

          return (
            <Navigate to="/backoffice/clients" search={defaultClientSearch} />
          )
        }}
      </Await>
    </Suspense>
  )
}

function RoutePendingComponent() {
  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Birth Date & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
