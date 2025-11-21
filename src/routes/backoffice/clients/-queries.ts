import * as api from './-api'
import type { ClientQuery } from './-schemas'

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
  header: (id: string) => [...clientKeys.all, 'header', id] as const,
}

const insights = () => ({
  queryKey: clientKeys.insights(),
  queryFn: ({ signal: _ }: { signal: AbortSignal }) => api.getClientInsights(),
  throwOnError: true,
  staleTime: 1000 * 30, // 30 seconds
})

const filteredClients = (query: ClientQuery) => ({
  queryKey: clientKeys.list(query),
  queryFn: () => api.getClientsPage({ data: query }),
  throwOnError: true,
  staleTime: 1000 * 3, // 3 seconds
})

const headerInfo = (clientId: string) => ({
  queryKey: clientKeys.header(clientId),
  queryFn: () => api.getClientHeaderInfo({ data: clientId }),
  throwOnError: true,
})

const personalInformation = (clientId: string) => ({
  queryKey: clientKeys.personalInformation(clientId),
  queryFn: () => api.getClientPersonalInformation({ data: clientId }),
  throwOnError: true,
})

const medicalInformation = (clientId: string) => ({
  queryKey: clientKeys.medicalInformation(clientId),
  queryFn: () => api.getClientMedicalInformation({ data: clientId }),
})

const benefits = (clientId: string) => ({
  queryKey: clientKeys.benefits(clientId),
  queryFn: () => api.getClientBenefits({ data: clientId }),
})

export const clientQueries = {
  insights,
  filteredClients,
  headerInfo,
  personalInformation,
  medicalInformation,
  benefits,
}
