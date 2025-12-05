import { useMutation, useQuery } from '@tanstack/react-query'
import { clientQueries } from '../../queries'
import { updateClientMedicalInformation } from '../../api'
import { StepToFormId } from '../constants'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  step: number
}

export function MedicalInfoStep({ clientId, step }: Props) {
  const { prevStep, nextStep } = useStepperNavigation()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  const updateMedicalMutation = useMutation({
    mutationFn: updateClientMedicalInformation,
    onSuccess: nextStep,
  })

  const initialValues = data?.initialValues || undefined

  function saveAndNavigate(values: any) {
    if (clientId) {
      updateMedicalMutation.mutate({ data: { clientId, data: values } })
    }
  }

  const currentFormId = StepToFormId[step as keyof typeof StepToFormId]

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between h-[40vh]">
      <MedicalInfoForm
        id={currentFormId}
        initialValues={initialValues ?? undefined}
        onSubmit={saveAndNavigate}
      />

      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          Back
        </Button>
        <Button
          form={currentFormId}
          type="submit"
          size="lg"
          disabled={updateMedicalMutation.isPending}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
