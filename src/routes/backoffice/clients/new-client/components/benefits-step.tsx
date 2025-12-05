import { useMutation, useQuery } from '@tanstack/react-query'
import { clientQueries } from '../../queries'
import { completeClientOnboarding } from '../../api'
import { StepToFormId } from '../constants'
import { BenefitsForm } from '../../components/benefits-form'
import { Button } from '@/components/ui/button'
import { useStepperNavigation } from '@/components/stepper'
import { PendingFormComponent } from './pending-form'

type Props = {
  clientId: string
  step: number
}

export function BenefitsStep({ clientId, step }: Props) {
  const { prevStep } = useStepperNavigation()

  const { data, isLoading } = useQuery(
    clientQueries.onboardingProgress(clientId, step),
  )

  const completeOnboardingMutation = useMutation({
    mutationFn: completeClientOnboarding,
    onSuccess: () => {
      // navigate({ to: '/backoffice/clients/$clientId', params: { clientId } })
    },
  })

  const initialValues = data?.initialValues || undefined
  const currentFormId = StepToFormId[step as keyof typeof StepToFormId]

  function saveAndNavigate(values: any) {
    if (!clientId) return
    completeOnboardingMutation.mutate({ data: { clientId, benefits: values } })
  }

  if (isLoading) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between h-[40vh]">
      <BenefitsForm
        id={StepToFormId[3]}
        initialValues={initialValues}
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
          disabled={completeOnboardingMutation.isPending}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
