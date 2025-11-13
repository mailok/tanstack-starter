import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/backoffice/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/backoffice/"!</div>
}
