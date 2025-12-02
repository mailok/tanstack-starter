import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Step, Stepper, StepperTitle } from '@/components/stepper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb'
import { useOnboardingProgress } from './hooks/use-onboarding-progress'

export const Route = createFileRoute('/backoffice/clients/new-client')({
  component: RouteComponent,
  staticData: {
    crumb: <Crumb />,
  },
})

function RouteComponent() {
  const { activeStep, completedSteps, isPending } = useOnboardingProgress()

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full max-w-[95%] mx-auto py-4 md:py-10">
      <Card className="w-full">
        <CardContent className="pt-6 md:pt-10 px-4 md:px-8">
          {/* Mobile: Show only active step, centered */}
          <div className="flex justify-center w-full mb-14 md:mb-40 md:px-20">
            <div className="w-full">
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
          search={{
            page: search.page,
            name: search.name,
            status: search.status,
            viewMode: search.viewMode,
          }}
          preload={false}
        >
          New Client
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )
}
