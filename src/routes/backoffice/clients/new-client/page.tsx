import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { defaultClientSearch } from '../schemas'
import * as z from 'zod'
import {
  OnboardingProvider,
  onboardingReducer,
  OnboardingState,
} from './use-onboarding'
import { useReducer } from 'react'
import { OnboardingWizard } from './components/onboarding-wizard'
import { PendingWizard } from './components/pending-wizard'
import { clientQueries } from '../queries'
import { useSuspenseQuery } from '@tanstack/react-query'

const onboardingSearchSchema = z.object({
  step: z.number().int().min(1).max(3).optional().catch(undefined),
  client: z.uuid().optional().catch(undefined),
})

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
  pendingComponent: PendingWizard,
  validateSearch: onboardingSearchSchema,
})

function RouteComponent() {
  const { client, step } = Route.useSearch()
  const navigate = useNavigate()

  const { data: progress } = useSuspenseQuery(
    clientQueries.onboardingProgress(client, step),
  )

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

  const initialState: OnboardingState = {
    step: progress.activeStep,
    clientId: client,
    nextStepToComplete: progress.nextOnboardingStep,
    completedSteps: progress.completedSteps,
    pendingStep: undefined,
  }

  const [state, dispatch] = useReducer(onboardingReducer, initialState)

  return (
    <OnboardingProvider value={[state, dispatch]}>
      <OnboardingWizard clientId={client} onNavigate={navigateToStep} />
    </OnboardingProvider>
  )
}
