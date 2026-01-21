import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { defaultClientSearch } from '../schemas'
import * as z from 'zod'
import {
  OnboardingProvider,
  onboardingReducer,
  OnboardingState,
  FIRST_STEP,
  LAST_STEP,
} from './use-onboarding'
import { useReducer } from 'react'
import { OnboardingWizard } from './components/onboarding-wizard'
import { PendingWizard } from './components/pending-wizard'
import { clientQueries, clientKeys } from '../queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { NewClientError } from './components/new-client-error'

const onboardingSearchSchema = z.object({
  step: z
    .number()
    .int()
    .min(FIRST_STEP)
    .max(LAST_STEP)
    .optional()
    .catch(undefined),
  client: z.string().optional(),
})

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
  pendingComponent: PendingWizard,
  errorComponent: NewClientError,
  validateSearch: onboardingSearchSchema,
  onLeave: ({ context }) => {
    context.queryClient.removeQueries({
      queryKey: clientKeys.onboarding(),
    })
  },
})

function RouteComponent() {
  const { client, step } = Route.useSearch()
  const navigate = useNavigate()

  const { data: progress } = useSuspenseQuery(
    clientQueries.onboardingProgress(client, step),
  )

  if (progress.isCompleted && client) {
    return (
      <Navigate
        to="/backoffice/clients/$clientId/personal-info"
        params={{ clientId: client }}
        search={defaultClientSearch}
      />
    )
  }

  const initialState: OnboardingState = {
    step: progress.activeStep,
    clientId: client,
    nextStepToComplete: progress.nextOnboardingStep,
    completedSteps: progress.completedSteps,
    pendingStep: undefined,
  }

  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  function navigateToStep(step: number) {
    navigate({
      to: '/backoffice/clients/new-client',
      search: {
        ...defaultClientSearch,
        client: state.clientId || client,
        step,
      },
    })
  }

  return (
    <OnboardingProvider value={[state, dispatch]}>
      <OnboardingWizard clientId={client} onNavigate={navigateToStep} />
    </OnboardingProvider>
  )
}
