import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { PendingFormComponent } from './pending-form'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from '../use-onboarding'

type Props = {
  clientId?: string
}

const FORM_ID = 'personal-info-form'

export function PersonalInfoStep({ clientId }: Props) {
  const { step } = useCurrentStep()
  const queryClient = useQueryClient()
  const [{ nextStepToComplete }, dispatch] = useOnboarding()

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId!, step),
    enabled: Boolean(clientId) && step !== nextStepToComplete,
  })

  const NEXT_STEP = step + 1

  const createClientMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
    onMutate: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: step })
    },
    onSettled: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
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
      }
      dispatch({
        type: 'START_ONBOARDING',
        payload: { clientId: data?.id },
      })
    },
  })

  const updatePersonalMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updatePersonal(clientId!),
    mutationFn: updateClientPersonalInfo,
    onMutate: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: step })
    },
    onSettled: () => {
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
    },
    onSuccess: (_, variables: any) => {
      queryClient.setQueryData(
        clientQueries.onboardingValues(clientId!, step).queryKey,
        { values: variables.data.data },
      )
      dispatch({ type: 'NAVIGATE_TO_STEP', payload: NEXT_STEP })
    },
  })

  const initialValues = data?.values || undefined
  const isMutationPending =
    updatePersonalMutation.isPending || createClientMutation.isPending

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      dispatch({ type: 'NAVIGATE_TO_STEP', payload: NEXT_STEP })
      return
    }

    if (!clientId) {
      createClientMutation.mutate({ data: values })
    } else {
      updatePersonalMutation.mutate({ data: { clientId, data: values } })
    }
  }

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <PersonalInfoForm
        id={FORM_ID}
        initialValues={initialValues}
        onSubmit={saveAndNavigate}
      />

      <div className="flex justify-end">
        <Button
          form={FORM_ID}
          type="submit"
          size="lg"
          disabled={isMutationPending}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
