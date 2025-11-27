import { createFileRoute, redirect } from '@tanstack/react-router'
import { defaultClientSearch } from '../schemas'

export const Route = createFileRoute('/backoffice/clients/$clientId/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/backoffice/clients/$clientId/personal-info',
      params: { clientId: params.clientId },
      search: (prev) => ({ ...defaultClientSearch, ...prev }),
    })
  },
})
