import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { updateClientMedicalInformation } from '../../api'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { Button } from '@/components/ui/button'
import { PendingFormComponent } from './pending-form'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from '../use-onboarding'
import { useEffect } from 'react'
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

  const updateMedicalMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updateMedical(clientId),
    mutationFn: updateClientMedicalInformation,
    onSuccess: async () => {
      dispatch({ type: 'NAVIGATE_TO_STEP', payload: NEXT_STEP })
    },
  })

  const initialValues = data?.values || undefined

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      dispatch({ type: 'NAVIGATE_TO_STEP', payload: NEXT_STEP })
      return
    }
    updateMedicalMutation.mutate({ data: { clientId, data: values } })
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

  useEffect(() => {
    if (updateMedicalMutation.isPending) {
      dispatch({ type: 'SET_PENDING_STEP', payload: step })
    } else {
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
    }
  }, [step, updateMedicalMutation.isPending])

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <MedicalInfoForm
        id={FORM_ID}
        initialValues={initialValues ?? undefined}
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
            updateMedicalMutation.isPending || pendingStep === PREV_STEP
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
