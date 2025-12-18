import { useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { PendingFormComponent } from './pending-form'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'

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

  const createClientMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
    onSuccess: (data, variables: any) => {
      if (data?.id) {
        queryClient.setQueryData(
          clientQueries.onboardingValues(data.id, step).queryKey,
          { values: variables.data },
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

  if (isLoading) {
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

      <div className="flex justify-end">
        <Button form={FORM_ID} type="submit" size="lg" disabled={isStepPending}>
          Next
        </Button>
      </div>
    </div>
  )
}
