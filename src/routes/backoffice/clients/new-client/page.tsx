import { createFileRoute } from '@tanstack/react-router'
import { PersonalInfoForm } from '../components/personal-info-form'
import { Step, Stepper, StepperTitle } from '@/components/stepper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
})

function RouteComponent() {
  const FORM_ID = 'personal-info-form'

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10 h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full mb-14 md:mb-40 md:px-20">
            {/* Mobile view - only active step */}
            <div className="md:hidden">
              <Stepper active={1} orientation="horizontal">
                <Step step={1}>
                  <StepperTitle>Personal Information</StepperTitle>
                </Step>
              </Stepper>
            </div>

            {/* Desktop view - all steps */}
            <div className="hidden md:block w-full">
              <Stepper active={1} orientation="horizontal">
                <Step step={1}>
                  <StepperTitle>Personal Information</StepperTitle>
                </Step>
                <Step step={2}>
                  <StepperTitle>Medical Information</StepperTitle>
                </Step>
                <Step step={3}>
                  <StepperTitle>Benefits</StepperTitle>
                </Step>
              </Stepper>
            </div>
          </div>

          <PersonalInfoForm id={FORM_ID} />
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-8 lg:px-24 pb-4 md:pb-8">
          <Button form={FORM_ID} type="submit" size="lg">
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
