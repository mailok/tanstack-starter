import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

  const completeOnboardingMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updateBenefits(clientId),
    mutationFn: completeClientOnboarding,
    onMutate: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: step })
    },
    onSettled: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
    },
    onSuccess: async () => {
      navigate({
        to: '/backoffice/clients/$clientId',
        params: { clientId },
        search: defaultClientSearch,
      })
    },
  })

  const initialValues = data?.values || undefined

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      return
    }
    completeOnboardingMutation.mutate({ data: { clientId, benefits: values } })
  }

  async function navigateToPreviousStep() {
    const [error] = await until(async () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: PREV_STEP })
      await queryClient.ensureQueryData({
        ...clientQueries.onboardingValues(clientId, PREV_STEP),
        revalidateIfStale: true,
      })
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
    })

    if (error) {
      // TODO: Handler error appropriately
      console.error(error)
      return
    }

    dispatch({ type: 'NAVIGATE_TO_STEP', payload: PREV_STEP })
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
        disabled={pendingStep === PREV_STEP}
      />
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={navigateToPreviousStep}
          disabled={pendingStep === PREV_STEP}
        >
          Back
        </Button>
        <Button
          form={FORM_ID}
          type="submit"
          size="lg"
          disabled={
            completeOnboardingMutation.isPending || pendingStep === PREV_STEP
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
