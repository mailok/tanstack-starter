import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useCurrentStep } from '@/components/stepper'
import { defaultClientSearch } from '../../schemas'
import { clientMutationKeys } from '../../mutations'
import { clientQueries } from '../../queries'
import { completeClientOnboarding } from '../../api'
import { BenefitsForm } from '../../components/benefits-form'
import { PendingFormComponent } from './pending-form'
import { StepActions } from './step-actions'
import { useOnboarding, useGoToPreviousStep } from '../use-onboarding'
import { useOnboardingMutation } from '../use-onboarding-mutation'

type Props = {
  clientId: string
}

const FORM_ID = 'benefits-form'

export function BenefitsStep({ clientId }: Props) {
  const { step } = useCurrentStep()
  const navigate = useNavigate()
  const [{ nextStepToComplete, pendingStep }] = useOnboarding()
  const { goToPreviousStep, prevStep, hasPrev } = useGoToPreviousStep(clientId)

  const shouldFetch = Boolean(clientId) && step !== nextStepToComplete

  const { data, isLoading } = useQuery({
    ...clientQueries.onboardingValues(clientId, step),
    enabled: shouldFetch,
  })

  const completeOnboardingMutation = useOnboardingMutation({
    mutationKey: clientMutationKeys.onboarding.updateBenefits(clientId),
    mutationFn: completeClientOnboarding,
    onSuccess: () => {
      navigate({
        to: '/backoffice/clients/$clientId',
        params: { clientId },
        search: defaultClientSearch,
      })
    },
  })

  const initialValues = data?.values || undefined
  const isStepPending =
    completeOnboardingMutation.isPending || pendingStep === prevStep

  function saveAndNavigate(values: any, isDirty: boolean) {
    if (!isDirty) {
      return
    }
    completeOnboardingMutation.mutate({ data: { clientId, benefits: values } })
  }

  if (isLoading && shouldFetch) {
    return <PendingFormComponent />
  }

  return (
    <div className="flex flex-col justify-between min-h-[60vh] gap-8">
      <BenefitsForm
        id={FORM_ID}
        initialValues={initialValues}
        onSubmit={saveAndNavigate}
        disabled={isStepPending}
      />

      <StepActions
        formId={FORM_ID}
        isLoading={isStepPending}
        onBack={hasPrev ? goToPreviousStep : undefined}
        submitLabel="Complete Onboarding"
      />
    </div>
  )
}
