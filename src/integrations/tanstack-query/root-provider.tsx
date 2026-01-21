import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query'
import { toast } from 'sonner'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey
      successMessage?: string
      errorMessage?: string
    }
  }
}

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD,
        /* staleTime: 10 * 1000 */ // 10s
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          toast.success(mutation.meta.successMessage, {
            position: 'top-right',
            duration: 5000,
          })
        }
      },
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          console.error(error)
          toast.error(mutation.meta.errorMessage, {
            position: 'top-right',
            duration: 5000,
          })
        }
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidateQueries,
          })
        }
      },
    }),
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
