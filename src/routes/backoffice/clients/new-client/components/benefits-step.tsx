import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { completeClientOnboarding } from '../../api'
import { BenefitsForm } from '../../components/benefits-form'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  step: number
}

const FORM_ID = 'benefits-form'

export function BenefitsStep({ clientId, step }: Props) {
  const { prevStep } = useStepperNavigation()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  const completeOnboardingMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.updateBenefits(clientId),
    mutationFn: completeClientOnboarding,
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        clientQueries.onboardingProgress(clientId, step).queryKey,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                initialValues: (variables as any).data.benefits,
              }
            : oldData,
      )
      // navigate({ to: '/backoffice/clients/$clientId', params: { clientId } })
    },
  })

  const initialValues = data?.initialValues || undefined

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!clientId) return
    if (!isDirty) {
      // Proceed or finish? Since it's last step, maybe navigate to list?
      // onSuccess of mutation has no navigate.
      // But button says "Next" (or "Finish"?).
      // Assuming behavior should mimic onSuccess.
      // But onSuccess currently does NOTHING (commented out navigate).
      // If user clicks finish and nothing changed, we probably want to assume success.
      return
    }
    completeOnboardingMutation.mutate({ data: { clientId, benefits: values } })
  }

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between h-[40vh]">
      <BenefitsForm
        id={FORM_ID}
        initialValues={initialValues}
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
          disabled={completeOnboardingMutation.isPending}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
