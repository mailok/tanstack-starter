import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PersonalInfoForm } from '../components/personal-info-form'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  useMutation,
  useIsMutating,
  useQueryClient,
} from '@tanstack/react-query'
import { createClient } from '../api'
import { clientMutationKeys } from '../mutations'
import { clientKeys } from '../queries'
import { defaultClientSearch } from '../schemas'
import {
  Step,
  Stepper,
  StepperContent,
  StepperList,
  StepperTitle,
} from '@/components/stepper'

const FORM_ID = 'create-client-form'

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createClientMutation = useMutation({
    mutationKey: clientMutationKeys.onboarding.create(),
    mutationFn: createClient,
    onSuccess: async (data, variables) => {
      const clientId = data.id
      const targetStep = 2
      const personalInfoData = variables?.data

      // Base progress data for a newly created client
      const baseProgressData = {
        isCompleted: false,
        nextOnboardingStep: 2, // Step 1 completed, step 2 is next
        completedSteps: [1],
        redirectMessage: null,
      }

      // Cache for step 2 (target page) - no initialValues yet
      queryClient.setQueryData(
        clientKeys.onboardingProgress(clientId, targetStep),
        {
          ...baseProgressData,
          currentViewStep: targetStep,
          initialValues: null,
        },
      )

      // Cache for step 1 (in case user goes back) - with the form data
      queryClient.setQueryData(clientKeys.onboardingProgress(clientId, 1), {
        ...baseProgressData,
        currentViewStep: 1,
        initialValues: personalInfoData,
      })

      // Cache without step (used in beforeLoad)
      queryClient.setQueryData(
        clientKeys.onboardingProgress(clientId, undefined),
        {
          ...baseProgressData,
          currentViewStep: targetStep,
          initialValues: null,
        },
      )

      navigate({
        to: '/backoffice/clients/new-client/$clientId',
        params: { clientId },
        search: { ...defaultClientSearch, step: targetStep },
      })
    },
  })

  const isCreating =
    useIsMutating({
      mutationKey: clientMutationKeys.onboarding.create(),
    }) > 0

  function handleSubmit(values: any) {
    createClientMutation.mutate({ data: values })
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8 pb-4 md:pb-6">
          <div className="flex justify-center w-full md:px-20 min-h-[40vh]">
            <div className="w-full">
              <Stepper
                active={1}
                completed={[]}
                orientation="horizontal"
                pending={isCreating ? 1 : undefined}
                className="flex flex-col justify-between"
              >
                <StepperList>
                  <Step step={1}>
                    <StepperTitle>Personal Information</StepperTitle>
                  </Step>
                  <Step step={2}>
                    <StepperTitle>Medical Information</StepperTitle>
                  </Step>
                  <Step step={3}>
                    <StepperTitle>Benefits</StepperTitle>
                  </Step>
                </StepperList>

                <StepperContent step={1}>
                  <div className="flex flex-col justify-between min-h-[60vh] gap-8">
                    <PersonalInfoForm id={FORM_ID} onSubmit={handleSubmit} />

                    <div className="flex justify-end">
                      <Button
                        form={FORM_ID}
                        type="submit"
                        size="lg"
                        disabled={createClientMutation.isPending}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </StepperContent>
              </Stepper>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
