import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { defaultClientSearch } from '../../schemas'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { completeClientOnboarding } from '../../api'
import { BenefitsForm } from '../../components/benefits-form'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  skipLoading?: boolean
}

const FORM_ID = 'benefits-form'

export function BenefitsStep({ clientId, skipLoading }: Props) {
  const { step, prevStep } = useStepperNavigation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  // Skip showing loading state if we're on the next step to complete
  // (there's no data to load for a step that hasn't been filled yet)
  const showLoading = isLoading && !skipLoading

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
      navigate({
        to: '/backoffice/clients/$clientId',
        params: { clientId },
        search: defaultClientSearch,
      })
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

  if (showLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
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
