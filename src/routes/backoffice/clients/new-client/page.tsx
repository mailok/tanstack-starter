import { createFileRoute } from '@tanstack/react-router'
import { PersonalInfoForm } from '../components/personal-info-form'
import { z } from 'zod'

const searchSchema = z.object({
  step: z.number().optional().catch(1),
})

export const Route = createFileRoute('/backoffice/clients/new-client/')({
  component: RouteComponent,
  validateSearch: searchSchema,
})

function RouteComponent() {
  return (
    <>
      <PersonalInfoForm />
    </>
  )
}
