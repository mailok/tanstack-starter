import { createFileRoute } from '@tanstack/react-router'
import { PersonalInfoForm } from '../components/personal-info-form'

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex size-full flex-col gap-10 items-center justify-center">
      <PersonalInfoForm />
    </div>
  )
}
