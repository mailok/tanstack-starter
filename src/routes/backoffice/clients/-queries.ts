import db from "@/db"
import { createServerFn } from "@tanstack/react-start"

export type ClientQuery = {
  status?: string
  search?: string
  page?: number
  size?: number
}

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

export const clientQuieries = {
  insights: () => ({
    queryKey: clientKeys.insights(),
    queryFn: ({ signal: _ }: { signal: AbortSignal }) => getClientInsights(),
    throwOnError: true,
  }),
}

const getClientInsights = createServerFn({ method: 'GET' }).handler(
  async () => {
    /* await new Promise((resolve) => setTimeout(resolve, 6000)) */

    /*  const flag = true
    if (flag) {
      throw new Error('Error loading client insights')
    } */

    return {
      active: await db.clients.countByStatus('active'),
      inactive: await db.clients.countByStatus('inactive'),
      pending: await db.clients.countByStatus('pending'),
      total: await db.clients.count(),
    } as const
  },
)