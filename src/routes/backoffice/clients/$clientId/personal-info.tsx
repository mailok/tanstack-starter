import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { ClientSearchSchema, defaultClientSearch } from '../-schemas'
import { clientQueries } from '@/routes/backoffice/clients/-queries'
import { PersonalInformation } from './-components/personal-information'

export const Route = createFileRoute(
  '/backoffice/clients/$clientId/personal-info',
)({
  validateSearch: ClientSearchSchema,
  search: {
    middlewares: [stripSearchParams(defaultClientSearch)],
  },
  loader: function ({ context: { queryClient }, params: { clientId } }) {
    queryClient.prefetchQuery(clientQueries.personalInformation(clientId))
  },
  component: PersonalInfo,
})

export function PersonalInfo() {
  const { clientId } = Route.useParams()
  return <PersonalInformation clientId={clientId} />
}
