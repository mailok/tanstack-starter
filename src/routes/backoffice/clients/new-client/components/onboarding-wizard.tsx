import {
  Step,
  Stepper,
  StepperContent,
  StepperList,
  StepperTitle,
} from '@/components/stepper'
import { Card, CardContent } from '@/components/ui/card'
import { PersonalInfoStep } from './personal-info-step'
import { MedicalInfoStep } from './medical-info-step'
import { BenefitsStep } from './benefits-step'
import { useOnboarding } from '../use-onboarding'

type WizardProps = {
  clientId?: string
  onNavigate?: (step: number) => void
}

export function OnboardingWizard(props: WizardProps) {
  const { clientId } = props
  const [state] = useOnboarding()
  const { step, completedSteps, pendingStep } = state

  function syncUrlValues(step: number) {
    props.onNavigate?.(step)
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8 pb-4 md:pb-6">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full md:px-20 min-h-[40vh]">
            <div className="w-full">
              <Stepper
                active={step}
                completed={completedSteps}
                orientation="horizontal"
                pending={pendingStep}
                onStepChange={syncUrlValues}
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
                  <PersonalInfoStep clientId={clientId} />
                </StepperContent>

                {clientId && (
                  <>
                    <StepperContent step={2}>
                      <MedicalInfoStep clientId={clientId} />
                    </StepperContent>

                    <StepperContent step={3}>
                      <BenefitsStep clientId={clientId} />
                    </StepperContent>
                  </>
                )}
              </Stepper>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
