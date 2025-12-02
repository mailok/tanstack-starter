import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Step, Stepper, StepperTitle } from '@/components/stepper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { useOnboardingProgress } from './hooks/use-onboarding-progress'

export const Route = createFileRoute('/backoffice/clients/new-client')({
  component: RouteComponent,
  pendingMs: 10,
  pendingComponent: RoutePendingComponent,
  staticData: {
    crumb: <Crumb />,
  },
})

function RouteComponent() {
  const { activeStep, completedSteps, isPending } = useOnboardingProgress()

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10 h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full mb-14 md:mb-40 md:px-20">
            {/* Mobile view - only active step */}
            <div className="md:hidden">
              <Stepper
                active={activeStep}
                completed={completedSteps}
                orientation="horizontal"
                pending={isPending}
              >
                <Step step={activeStep}>
                  <StepperTitle>
                    {
                      [
                        { step: 1, title: 'Personal Information' },
                        { step: 2, title: 'Medical Information' },
                        { step: 3, title: 'Benefits' },
                      ].find((s) => s.step === activeStep)?.title
                    }
                  </StepperTitle>
                </Step>
              </Stepper>
            </div>

            {/* Desktop view - all steps */}
            <div className="hidden md:block w-full">
              <Stepper
                active={activeStep}
                completed={completedSteps}
                orientation="horizontal"
                pending={isPending}
              >
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

          <Outlet />
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-8 lg:px-24 pb-4 md:pb-8">
          <Button form="personal-info-form" type="submit" size="lg">
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function Crumb() {
  const search = Route.useSearch()
  return (
    <BreadcrumbItem className="hidden md:block">
      <BreadcrumbLink asChild>
        <Link
          to="/backoffice/clients/new-client"
          search={search}
          preload={false}
        >
          New Client
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}

function RoutePendingComponent() {
  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10 h-full">
      <Card className="w-full h-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full mb-14 md:mb-40 md:px-20">
            {/* Mobile view - only active step */}
            <div className="md:hidden">
              <Stepper active={1} orientation="horizontal" pending={true}>
                <Step step={1}>
                  <StepperTitle>Personal Information</StepperTitle>
                </Step>
              </Stepper>
            </div>

            {/* Desktop view - all steps */}
            <div className="hidden md:block w-full">
              <Stepper active={1} orientation="horizontal" pending={true}>
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
        </CardContent>
        <CardFooter className="flex justify-end px-4 md:px-8 lg:px-24 pb-4 md:pb-8">
          <Skeleton className="h-11 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}
