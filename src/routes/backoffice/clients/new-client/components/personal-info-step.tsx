import { useMutation, useQuery } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { PendingFormComponent } from './pending-form'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from '../use-onboarding'
import { useEffect } from 'react'

type Props = {
  clientId?: string
}

const FORM_ID = 'personal-info-form'

export function PersonalInfoStep({ clientId }: Props) {
  const { step } = useCurrentStep()
  const [{ nextStepToComplete }, dispatch] = useOnboarding()

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId!, step),
    enabled: Boolean(clientId) && step !== nextStepToComplete,
  })

  const NEXT_STEP = step + 1

  const createClientMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
  })

  const updatePersonalMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updatePersonal(clientId!),
    mutationFn: updateClientPersonalInfo,
    onSuccess: () => {
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

  useEffect(() => {
    if (isMutationPending) {
      dispatch({ type: 'SET_PENDING_STEP', payload: step })
    } else {
      dispatch({ type: 'SET_PENDING_STEP', payload: undefined })
    }
  }, [step, isMutationPending])

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
