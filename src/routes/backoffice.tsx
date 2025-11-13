import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/backoffice')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      backoffice Layout <Outlet />
    </div>
  )
}
