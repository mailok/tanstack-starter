import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { defaultClientSearch } from '../../schemas'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { completeClientOnboarding } from '../../api'
import { BenefitsForm } from '../../components/benefits-form'
import { Button } from '@/components/ui/button'
import { useCurrentStep } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'
import { useOnboarding } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'
import { until } from 'until-async'

type Props = {
  clientId: string
}

const FORM_ID = 'benefits-form'

export function BenefitsStep({ clientId }: Props) {
  const queryClient = useQueryClient()
  const { step } = useCurrentStep()
  const [{ nextStepToComplete, pendingStep }, dispatch] = useOnboarding()

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId, step),
    enabled: Boolean(clientId) && step !== nextStepToComplete,
  })
  const navigate = useNavigate()

  const PREV_STEP = step - 1

  const completeOnboardingMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.updateBenefits(clientId),
    mutationFn: completeClientOnboarding,
    onSuccess: () => {
      navigate({
        to: '/backoffice/clients/$clientId',
        params: { clientId },
        search: defaultClientSearch,
      })
    },
  })

  const initialValues = data?.values || undefined
  const isStepPending =
    completeOnboardingMutation.isPending || pendingStep === PREV_STEP

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      return
    }
    completeOnboardingMutation.mutate({ data: { clientId, benefits: values } })
  }

  async function navigateToPreviousStep() {
    dispatch({ type: 'STEP_PENDING', payload: PREV_STEP })

    const [error] = await until(async () => {
      await queryClient.ensureQueryData({
        ...clientQueries.onboardingValues(clientId, PREV_STEP),
        revalidateIfStale: true,
      })
    })

    dispatch({ type: 'STEP_IDLE' })

    if (error) {
      // TODO: Handle error appropriately
      console.error(error)
      return
    }

    dispatch({ type: 'GO_TO_STEP', payload: PREV_STEP })
  }

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <BenefitsForm
        id={FORM_ID}
        initialValues={initialValues}
        onSubmit={saveAndNavigate}
        disabled={isStepPending}
      />
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={navigateToPreviousStep}
          disabled={isStepPending}
        >
          Back
        </Button>
        <Button form={FORM_ID} type="submit" size="lg" disabled={isStepPending}>
          Next
        </Button>
      </div>
    </div>
  )
}
