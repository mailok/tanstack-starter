import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentStep } from '@/components/stepper'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { updateClientMedicalInformation } from '../../api'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { PendingFormComponent } from './pending-form'
import { StepActions } from './step-actions'
import { useOnboarding, useGoToPreviousStep } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'

type Props = {
  clientId: string
}

const FORM_ID = 'medical-info-form'

export function MedicalInfoStep({ clientId }: Props) {
  const queryClient = useQueryClient()
  const { step } = useCurrentStep()
  const [{ nextStepToComplete, pendingStep }, dispatch] = useOnboarding()
  const { goToPreviousStep, prevStep, hasPrev } = useGoToPreviousStep(clientId)

  const shouldFetch = Boolean(clientId) && step !== nextStepToComplete

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId, step),
    enabled: shouldFetch,
  })

  const NEXT_STEP = step + 1

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
    updateMedicalMutation.isPending || pendingStep === prevStep

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      dispatch({ type: 'GO_TO_STEP', payload: NEXT_STEP })
      return
    }
    updateMedicalMutation.mutate({ data: { clientId, data: values } })
  }

  if (isLoading && shouldFetch) {
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

      <StepActions
        formId={FORM_ID}
        isLoading={isStepPending}
        onBack={hasPrev ? goToPreviousStep : undefined}
      />
    </div>
  )
}
