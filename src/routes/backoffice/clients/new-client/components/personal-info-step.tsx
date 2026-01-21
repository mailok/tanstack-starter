import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCurrentStep } from '@/components/stepper'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { PendingFormComponent } from './pending-form'
import { StepActions } from './step-actions'
import { useOnboarding, FIRST_STEP } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'

type Props = {
  clientId?: string
}

const FORM_ID = 'personal-info-form'

export function PersonalInfoStep({ clientId }: Props) {
  const { step } = useCurrentStep()
  const queryClient = useQueryClient()
  const [{ nextStepToComplete }, dispatch] = useOnboarding()

  const shouldFetch = Boolean(clientId) && step !== nextStepToComplete

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId!, step),
    enabled: shouldFetch,
  })

  const NEXT_STEP = step + 1
  const isFirstStep = step === FIRST_STEP

  const createClientMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
    meta: {
      errorMessage:
        'We were unable to create the client. Please try again later or contact support.',
    },
    onSuccess: (data, variables: any) => {
      if (data?.id) {
        queryClient.setQueryData(
          clientQueries.onboardingValues(data.id, step).queryKey,
          { values: variables.data },
        )
        queryClient.setQueryData(
          clientQueries.onboardingProgress(data.id, step).queryKey,
          {
            isCompleted: false,
            nextOnboardingStep: NEXT_STEP,
            activeStep: NEXT_STEP,
            completedSteps: [step],
            redirectMessage: null,
          },
        )
        dispatch({
          type: 'CLIENT_CREATED',
          payload: { clientId: data.id, currentStep: step },
        })
      }
    },
  })

  const updatePersonalMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.updatePersonal(clientId!),
    mutationFn: updateClientPersonalInfo,
    meta: {
      errorMessage:
        'We were unable to update the personal information. Please try again later or contact support.',
    },
    onSuccess: (_, variables: any) => {
      queryClient.setQueryData(
        clientQueries.onboardingValues(clientId!, step).queryKey,
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
    updatePersonalMutation.isPending || createClientMutation.isPending

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      dispatch({ type: 'GO_TO_STEP', payload: NEXT_STEP })
      return
    }

    if (!clientId) {
      createClientMutation.mutate({ data: values })
    } else {
      updatePersonalMutation.mutate({ data: { clientId, data: values } })
    }
  }

  if (isLoading && shouldFetch) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <PersonalInfoForm
        id={FORM_ID}
        initialValues={initialValues}
        onSubmit={saveAndNavigate}
        disabled={isStepPending}
      />

      <StepActions
        formId={FORM_ID}
        isLoading={isStepPending}
        onBack={isFirstStep ? undefined : undefined} // First step has no back
      />
    </div>
  )
}
