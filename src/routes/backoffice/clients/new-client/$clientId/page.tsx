import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { clientMutationKeys } from '../../mutations'
import { defaultClientSearch } from '../../schemas'
import { clientQueries } from '../../queries'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'

import * as z from 'zod'

import {
  Step,
  Stepper,
  StepperContent,
  StepperList,
  StepperTitle,
} from '@/components/stepper'
import { PersonalInfoStep } from '../components/personal-info-step'
import { MedicalInfoStep } from '../components/medical-info-step'
import { BenefitsStep } from '../components/benefits-step'
import {
  useQuery,
  useIsMutating,
  keepPreviousData,
} from '@tanstack/react-query'

import { Skeleton } from '@/components/ui/skeleton'

const onboardingSearchSchema = z.object({
  step: z.number().int().min(1).max(3).optional().catch(undefined),
})

export const Route = createFileRoute(
  '/backoffice/clients/new-client/$clientId/',
)({
  component: RouteComponent,
  pendingComponent: RoutePendingComponent,
  loaderDeps: ({ search: { step } }) => ({ step }),
  validateSearch: onboardingSearchSchema,
  beforeLoad: async ({ search, params, context }) => {
    if (!search.step) {
      const { currentViewStep } = await context.queryClient.ensureQueryData(
        clientQueries.onboardingProgress(params.clientId),
      )
      throw redirect({
        to: '/backoffice/clients/new-client/$clientId',
        params,
        search: { ...defaultClientSearch, step: currentViewStep ?? 1 },
        replace: true,
      })
    }
  },
  staticData: {
    crumb: <Crumb />,
  },
  pendingMs: 10,
})

function RouteComponent() {
  const { clientId } = Route.useParams()
  const { step } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...clientQueries.onboardingProgress(clientId, step),
    placeholderData: keepPreviousData,
  })

  const isStep1Updating =
    useIsMutating({
      mutationKey: clientMutationKeys.onboarding.updatePersonal(clientId),
    }) > 0

  const isStep1Creating =
    useIsMutating({
      mutationKey: clientMutationKeys.onboarding.create(),
    }) > 0

  const isStep1Pending = isStep1Updating || isStep1Creating

  const isStep2Pending =
    useIsMutating({
      mutationKey: clientMutationKeys.onboarding.updateMedical(clientId),
    }) > 0

  const isStep3Pending =
    useIsMutating({
      mutationKey: clientMutationKeys.onboarding.updateBenefits(clientId),
    }) > 0

  // Handle initial loading state matching the PendingComponent behavior
  if (isLoading && !data) {
    return <RoutePendingComponent />
  }

  // Ensure data exists for valid type narrowing below (since we check isLoading && !data above)
  if (!data) return null

  const currentStep = step || data.currentViewStep || 1

  let pendingStep: number | boolean | undefined
  if (isStep1Pending) pendingStep = 1
  else if (isStep2Pending) pendingStep = 2
  else if (isStep3Pending) pendingStep = 3
  else if (isPlaceholderData) pendingStep = currentStep

  const { completedSteps, currentViewStep } = data

  function onNavigate(targetStep: number) {
    if (currentViewStep === 1 && !clientId) {
      // Cannot navigate freely if client not created yet, unless pure internal state logic (which we don't have)
      return
    }
    navigate({
      to: '/backoffice/clients/new-client/$clientId',
      params: { clientId },
      search: (prev) => ({ ...prev, step: targetStep }),
    })
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8 pb-10 md:pb-16">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full md:px-20 min-h-[40vh]">
            <div className="w-full">
              <Stepper
                active={currentStep}
                completed={completedSteps}
                orientation="horizontal"
                onNavigate={onNavigate}
                pending={pendingStep}
                className="flex flex-col justify-between"
              >
                <StepperList>
                  <Step step={1}>
                    <StepperTitle>Personal Information</StepperTitle>
                  </Step>
                  <Step step={2}>
                    <StepperTitle>Medical Information</StepperTitle>
                  </Step>
                  <Step step={3}>
                    <StepperTitle>Benefits</StepperTitle>
                  </Step>
                </StepperList>

                <StepperContent step={1}>
                  <PersonalInfoStep clientId={clientId} step={1} />
                </StepperContent>

                <StepperContent step={2}>
                  <MedicalInfoStep clientId={clientId} step={2} />
                </StepperContent>

                <StepperContent step={3}>
                  <BenefitsStep clientId={clientId} step={3} />
                </StepperContent>
              </Stepper>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Crumb() {
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link
          to="/backoffice/clients/new-client"
          search={{
            ...defaultClientSearch,
            step: 1,
          }}
          preload={false}
        >
          New Client
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

function RoutePendingComponent() {
  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8 pb-10 md:pb-16">
          <div className="flex justify-center w-full md:px-20 min-h-[40vh]">
            <div className="w-full">
              <Stepper
                active={1}
                orientation="horizontal"
                pending={true}
                className="flex flex-col justify-between"
              >
                <StepperList>
                  <Step step={1}>
                    <StepperTitle>Personal Information</StepperTitle>
                  </Step>
                  <Step step={2}>
                    <StepperTitle>Medical Information</StepperTitle>
                  </Step>
                  <Step step={3}>
                    <StepperTitle>Benefits</StepperTitle>
                  </Step>
                </StepperList>

                {/* Form Skeleton */}
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
              </Stepper>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-8 lg:px-24 pb-4 md:pb-8">
          <Skeleton className="h-11 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}
