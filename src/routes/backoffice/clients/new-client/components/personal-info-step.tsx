import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { PersonalInfoForm } from '../../components/personal-info-form'
import { clientQueries } from '../../queries'
import { createClient, updateClientPersonalInfo } from '../../api'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  step: number
}

const FORM_ID = 'personal-info-form'

export function PersonalInfoStep({ clientId, step }: Props) {
  const { nextStep } = useStepperNavigation()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  const createClientMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: clientQueries.onboardingProgress(clientId, step).queryKey,
      })
      nextStep()
    },
  })

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

    if (clientId) {
      updatePersonalMutation.mutate({ data: { clientId, data: values } })
    } else {
      createClientMutation.mutate({ data: values })
    }
  }

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between h-[40vh]">
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
