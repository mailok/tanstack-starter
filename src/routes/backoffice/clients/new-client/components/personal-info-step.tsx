import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { clientQueries } from '../../queries'
import { updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  skipLoading?: boolean
}

const FORM_ID = 'personal-info-form'

export function PersonalInfoStep({ clientId, skipLoading }: Props) {
  const { step, nextStep } = useStepperNavigation()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  // Skip showing loading state if we're on the next step to complete
  // (there's no data to load for a step that hasn't been filled yet)
  const showLoading = isLoading && !skipLoading

  const updatePersonalMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updatePersonal(clientId),
    mutationFn: updateClientPersonalInfo,
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

    updatePersonalMutation.mutate({ data: { clientId, data: values } })
  }

  if (showLoading) {
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
          disabled={updatePersonalMutation.isPending}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
