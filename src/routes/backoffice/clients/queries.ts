import { queryOptions } from '@tanstack/react-query'
import * as api from './api'
import type { ClientQuery } from './schemas'

export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (query: ClientQuery) => [...clientKeys.lists(), query] as const,
  insights: () => [...clientKeys.all, 'insights'] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  personalInformation: (id: string) =>
    [...clientKeys.detail(id), 'personal-information'] as const,
  medicalInformation: (id: string) =>
    [...clientKeys.detail(id), 'medical-information'] as const,
  benefits: (id: string) => [...clientKeys.detail(id), 'benefits'] as const,
  header: (id: string) => [...clientKeys.detail(id), 'header'] as const,
  onboardingValues: (id: string, step: number) =>
    ['onboarding-values', id, step] as const,
  onboardingProgress: (id: string | undefined) =>
    ['onboarding-progress', ...(id ? [id] : [])] as const,
}

export const clientQueries = {
  insights: () =>
    queryOptions({
      queryKey: clientKeys.insights(),
      queryFn: () => api.getClientInsights(),
      throwOnError: true,
      staleTime: 1000 * 30, // 30 seconds
    }),

  list: (query: ClientQuery) =>
    queryOptions({
      queryKey: clientKeys.list(query),
      queryFn: () => api.getClientsPage({ data: query }),
      throwOnError: true,
      staleTime: 1000 * 3, // 3 seconds
    }),

  header: (clientId: string) =>
    queryOptions({
      queryKey: clientKeys.header(clientId),
      queryFn: () => api.getClientHeaderInfo({ data: clientId }),
      throwOnError: true,
    }),

  personalInformation: (clientId: string) =>
    queryOptions({
      queryKey: clientKeys.personalInformation(clientId),
      queryFn: () => api.getClientPersonalInformation({ data: clientId }),
      throwOnError: true,
    }),

  medicalInformation: (clientId: string) =>
    queryOptions({
      queryKey: clientKeys.medicalInformation(clientId),
      queryFn: () => api.getClientMedicalInformation({ data: clientId }),
    }),

  benefits: (clientId: string) =>
    queryOptions({
      queryKey: clientKeys.benefits(clientId),
      queryFn: () => api.getClientBenefits({ data: clientId }),
    }),

  onboardingValues: (clientId: string, step: number) =>
    queryOptions({
      queryKey: clientKeys.onboardingValues(clientId, step),
      queryFn: () => api.getOnboardingValues({ data: { clientId, step } }),
    }),

  onboardingProgress: (clientId: string | undefined, step: number | undefined) =>
    queryOptions({
      queryKey: clientKeys.onboardingProgress(clientId),
      queryFn: () => {
        if (!clientId) {
          return {
            isCompleted: false,
            nextOnboardingStep: 1,
            activeStep: 1,
            completedSteps: [],
            redirectMessage: null,
          }
        }
        return api.getOnboardingProgress({ data: { clientId, step } })
      },
      throwOnError: true
    }),
}
