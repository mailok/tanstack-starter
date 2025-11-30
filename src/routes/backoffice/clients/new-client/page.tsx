import { createFileRoute } from '@tanstack/react-router'
import { PersonalInfoForm } from '../components/personal-info-form'

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PersonalInfoForm id="personal-info-form" />
    </>
  )
}
