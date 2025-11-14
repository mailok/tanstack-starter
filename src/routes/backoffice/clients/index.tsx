import { UnderConstruction } from '@/components/under-construction'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/backoffice/clients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnderConstruction pageName="Clients" />
}
