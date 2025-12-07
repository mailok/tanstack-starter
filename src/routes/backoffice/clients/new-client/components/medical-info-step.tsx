import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { updateClientMedicalInformation } from '../../api'
import { MedicalInfoForm } from '../../components/medical-info-form'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  skipLoading?: boolean
}

const FORM_ID = 'medical-info-form'

export function MedicalInfoStep({ clientId, skipLoading }: Props) {
  const { step, prevStep, nextStep } = useStepperNavigation()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  // Skip showing loading state if we're on the next step to complete
  // (there's no data to load for a step that hasn't been filled yet)
  const showLoading = isLoading && !skipLoading

  const updateMedicalMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updateMedical(clientId),
    mutationFn: updateClientMedicalInformation,
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        clientQueries.onboardingProgress(clientId, step).queryKey,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                initialValues: (variables as any).data.data,
              }
            : oldData,
      )
      nextStep()
    },
  })

  const initialValues = data?.initialValues || undefined

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      nextStep()
      return
    }
    if (clientId) {
      updateMedicalMutation.mutate({ data: { clientId, data: values } })
    }
  }

  if (showLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <MedicalInfoForm
        id={FORM_ID}
        initialValues={initialValues ?? undefined}
        onSubmit={saveAndNavigate}
      />

      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          Back
        </Button>
        <Button
          form={FORM_ID}
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
