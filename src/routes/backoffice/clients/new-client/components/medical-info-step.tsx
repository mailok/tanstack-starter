import { useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { updateClientMedicalInformation } from '../../api'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { Button } from '@/components/ui/button'
import { PendingFormComponent } from './pending-form'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'
import { until } from 'until-async'

type Props = {
  clientId: string
}

const FORM_ID = 'medical-info-form'

export function MedicalInfoStep({ clientId }: Props) {
  const queryClient = useQueryClient()
  const { step } = useCurrentStep()
  const [{ nextStepToComplete, pendingStep }, dispatch] = useOnboarding()

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId, step),
    enabled: Boolean(clientId) && step !== nextStepToComplete,
  })

  const NEXT_STEP = step + 1
  const PREV_STEP = step - 1

  const updateMedicalMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.updateMedical(clientId),
    mutationFn: updateClientMedicalInformation,
    onSuccess: (_, variables: any) => {
      queryClient.setQueryData(
        clientQueries.onboardingValues(clientId, step).queryKey,
        { values: variables.data.data },
      )
      dispatch({
        type: 'COMPLETE_STEP',
        payload: { step, nextStep: NEXT_STEP },
      })
    },
  })

  const initialValues = data?.values || undefined
  const isStepPending =
    updateMedicalMutation.isPending || pendingStep === PREV_STEP

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      dispatch({ type: 'GO_TO_STEP', payload: NEXT_STEP })
      return
    }
    updateMedicalMutation.mutate({ data: { clientId, data: values } })
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
      <MedicalInfoForm
        id={FORM_ID}
        initialValues={initialValues ?? undefined}
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
