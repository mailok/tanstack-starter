import * as api from './-api'
import { ClientQuery } from './-schemas'

export const clientKeys = {
  all: ['clients'] as const,
  list: (query: ClientQuery) => [...clientKeys.all, query] as const,
  insights: () => [...clientKeys.all, 'insights'] as const,
  client: (id: string) => [...clientKeys.all, 'detail', id] as const,
  personalInformation: (id: string) =>
    [...clientKeys.all, 'personal-information', id] as const,
  medicalInformation: (id: string) =>
    [...clientKeys.all, 'medical-information', id] as const,
  benefits: (id: string) => [...clientKeys.all, 'benefits', id] as const,
}

const insights = () => ({
  queryKey: clientKeys.insights(),
  queryFn: ({ signal: _ }: { signal: AbortSignal }) => api.getClientInsights(),
  throwOnError: true,
})

const filteredClients = (query: ClientQuery) => ({
  queryKey: clientKeys.list(query),
  queryFn: () => api.getClientsPage({ data: query }),
  throwOnError: true,
})

export const clientQueries = {
  insights,
  filteredClients,
}
