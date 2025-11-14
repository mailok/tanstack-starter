import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/backoffice/clients')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
