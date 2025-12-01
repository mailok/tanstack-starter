import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import { PersonalInfoForm } from '../../components/personal-info-form'
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
  beforeLoad: async ({
    params: { clientId },
    context: { queryClient },
    search: { step },
  }) => {
    const progress = await queryClient.fetchQuery(
      clientQueries.onboardingProgress(clientId, step),
    )

    // If currentViewStep differs from step, redirect with correct step
    if (
      progress.currentViewStep !== null &&
      step !== progress.currentViewStep
    ) {
      throw redirect({
        to: '/backoffice/clients/new-client/$clientId',
        params: { clientId },
        search: { step: progress.currentViewStep } as any,
        replace: true,
      })
    }

    return { progress }
  },
  loader: async ({ context: { progress } }) => {
    return {
      progress,
    }
  },
  pendingComponent: RoutePendingComponent,
  pendingMs: 10,
})

function RouteComponent() {
  const { progress } = Route.useLoaderData()
  console.log({ progress })

  const { isCompleted, currentViewStep } = progress

  // Redirect to clients list if onboarding is completed
  if (isCompleted) {
    return <Navigate to="/backoffice/clients" search={defaultClientSearch} />
  }

  if (currentViewStep === 1) {
    return <PersonalInfoForm id="personal-info-form" />
  }

  if (currentViewStep === 2) {
    return <>Medical Info Form</>
  }

  if (currentViewStep === 3) {
    return <>Benefits Form</>
  }

  return <Navigate to="/backoffice/clients" search={defaultClientSearch} />
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
