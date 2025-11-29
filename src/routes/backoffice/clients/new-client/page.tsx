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
    <div className="flex flex-col gap-8 w-full max-w-[95%] min-w-[600px] mx-auto py-10 h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-10 px-8">
          <div className="flex justify-center w-full mb-40 md:px-20">
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

          <PersonalInfoForm id={FORM_ID} />
        </CardContent>
        <CardFooter className="flex justify-end px-8 md:px-24 pb-8">
          <Button form={FORM_ID} type="submit" size="lg">
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
