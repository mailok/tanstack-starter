import { Step, Stepper, StepperList, StepperTitle } from '@/components/stepper'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PendingWizard() {
  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8 pb-4 md:pb-6">
          <div className="flex justify-center w-full md:px-20 min-h-[40vh]">
            <div className="w-full">
              <Stepper
                active={1}
                orientation="horizontal"
                pending={true}
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

                {/* Form Skeleton */}
                <div className="w-full space-y-4 md:space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  {/* Birth Date & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              </Stepper>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-8 lg:px-24 pb-4 md:pb-8">
          <Skeleton className="h-11 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}
