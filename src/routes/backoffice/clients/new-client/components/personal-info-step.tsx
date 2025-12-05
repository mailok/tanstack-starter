import { useMutation, useQuery } from '@tanstack/react-query'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { StepToFormId } from '../constants'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  step: number
}

export function PersonalInfoStep({ clientId, step }: Props) {
  const { nextStep } = useStepperNavigation()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  const createClientMutation = useMutation({
    mutationFn: createClient,
    onSuccess: nextStep,
  })

  const updatePersonalMutation = useMutation({
    mutationFn: updateClientPersonalInfo,
    onSuccess: nextStep,
  })

  const initialValues = data?.initialValues || undefined

  function saveAndNavigate(values: any) {
    if (clientId) {
      updatePersonalMutation.mutate({ data: { clientId, data: values } })
    } else {
      createClientMutation.mutate({ data: values })
    }
  }

  const currentFormId = StepToFormId[step as keyof typeof StepToFormId]

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between h-[40vh]">
      <PersonalInfoForm
        id={currentFormId}
        initialValues={initialValues}
        onSubmit={saveAndNavigate}
      />

      <div className="flex justify-end">
        <Button
          form={currentFormId}
          type="submit"
          size="lg"
          disabled={
            createClientMutation.isPending || updatePersonalMutation.isPending
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
